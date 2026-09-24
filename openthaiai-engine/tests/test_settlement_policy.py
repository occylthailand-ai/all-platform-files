"""
Settlement Policy Engine — comprehensive test suite.

Tests cover:
  - Fail-closed default (no token → deny)
  - Gate evaluation order (G1 fails first even when G2/G3 would also fail)
  - False-success prevention (SUCCESS/LIVE_PRODUCTION/SETTLED never emitted)
  - Truthful-audit contract (every evaluation writes an AuditLog row)
  - Kill-switch blocks settlement even when all other gates pass
  - PDPA consent absence blocks at G1
  - Dual-authorization requirement (single-signer token → G2 fail)
  - Env flag semantics (live_money_enabled=False → DENIED_ENV, not security gate)
  - ALLOWED only when every gate actually passes
"""

import base64
import hashlib
import hmac
import json
import time
import uuid
from unittest.mock import MagicMock, patch

import pytest

# ---------------------------------------------------------------------------
# Lightweight in-memory DB stub so tests run without a real PostgreSQL
# ---------------------------------------------------------------------------

class _FakeQuery:
    def __init__(self, rows):
        self._rows = rows

    def filter(self, *args, **kwargs):
        return self

    def first(self):
        return self._rows[0] if self._rows else None


class FakeDB:
    def __init__(self):
        self._committed = []
        self._added = []
        self._users = {}
        self._attestations = {}
        self._kill_switches = []

    def query(self, model):
        from backend.models import User, GateAttestation, KillSwitch
        if model is User:
            return _FakeQuery(list(self._users.values()))
        if model is GateAttestation:
            return _FakeQuery([
                a for a in self._attestations.values()
                if not a.revoked
            ])
        if model is KillSwitch:
            active = [
                k for k in self._kill_switches
                if k.active and k.expires_at > time.time()
            ]
            return _FakeQuery(active)
        return _FakeQuery([])

    def add(self, obj):
        self._added.append(obj)

    def commit(self):
        self._committed.append(list(self._added))
        self._added.clear()

    def rollback(self):
        self._added.clear()


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SECRET = "test_secret_key_32_bytes_padding!"


def _make_user(pdpa=True, active=True):
    from backend.models import User
    u = User.__new__(User)
    u.id = str(uuid.uuid4())
    u.pdpa_consent_at = time.time() if pdpa else None
    u.is_active = active
    return u


def _make_attestation_token(db: FakeDB, authorizers=None, iat=None, expired=False):
    """
    Build a valid HMAC-SHA256 attestation token and register it in the fake DB.
    Returns (token_str, token_id).
    """
    if authorizers is None:
        authorizers = ["ops-alice", "ops-bob"]
    token_id = str(uuid.uuid4())
    issued_at = iat if iat is not None else (int(time.time()) - 3600)  # 1 h ago
    if expired:
        issued_at = int(time.time()) - 90_000  # > 86_400 s

    payload = json.dumps({"jti": token_id, "iat": issued_at, "authorizers": authorizers}).encode()
    payload_b64 = base64.urlsafe_b64encode(payload).rstrip(b"=").decode()
    sig = hmac.new(SECRET.encode(), payload, hashlib.sha256).hexdigest()
    token_str = f"{payload_b64}.{sig}"

    from backend.models import GateAttestation
    att = GateAttestation.__new__(GateAttestation)
    att.token_id = token_id
    att.authorizers = authorizers
    att.revoked = False
    db._attestations[token_id] = att
    return token_str, token_id


def _add_kill_switch(db: FakeDB, active=True, expires_delta=3600):
    from backend.models import KillSwitch
    ks = KillSwitch.__new__(KillSwitch)
    ks.active = active
    ks.expires_at = int(time.time()) + expires_delta
    ks.reason = "test kill switch"
    ks.set_by = "ops-test"
    db._kill_switches.append(ks)
    return ks


def _make_engine(db, env_enabled=True):
    with patch("backend.settlement_policy.settings") as mock_settings:
        mock_settings.attestation_secret_key = SECRET
        mock_settings.live_money_enabled = env_enabled
        mock_settings.stripe_secret_key = ""

        from backend.settlement_policy import SettlementPolicyEngine
        engine = SettlementPolicyEngine(db)
        engine._settings_patch = mock_settings  # keep reference alive
        return engine, mock_settings


# ---------------------------------------------------------------------------
# Fail-closed: missing / invalid token
# ---------------------------------------------------------------------------

