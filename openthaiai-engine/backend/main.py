"""
OpenThaiAI Growth Engine — Production FastAPI backend.
"""
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import datetime
import sentry_sdk
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from loguru import logger

from .config import get_settings
from .database import get_db, create_tables
from .models import User, Task, TaskStatus, TaskType, PlanType, CreditLog, AutomationSchedule
from .auth import (
    hash_password, verify_password, create_access_token, get_current_user, require_admin
)
from .billing import router as billing_router
from .tasks import process_ai_task

settings = get_settings()

if settings.sentry_dsn:
    sentry_sdk.init(dsn=settings.sentry_dsn, traces_sample_rate=0.2)

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="OpenThaiAI Growth Engine",
    version=settings.version,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(billing_router)

Instrumentator().instrument(app).expose(app, endpoint="/metrics")

CREDIT_COST = {
    TaskType.CONTENT:   settings.credit_cost_content,
    TaskType.VOICE:     settings.credit_cost_voice,
    TaskType.SUMMARY:   settings.credit_cost_summary,
    TaskType.AGENT:     settings.credit_cost_agent,
    TaskType.TRANSLATE: settings.credit_cost_summary,
    TaskType.IMAGE:     settings.credit_cost_content,
}


@app.on_event("startup")
def startup():
    create_tables()
    logger.info("OpenThaiAI Growth Engine started")


@app.get("/")
def health():
    return {"status": "ok", "version": settings.version, "service": "OpenThaiAI Growth Engine"}


# ── Auth ────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    plan: str = "free"


@app.post("/auth/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already registered")
    credits = settings.free_credits
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        plan=PlanType.FREE,
        credits=credits,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": _user_schema(user)}


@app.post("/auth/login")
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = create_access_token({"sub": user.id})
    return {"access_token": token, "token_type": "bearer", "user": _user_schema(user)}


@app.get("/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return _user_schema(current_user)


# ── Tasks ───────────────────────────────────────────────────────────────────

class CreateTaskRequest(BaseModel):
    task_type: str
    payload: dict = {}


@app.post("/tasks", status_code=201)
def create_task(
    data: CreateTaskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        task_type = TaskType(data.task_type)
    except ValueError:
        raise HTTPException(400, f"Invalid task_type. Valid: {[t.value for t in TaskType]}")

    cost = CREDIT_COST.get(task_type, 10)
    if current_user.credits < cost:
        raise HTTPException(402, f"Insufficient credits (need {cost}, have {current_user.credits})")

    current_user.credits -= cost
    task = Task(user_id=current_user.id, task_type=task_type, payload=data.payload, credits_used=cost)
    db.add(task)
    log = CreditLog(user_id=current_user.id, delta=-cost, balance_after=current_user.credits, reason=task_type)
    db.add(log)
    db.commit()
    db.refresh(task)

    process_ai_task.delay(task.id)
    return _task_schema(task)


@app.get("/tasks")
def list_tasks(
    status: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    q = db.query(Task).filter(Task.user_id == current_user.id)
    if status:
        q = q.filter(Task.status == status)
    tasks = q.order_by(Task.created_at.desc()).offset(offset).limit(limit).all()
    return [_task_schema(t) for t in tasks]


@app.get("/tasks/{task_id}")
def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(404, "Task not found")
    return _task_schema(task)


# ── Automation Schedules ────────────────────────────────────────────────────

class ScheduleRequest(BaseModel):
    name: str
    task_type: str
    payload: dict = {}
    cron_expression: str  # "0 9 * * *"


@app.post("/schedules", status_code=201)
def create_schedule(
    data: ScheduleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.plan == PlanType.FREE:
        raise HTTPException(403, "Upgrade to Pro to use automation schedules")
    schedule = AutomationSchedule(
        user_id=current_user.id,
        name=data.name,
        task_type=TaskType(data.task_type),
        payload=data.payload,
        cron_expression=data.cron_expression,
    )
    db.add(schedule)
    db.commit()
    db.refresh(schedule)
    return {"id": schedule.id, "name": schedule.name, "cron": schedule.cron_expression}


@app.get("/schedules")
def list_schedules(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = db.query(AutomationSchedule).filter(
        AutomationSchedule.user_id == current_user.id
    ).all()
    return [{"id": r.id, "name": r.name, "task_type": r.task_type, "cron": r.cron_expression,
             "is_active": r.is_active, "run_count": r.run_count} for r in rows]


# ── Credit Log ──────────────────────────────────────────────────────────────

@app.get("/credits/log")
def credit_log(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    logs = db.query(CreditLog).filter(CreditLog.user_id == current_user.id)\
             .order_by(CreditLog.created_at.desc()).limit(limit).all()
    return [{"delta": l.delta, "balance": l.balance_after, "reason": l.reason,
             "created_at": l.created_at} for l in logs]


# ── Admin ───────────────────────────────────────────────────────────────────

@app.get("/admin/stats")
def admin_stats(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    total_users = db.query(func.count(User.id)).scalar()
    pro_users = db.query(func.count(User.id)).filter(User.plan == PlanType.PRO).scalar()
    biz_users = db.query(func.count(User.id)).filter(User.plan == PlanType.BIZ).scalar()
    total_tasks = db.query(func.count(Task.id)).scalar()
    done_tasks = db.query(func.count(Task.id)).filter(Task.status == TaskStatus.DONE).scalar()
    return {
        "users": {"total": total_users, "pro": pro_users, "biz": biz_users},
        "tasks": {"total": total_tasks, "done": done_tasks},
    }


@app.get("/admin/users")
def admin_users(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    users = db.query(User).order_by(User.created_at.desc()).offset(offset).limit(limit).all()
    return [_user_schema(u) for u in users]


# ── Helpers ─────────────────────────────────────────────────────────────────

def _user_schema(u: User) -> dict:
    return {
        "id": u.id, "email": u.email, "full_name": u.full_name,
        "plan": u.plan, "credits": u.credits, "is_admin": u.is_admin,
        "created_at": u.created_at,
    }

def _task_schema(t: Task) -> dict:
    return {
        "id": t.id, "task_type": t.task_type, "status": t.status,
        "payload": t.payload, "output": t.output, "credits_used": t.credits_used,
        "created_at": t.created_at, "completed_at": t.completed_at,
    }
