from sqlalchemy import (
    Column, String, Integer, BigInteger, Float, Boolean,
    DateTime, Enum, Text, ForeignKey, JSON, Index, BigInteger as SA_BigInt
)
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.sql import func
import uuid, enum as pyenum, time

class Base(DeclarativeBase):
    pass

def gen_uuid():
    return str(uuid.uuid4())

class PlanType(str, pyenum.Enum):
    FREE = "free"
    PRO = "pro"
    BIZ = "biz"

class TaskStatus(str, pyenum.Enum):
    QUEUED = "queued"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"

class TaskType(str, pyenum.Enum):
    CONTENT = "content"
    VOICE = "voice"
    SUMMARY = "summary"
    AGENT = "agent"
    TRANSLATE = "translate"
    IMAGE = "image"

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    plan = Column(Enum(PlanType), default=PlanType.FREE)
    credits = Column(Integer, default=100)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    stripe_customer_id = Column(String(100), unique=True)
    stripe_subscription_id = Column(String(100))
    subscription_expires_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    pdpa_consent_at = Column(DateTime(timezone=True))   # G1 gate requirement

    tasks = relationship("Task", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    credit_logs = relationship("CreditLog", back_populates="user")

class Task(Base):
    __tablename__ = "tasks"
    __table_args__ = (Index("ix_tasks_user_status", "user_id", "status"),)

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    task_type = Column(Enum(TaskType), nullable=False)
    payload = Column(JSON, default={})
    output = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.QUEUED)
    credits_used = Column(Integer, default=0)
    celery_task_id = Column(String(100))
    error_message = Column(Text)
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="tasks")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    stripe_payment_intent_id = Column(String(100), unique=True)
    stripe_invoice_id = Column(String(100))
    amount = Column(Integer, nullable=False)   # satang (THB * 100)
    currency = Column(String(3), default="thb")
    plan = Column(Enum(PlanType))
    credits_added = Column(Integer, default=0)
    status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="payments")

class CreditLog(Base):
    __tablename__ = "credit_logs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    delta = Column(Integer, nullable=False)    # + = add, - = deduct
    balance_after = Column(Integer, nullable=False)
    reason = Column(String(100))
    task_id = Column(String(36))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="credit_logs")

class AutomationSchedule(Base):
    __tablename__ = "automation_schedules"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    task_type = Column(Enum(TaskType), nullable=False)
    payload = Column(JSON, default={})
    cron_expression = Column(String(50))
    is_active = Column(Boolean, default=True)
    last_run_at = Column(DateTime(timezone=True))
    next_run_at = Column(DateTime(timezone=True))
    run_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ── Policy engine models ───────────────────────────────────────────────────

class AuditAction(str, pyenum.Enum):
    SETTLEMENT_POLICY_EVAL = "settlement_policy_eval"
    KILL_SWITCH_SET        = "kill_switch_set"
    ATTESTATION_ISSUED     = "attestation_issued"
    ATTESTATION_REVOKED    = "attestation_revoked"
    BREAK_GLASS_ACTIVATED  = "break_glass_activated"
    PAYMENT_CHARGE         = "payment_charge"
    PAYMENT_REFUND         = "payment_refund"


class AuditLog(Base):
    """
    Immutable audit trail.  Rows are append-only — no update/delete in application code.
    Backed by PostgreSQL; never in-memory or SQLite for live money path.
    """
    __tablename__ = "audit_logs"

    id         = Column(String(36), primary_key=True, default=gen_uuid)
    user_id    = Column(String(36), index=True)
    action     = Column(Enum(AuditAction), nullable=False, index=True)
    details    = Column(JSON, default={})
    severity   = Column(String(10), default="info")   # info | warning | critical
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class GateAttestation(Base):
    """
    Registered G2 attestation tokens with dual-authorization.
    Only ops / authorized signers may insert rows.
    """
    __tablename__ = "gate_attestations"

    id          = Column(String(36), primary_key=True, default=gen_uuid)
    token_id    = Column(String(100), unique=True, nullable=False, index=True)
    authorizers = Column(JSON, default=[])    # list of authorizer IDs
    issued_at   = Column(SA_BigInt, nullable=False)
    expires_at  = Column(SA_BigInt, nullable=False)
    revoked     = Column(Boolean, default=False)
    revoked_by  = Column(String(100))
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class KillSwitch(Base):
    """
    Ops-controlled live-settlement kill switch.
    Separate from env vars — must be set by ops via a separate authenticated channel.
    """
    __tablename__ = "kill_switches"

    id          = Column(String(36), primary_key=True, default=gen_uuid)
    active      = Column(Boolean, default=True)
    reason      = Column(Text)
    set_by      = Column(String(100), nullable=False)
    expires_at  = Column(SA_BigInt, nullable=False)   # unix timestamp
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class BreakGlass(Base):
    """
    Break-glass emergency access records.
    Multi-party approval required; each activation is signed and has expiry.
    """
    __tablename__ = "break_glass_records"

    id           = Column(String(36), primary_key=True, default=gen_uuid)
    requested_by = Column(String(100), nullable=False)
    approvers    = Column(JSON, default=[])     # min 2 distinct approvers
    scope        = Column(String(255))
    signature    = Column(Text)
    expires_at   = Column(SA_BigInt, nullable=False)
    active       = Column(Boolean, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())


# ── AI Staff models ────────────────────────────────────────────────────────

class DepartmentType(str, pyenum.Enum):
    MARKETING        = "marketing"
    SALES            = "sales"
    CUSTOMER_SERVICE = "customer_service"
    PRODUCT          = "product"
    FINANCE          = "finance"
    HR               = "hr"
    OPERATIONS       = "operations"


class AIStaffStatus(str, pyenum.Enum):
    ACTIVE   = "active"
    ON_TASK  = "on_task"
    INACTIVE = "inactive"


class AIStaff(Base):
    """
    One AI staff member per department.  Rows are seeded at startup — not created by users.
    """
    __tablename__ = "ai_staff"

    id           = Column(String(36), primary_key=True, default=gen_uuid)
    department   = Column(Enum(DepartmentType), unique=True, nullable=False, index=True)
    name_th      = Column(String(100), nullable=False)   # Thai display name
    name_en      = Column(String(100), nullable=False)
    role_th      = Column(String(100), nullable=False)
    capabilities = Column(JSON, default=[])              # list of task_type strings it handles
    status       = Column(Enum(AIStaffStatus), default=AIStaffStatus.ACTIVE)
    tasks_done   = Column(Integer, default=0)
    last_active  = Column(DateTime(timezone=True))
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    logs = relationship("AIStaffLog", back_populates="staff", cascade="all, delete-orphan")


class AIStaffLog(Base):
    """
    Activity log for each AI staff member — one row per assigned task.
    """
    __tablename__ = "ai_staff_logs"

    id           = Column(String(36), primary_key=True, default=gen_uuid)
    staff_id     = Column(String(36), ForeignKey("ai_staff.id"), nullable=False, index=True)
    assigned_by  = Column(String(36), index=True)        # user_id who triggered this
    task_type    = Column(String(50), nullable=False)
    input_summary= Column(Text)
    output       = Column(Text)
    status       = Column(String(20), default="queued")  # queued | running | done | failed
    celery_task_id = Column(String(100))
    error_message= Column(Text)
    started_at   = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    staff = relationship("AIStaff", back_populates="logs")