class TestFailClosed:
    def test_no_token_denied_g2(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            engine = SettlementPolicyEngine(db)
            decision = engine.evaluate(u.id, "charge", 39900)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2

    def test_malformed_token_denied_g2(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, "bad_token")

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2

    def test_wrong_signature_denied_g2(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        _, token_id = _make_attestation_token(db)

        # Rebuild token with wrong sig
        payload = json.dumps({"jti": token_id, "iat": int(time.time()), "authorizers": ["a", "b"]}).encode()
        b64 = base64.urlsafe_b64encode(payload).rstrip(b"=").decode()
        bad_token = f"{b64}.badbadbadbad"

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, bad_token)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2

    def test_expired_token_denied_g2(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db, expired=True)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2
        assert any("TOKEN_EXPIRED" in rc for rc in decision.reason_codes)


# ---------------------------------------------------------------------------
# G1 gate
# ---------------------------------------------------------------------------

class TestGateG1:
    def test_missing_pdpa_denied_g1(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G1
        assert "PDPA_CONSENT_MISSING" in decision.reason_codes

    def test_inactive_user_denied_g1(self):
        db = FakeDB()
        u = _make_user(pdpa=True, active=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G1

    def test_unknown_user_denied_g1(self):
        db = FakeDB()

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate("nonexistent-uid", "charge", 100)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G1

    def test_g1_checked_before_g2(self):
        """Gate order: G1 must fail first even when G2 would also fail."""
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, None)

        assert decision.status == SettlementStatus.DENIED_G1
        gate_names = [e.gate for e in decision.gate_evaluations]
        assert gate_names == ["G1"], "Only G1 should be evaluated when G1 fails"


# ---------------------------------------------------------------------------
# G2 gate — dual-authorization
# ---------------------------------------------------------------------------

class TestGateG2DualAuth:
    def test_single_authorizer_denied(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db, authorizers=["only-one"])

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2
        assert any("INSUFFICIENT_DUAL" in rc for rc in decision.reason_codes)

    def test_duplicate_authorizer_denied(self):
        """Same signer repeated does not satisfy dual-auth."""
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db, authorizers=["ops-alice", "ops-alice"])

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2

    def test_revoked_token_denied(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, token_id = _make_attestation_token(db)
        db._attestations[token_id].revoked = True

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2

    def test_unregistered_token_denied(self):
        """Token is valid HMAC but not in the DB."""
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u

        # Build a valid-signature token for a jti not in DB
        payload = json.dumps({"jti": "ghost-id", "iat": int(time.time()), "authorizers": ["a", "b"]}).encode()
        b64 = base64.urlsafe_b64encode(payload).rstrip(b"=").decode()
        sig = hmac.new(SECRET.encode(), payload, hashlib.sha256).hexdigest()
        ghost_token = f"{b64}.{sig}"

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, ghost_token)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G2


# ---------------------------------------------------------------------------
# G3 gate — kill-switch & provider reachability
# ---------------------------------------------------------------------------

class TestGateG3:
    def test_kill_switch_blocks(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)
        _add_kill_switch(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_KILLSWITCH

    def test_expired_kill_switch_passes(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)
        _add_kill_switch(db, expires_delta=-1)  # already expired

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert decision.allowed
        assert decision.status == SettlementStatus.ALLOWED

    def test_provider_unreachable_denied_g3(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable",
                   return_value=(False, "PROVIDER_UNREACHABLE: ConnectionError")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G3

    def test_provider_auth_failed_denied_g3(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable",
                   return_value=(False, "PROVIDER_AUTH_FAILED")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_G3


# ---------------------------------------------------------------------------
# Env flag semantics — non-authoritative, evaluated last
# ---------------------------------------------------------------------------

class TestEnvFlag:
    def test_env_disabled_denied_after_all_gates_pass(self):
        """live_money_enabled=False is a mode request, evaluated AFTER G1/G2/G3."""
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = False  # disabled

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert not decision.allowed
        assert decision.status == SettlementStatus.DENIED_ENV
        # All 3 gates should have PASSED before the env check
        gate_results = {e.gate: e.result for e in decision.gate_evaluations}
        from backend.settlement_policy import GateResult
        assert gate_results.get("G1") == GateResult.PASS
        assert gate_results.get("G2") == GateResult.PASS
        assert gate_results.get("G3") == GateResult.PASS

    def test_env_enabled_alone_cannot_unlock(self):
        """live_money_enabled=True without valid gates is still denied."""
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        assert not decision.allowed


# ---------------------------------------------------------------------------
# ALLOWED path — all gates pass
# ---------------------------------------------------------------------------

class TestAllowed:
    def test_all_gates_pass_returns_allowed(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, SettlementStatus, GateResult
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert decision.allowed
        assert decision.status == SettlementStatus.ALLOWED
        for ev in decision.gate_evaluations:
            assert ev.result == GateResult.PASS


# ---------------------------------------------------------------------------
# False-success prevention — SUCCESS/LIVE_PRODUCTION/SETTLED must NEVER appear
# ---------------------------------------------------------------------------

FORBIDDEN_STATES = {"SUCCESS", "LIVE_PRODUCTION", "SETTLED"}


class TestFalseSuccessPrevention:
    """SettlementStatus enum must never contain forbidden strings."""

    def test_forbidden_strings_not_in_status_enum(self):
        from backend.settlement_policy import SettlementStatus
        emitted = {s.value for s in SettlementStatus}
        overlap = emitted & FORBIDDEN_STATES
        assert not overlap, f"Forbidden status strings found in enum: {overlap}"

    def test_allowed_decision_never_returns_forbidden_status(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        assert decision.status not in FORBIDDEN_STATES

    def test_denied_decision_never_returns_forbidden_status(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        assert decision.status not in FORBIDDEN_STATES

    def test_reason_codes_never_contain_forbidden_strings(self):
        """All plausible outcomes checked — reason_codes must not leak forbidden terms."""
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        scenarios = [
            (False, None, 100),   # no token
            (True,  token_str, 100),  # all pass
        ]

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            for pdpa, tok, amount in scenarios:
                target_u = _make_user(pdpa=pdpa)
                db._users[target_u.id] = target_u
                decision = SettlementPolicyEngine(db).evaluate(target_u.id, "charge", amount, tok)
                for rc in decision.reason_codes:
                    assert rc not in FORBIDDEN_STATES, f"Forbidden reason code: {rc}"


# ---------------------------------------------------------------------------
# Truthful audit contract
# ---------------------------------------------------------------------------

class TestAuditContract:
    def test_every_evaluation_writes_audit_log(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            from backend.models import AuditLog
            SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        committed_objs = [obj for batch in db._committed for obj in batch]
        audit_rows = [o for o in committed_objs if isinstance(o, AuditLog)]
        assert len(audit_rows) >= 1, "Must write at least one AuditLog row"

    def test_audit_log_contains_gate_results(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            from backend.models import AuditLog
            SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        committed_objs = [obj for batch in db._committed for obj in batch]
        audit = next((o for o in committed_objs if isinstance(o, AuditLog)), None)
        assert audit is not None
        assert "gate_results" in audit.details

    def test_denied_g1_audit_severity_warning(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            from backend.models import AuditLog
            SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        committed_objs = [obj for batch in db._committed for obj in batch]
        audit = next((o for o in committed_objs if isinstance(o, AuditLog)), None)
        assert audit is not None
        assert audit.severity == "warning"

    def test_env_denied_audit_severity_info(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u
        token_str, _ = _make_attestation_token(db)

        with patch("backend.settlement_policy.settings") as s, \
             patch("backend.settlement_policy.check_provider_reachable", return_value=(True, "OK")):
            s.attestation_secret_key = SECRET
            s.live_money_enabled = False

            from backend.settlement_policy import SettlementPolicyEngine
            from backend.models import AuditLog
            SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, token_str)

        committed_objs = [obj for batch in db._committed for obj in batch]
        audit = next((o for o in committed_objs if isinstance(o, AuditLog)), None)
        assert audit is not None
        assert audit.severity == "info"


# ---------------------------------------------------------------------------
# Gate evaluation order invariants
# ---------------------------------------------------------------------------

class TestGateOrder:
    def test_g2_not_evaluated_when_g1_fails(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        gate_names = [e.gate for e in decision.gate_evaluations]
        assert "G2" not in gate_names
        assert "G3" not in gate_names

    def test_g3_not_evaluated_when_g2_fails(self):
        db = FakeDB()
        u = _make_user()
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100, None)

        gate_names = [e.gate for e in decision.gate_evaluations]
        assert "G3" not in gate_names

    def test_first_failing_gate_helper(self):
        db = FakeDB()
        u = _make_user(pdpa=False)
        db._users[u.id] = u

        with patch("backend.settlement_policy.settings") as s:
            s.attestation_secret_key = SECRET
            s.live_money_enabled = True

            from backend.settlement_policy import SettlementPolicyEngine, GateResult
            decision = SettlementPolicyEngine(db).evaluate(u.id, "charge", 100)

        ffg = decision.first_failing_gate()
        assert ffg is not None
        assert ffg.gate == "G1"
        assert ffg.result == GateResult.FAIL
