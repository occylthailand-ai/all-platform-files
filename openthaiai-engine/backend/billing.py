"""
Stripe billing: subscriptions, credit top-ups, webhooks.

Every money action calls SettlementPolicyEngine.evaluate() first.
No code path may bypass the policy engine.
"""
import logging
import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from .database import get_db
from .auth import get_current_user
from .models import User, Payment, CreditLog, PlanType, GateAttestation
from .config import get_settings
from .settlement_policy import SettlementPolicyEngine, SettlementStatus

logger = logging.getLogger(__name__)

settings = get_settings()
stripe.api_key = settings.stripe_secret_key

router = APIRouter(prefix="/billing", tags=["billing"])

PLAN_CONFIG = {
    "pro": {
        "price_id": settings.stripe_price_pro_monthly,
        "credits": settings.pro_credits,
        "amount_thb": 399,
    },
    "biz": {
        "price_id": settings.stripe_price_biz_monthly,
        "credits": settings.biz_credits,
        "amount_thb": 1999,
    },
}

CREDIT_PACKS = {
    "pack_500":  {"credits": 500,  "amount_thb": 99},
    "pack_2000": {"credits": 2000, "amount_thb": 349},
    "pack_5000": {"credits": 5000, "amount_thb": 799},
}


class SubscribeRequest(BaseModel):
    plan: str                            # "pro" | "biz"
    g2_attestation_token: Optional[str] = None


class CreditPackRequest(BaseModel):
    pack_id: str
    g2_attestation_token: Optional[str] = None


def _get_ops_attestation_token(db: Session) -> Optional[str]:
    """
    Return the most-recent non-revoked attestation token from the DB.
    Ops must register a valid token before live settlement is possible.
    """
    att = (
        db.query(GateAttestation)
        .filter(GateAttestation.revoked == False)  # noqa: E712
        .order_by(GateAttestation.created_at.desc())
        .first()
    )
    return att.token_id if att else None


def _policy_check(
    db: Session,
    user_id: str,
    action: str,
    amount_satang: int,
    g2_token: Optional[str] = None,
) -> None:
    """
    Run full G1→G2→G3→env policy evaluation.
    Raises HTTPException(402) on any denial.
    Never raises on ALLOWED.
    """
    engine = SettlementPolicyEngine(db)
    decision = engine.evaluate(
        user_id=user_id,
        action=action,
        amount_satang=amount_satang,
        g2_attestation_token=g2_token,
    )
    if not decision.allowed:
        logger.warning(
            "settlement_denied user=%s action=%s status=%s reasons=%s",
            user_id, action, decision.status, decision.reason_codes,
        )
        raise HTTPException(
            status_code=402,
            detail={
                "settlement_status": decision.status,
                "reason_codes": decision.reason_codes,
            },
        )


