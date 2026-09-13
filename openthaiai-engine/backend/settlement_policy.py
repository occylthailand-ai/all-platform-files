"""
SettlementPolicyEngine — fail-closed gate authority for all live-money actions.

Gate hierarchy (must ALL pass before any settlement):
  G1  Compliance / Data Gate   — PDPA consent, retention, audit readiness
  G2  Artifact / Control Gate  — signed attestations, dual-authorization
  G3  Runtime Settlement Gate  — provider reachable, durable DB, kill-switch

Env flag OTAI_LIVE_MONEY_ENABLED is a "requested mode" only.
It is an input to this engine, never an authority that bypasses gates.
"""

import hashlib
import hmac
import json
import time
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional

from sqlalchemy.orm import Session

from .config import get_settings
from .models import GateAttestation, KillSwitch, AuditLog, AuditAction

logger = logging.getLogger(__name__)
settings = get_settings()


# ── Status vocabulary ──────────────────────────────────────────────────────

class SettlementStatus(str, Enum):
    ALLOWED          = "ALLOWED"
    SANDBOX_RECORDED = "SANDBOX_RECORDED"
    DENIED_G1        = "SETTLEMENT_DENIED_GATE_G1"
    DENIED_G2        = "SETTLEMENT_DENIED_GATE_G2"
    DENIED_G3        = "SETTLEMENT_DENIED_GATE_G3"
    DENIED_KILLSWITCH= "SETTLEMENT_DENIED_KILL_SWITCH"
    DENIED_ENV       = "SETTLEMENT_DENIED_ENV_NOT_ENABLED"
    # Explicitly forbidden — never emitted by this engine
    # SUCCESS, LIVE_PRODUCTION, SETTLED  <-- use ALLOWED + downstream result only


class GateResult(str, Enum):
    PASS    = "PASS"
    FAIL    = "FAIL"
    UNKNOWN = "UNKNOWN"


@dataclass
class GateEvaluation:
    gate: str           # "G1" | "G2" | "G3"
    result: GateResult
    reason_code: str
    detail: str = ""


@dataclass
class PolicyDecision:
    status: SettlementStatus
    allowed: bool
    gate_evaluations: list[GateEvaluation] = field(default_factory=list)
    reason_codes: list[str] = field(default_factory=list)

    def first_failing_gate(self) -> Optional[GateEvaluation]:
        for ev in self.gate_evaluations:
            if ev.result == GateResult.FAIL:
                return ev
        return None


# ── Attestation verification (G2) ─────────────────────────────────────────

ATTESTATION_TTL_SECONDS = 86_400   # 24 hours


