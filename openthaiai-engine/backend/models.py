from sqlalchemy import (
    Column, String, Integer, BigInteger, Float, Boolean,
    DateTime, Enum, Text, ForeignKey, JSON, Index
)
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.sql import func
import uuid, enum as pyenum

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
    cron_expression = Column(String(50))   # e.g. "0 9 * * *"
    is_active = Column(Boolean, default=True)
    last_run_at = Column(DateTime(timezone=True))
    next_run_at = Column(DateTime(timezone=True))
    run_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