@router.post("/subscribe")
def create_subscription(
    req: SubscribeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    config = PLAN_CONFIG.get(req.plan)
    if not config:
        raise HTTPException(400, "Invalid plan")

    token = req.g2_attestation_token or _get_ops_attestation_token(db)
    _policy_check(
        db=db,
        user_id=current_user.id,
        action="subscribe",
        amount_satang=config["amount_thb"] * 100,
        g2_token=token,
    )

    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(email=current_user.email)
        current_user.stripe_customer_id = customer.id
        db.commit()

    session = stripe.checkout.Session.create(
        customer=current_user.stripe_customer_id,
        mode="subscription",
        line_items=[{"price": config["price_id"], "quantity": 1}],
        success_url=f"{settings.frontend_url}/dashboard?subscribed=1",
        cancel_url=f"{settings.frontend_url}/pricing",
        metadata={"user_id": current_user.id, "plan": req.plan},
    )
    return {"checkout_url": session.url}


@router.post("/buy-credits")
def buy_credits(
    req: CreditPackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    pack = CREDIT_PACKS.get(req.pack_id)
    if not pack:
        raise HTTPException(400, "Invalid pack")

    token = req.g2_attestation_token or _get_ops_attestation_token(db)
    _policy_check(
        db=db,
        user_id=current_user.id,
        action="buy_credits",
        amount_satang=pack["amount_thb"] * 100,
        g2_token=token,
    )

    if not current_user.stripe_customer_id:
        customer = stripe.Customer.create(email=current_user.email)
        current_user.stripe_customer_id = customer.id
        db.commit()

    session = stripe.checkout.Session.create(
        customer=current_user.stripe_customer_id,
        mode="payment",
        line_items=[{
            "price_data": {
                "currency": "thb",
                "product_data": {"name": f"OpenThaiAI Credits {pack['credits']}"},
                "unit_amount": pack["amount_thb"] * 100,
            },
            "quantity": 1,
        }],
        success_url=f"{settings.frontend_url}/dashboard?credits_added=1",
        cancel_url=f"{settings.frontend_url}/pricing",
        metadata={"user_id": current_user.id, "credits": pack["credits"], "pack_id": req.pack_id},
    )
    return {"checkout_url": session.url}


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    stripe_signature: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    payload = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, settings.stripe_webhook_secret
        )
    except Exception as e:
        raise HTTPException(400, str(e))

    if event["type"] == "checkout.session.completed":
        _handle_checkout(event["data"]["object"], db)
    elif event["type"] == "customer.subscription.deleted":
        _handle_subscription_deleted(event["data"]["object"], db)
    return {"received": True}


def _handle_checkout(session: dict, db: Session):
    user_id = session["metadata"].get("user_id")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return

    mode = session.get("mode")
    amount_satang = session.get("amount_total", 0)

    # Policy must pass before any settlement — full G1/G2/G3 + env evaluation
    token = _get_ops_attestation_token(db)
    engine = SettlementPolicyEngine(db)
    decision = engine.evaluate(
        user_id=user_id,
        action=f"webhook_checkout_{mode}",
        amount_satang=amount_satang,
        g2_attestation_token=token,
    )
    if not decision.allowed:
        logger.error(
            "settlement_denied_in_webhook user=%s amount=%d status=%s reasons=%s — "
            "credits NOT applied; payment recorded as policy_denied",
            user_id, amount_satang, decision.status, decision.reason_codes,
        )
        # Record the failed settlement attempt but do NOT apply credits
        payment = Payment(
            user_id=user.id,
            stripe_payment_intent_id=session.get("payment_intent"),
            amount=amount_satang,
            currency=session.get("currency", "thb"),
            status=f"policy_denied:{decision.status}",
        )
        db.add(payment)
        db.commit()
        return

    if mode == "subscription":
        plan = session["metadata"]["plan"]
        config = PLAN_CONFIG[plan]
        credits = config["credits"]
        user.plan = PlanType(plan)
        user.credits += credits
        user.stripe_subscription_id = session.get("subscription")
    elif mode == "payment":
        credits = int(session["metadata"].get("credits", 0))
        user.credits += credits
    else:
        credits = 0

    _log_credit(db, user, credits)

    payment = Payment(
        user_id=user.id,
        stripe_payment_intent_id=session.get("payment_intent"),
        amount=amount_satang,
        currency=session.get("currency", "thb"),
        plan=PlanType(session["metadata"]["plan"]) if mode == "subscription" else None,
        credits_added=credits,
        status="paid",
    )
    db.add(payment)
    db.commit()


def _handle_subscription_deleted(subscription: dict, db: Session):
    user = db.query(User).filter(
        User.stripe_subscription_id == subscription["id"]
    ).first()
    if user:
        user.plan = PlanType.FREE
        user.credits = settings.free_credits
        db.commit()


def _log_credit(db: Session, user: User, delta: int, reason: str = "payment"):
    log = CreditLog(user_id=user.id, delta=delta, balance_after=user.credits, reason=reason)
    db.add(log)