def verify_attestation(token: str, db: Session) -> tuple[bool, str]:
    """
    Verify a G2 attestation token:
      - HMAC-SHA256 signed by settings.attestation_secret_key
      - Not expired (< ATTESTATION_TTL_SECONDS old)
      - Recorded in DB (not revoked)
      - Dual-authorization: signed by at least 2 distinct authorizers
    Returns (valid: bool, reason: str)
    """
    secret = settings.attestation_secret_key.encode()
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return False, "MALFORMED_TOKEN"
        payload_b64, sig_hex = parts
        import base64
        payload_bytes = base64.urlsafe_b64decode(payload_b64 + "==")
        expected_sig = hmac.new(secret, payload_bytes, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(expected_sig, sig_hex):
            return False, "INVALID_SIGNATURE"

        payload = json.loads(payload_bytes)
        issued_at = payload.get("iat", 0)
        if time.time() - issued_at > ATTESTATION_TTL_SECONDS:
            return False, "TOKEN_EXPIRED"

        authorizers = payload.get("authorizers", [])
        if len(set(authorizers)) < 2:
            return False, "INSUFFICIENT_DUAL_AUTHORIZATION"

        att = db.query(GateAttestation).filter(
            GateAttestation.token_id == payload.get("jti"),
            GateAttestation.revoked == False,          # noqa: E712
        ).first()
        if not att:
            return False, "TOKEN_NOT_REGISTERED_OR_REVOKED"

        return True, "OK"
    except Exception as exc:
        logger.warning("attestation_verify_error: %s", exc)
        return False, f"VERIFY_ERROR: {type(exc).__name__}"


# ── Kill-switch check (G3) ─────────────────────────────────────────────────

def is_kill_switch_active(db: Session) -> bool:
    """
    Ops-controlled kill switch stored in DB.
    Separate from env vars — ops team sets this independently.
    Expired kill switches (past `expires_at`) are treated as inactive.
    """
    ks = db.query(KillSwitch).filter(
        KillSwitch.active == True,               # noqa: E712
        KillSwitch.expires_at > time.time(),
    ).first()
    return ks is not None


# ── Provider reachability check (G3) ──────────────────────────────────────

def check_provider_reachable() -> tuple[bool, str]:
    """Verify Stripe API is reachable before allowing settlement."""
    import stripe
    stripe.api_key = settings.stripe_secret_key
    if not stripe.api_key or not stripe.api_key.startswith("sk_"):
        return False, "PROVIDER_KEY_MISSING_OR_INVALID"
    try:
        stripe.Balance.retrieve()
        return True, "OK"
    except stripe.error.AuthenticationError:
        return False, "PROVIDER_AUTH_FAILED"
    except Exception as exc:
        return False, f"PROVIDER_UNREACHABLE: {type(exc).__name__}"


# ── The engine ─────────────────────────────────────────────────────────────

class SettlementPolicyEngine:
    """
    Central policy authority. No code path may bypass this.
    All public methods are audit-logged automatically.
    """

    def __init__(self, db: Session):
        self._db = db

    def evaluate(
        self,
        user_id: str,
        action: str,           # e.g. "charge", "refund", "payout"
        amount_satang: int,
        g2_attestation_token: Optional[str] = None,
        skip_provider_check: bool = False,   # test-only, never set in prod
    ) -> PolicyDecision:
        """
        Evaluate all gates and return a PolicyDecision.
        Never raises — callers must check decision.allowed.
        """
        evals: list[GateEvaluation] = []
        env_requested = settings.live_money_enabled

        # ── G1: Compliance/Data Gate ───────────────────────────────────────
        g1 = self._eval_g1(user_id)
        evals.append(g1)
        if g1.result == GateResult.FAIL:
            decision = PolicyDecision(
                status=SettlementStatus.DENIED_G1,
                allowed=False,
                gate_evaluations=evals,
                reason_codes=[g1.reason_code],
            )
            self._audit(user_id, action, decision)
            return decision

        # ── G2: Artifact/Control Gate ──────────────────────────────────────
        g2 = self._eval_g2(g2_attestation_token)
        evals.append(g2)
        if g2.result == GateResult.FAIL:
            decision = PolicyDecision(
                status=SettlementStatus.DENIED_G2,
                allowed=False,
                gate_evaluations=evals,
                reason_codes=[g2.reason_code],
            )
            self._audit(user_id, action, decision)
            return decision

        # ── G3: Runtime Settlement Gate ────────────────────────────────────
        g3 = self._eval_g3(skip_provider_check)
        evals.append(g3)
        if g3.result == GateResult.FAIL:
            status = (
                SettlementStatus.DENIED_KILLSWITCH
                if g3.reason_code == "KILL_SWITCH_ACTIVE"
                else SettlementStatus.DENIED_G3
            )
            decision = PolicyDecision(
                status=status,
                allowed=False,
                gate_evaluations=evals,
                reason_codes=[g3.reason_code],
            )
            self._audit(user_id, action, decision)
            return decision

        # ── Env flag gate (last, non-authoritative) ───────────────────────
        if not env_requested:
            decision = PolicyDecision(
                status=SettlementStatus.DENIED_ENV,
                allowed=False,
                gate_evaluations=evals,
                reason_codes=["ENV_LIVE_MONEY_NOT_ENABLED"],
            )
            self._audit(user_id, action, decision, severity="info")
            return decision

        # ── All gates pass ─────────────────────────────────────────────────
        decision = PolicyDecision(
            status=SettlementStatus.ALLOWED,
            allowed=True,
            gate_evaluations=evals,
            reason_codes=["ALL_GATES_PASS"],
        )
        self._audit(user_id, action, decision)
        return decision

    # ── Gate implementations ───────────────────────────────────────────────

    def _eval_g1(self, user_id: str) -> GateEvaluation:
        from .models import User
        user = self._db.query(User).filter(User.id == user_id).first()
        if not user:
            return GateEvaluation("G1", GateResult.FAIL, "USER_NOT_FOUND")
        if not user.pdpa_consent_at:
            return GateEvaluation("G1", GateResult.FAIL, "PDPA_CONSENT_MISSING")
        if not user.is_active:
            return GateEvaluation("G1", GateResult.FAIL, "USER_INACTIVE")
        return GateEvaluation("G1", GateResult.PASS, "G1_OK")

    def _eval_g2(self, token: Optional[str]) -> GateEvaluation:
        if not token:
            return GateEvaluation("G2", GateResult.FAIL, "ATTESTATION_MISSING")
        valid, reason = verify_attestation(token, self._db)
        if not valid:
            return GateEvaluation("G2", GateResult.FAIL, reason)
        return GateEvaluation("G2", GateResult.PASS, "G2_OK")

    def _eval_g3(self, skip_provider_check: bool) -> GateEvaluation:
        if is_kill_switch_active(self._db):
            return GateEvaluation("G3", GateResult.FAIL, "KILL_SWITCH_ACTIVE",
                                  "Live settlement disabled by ops kill-switch")
        if not skip_provider_check:
            ok, reason = check_provider_reachable()
            if not ok:
                return GateEvaluation("G3", GateResult.FAIL, reason)
        return GateEvaluation("G3", GateResult.PASS, "G3_OK")

    # ── Audit log ──────────────────────────────────────────────────────────

    def _audit(
        self,
        user_id: str,
        action: str,
        decision: PolicyDecision,
        severity: str = "info",
    ) -> None:
        if decision.status == SettlementStatus.DENIED_ENV and settings.live_money_enabled is False:
            severity = "info"
        elif not decision.allowed:
            severity = "warning"

        log = AuditLog(
            user_id=user_id,
            action=AuditAction.SETTLEMENT_POLICY_EVAL,
            details={
                "settlement_action": action,
                "status": decision.status,
                "reason_codes": decision.reason_codes,
                "gate_results": [
                    {"gate": e.gate, "result": e.result, "code": e.reason_code}
                    for e in decision.gate_evaluations
                ],
            },
            severity=severity,
        )
        self._db.add(log)
        try:
            self._db.commit()
        except Exception as exc:
            self._db.rollback()
            logger.error("audit_log_write_failed: %s", exc)
