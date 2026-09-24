"""
Celery tasks: AI automation, content, notifications, billing renewals.
"""
from datetime import datetime, timezone
from .worker import celery_app
from .database import SessionLocal
from .models import Task, TaskStatus, User, CreditLog
from .config import get_settings
import anthropic
import logging

settings = get_settings()
logger = logging.getLogger(__name__)


def _get_ai_client():
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def process_ai_task(self, task_id: str):
    db = SessionLocal()
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return {"error": "task not found"}

        task.status = TaskStatus.RUNNING
        task.started_at = datetime.now(timezone.utc)
        task.celery_task_id = self.request.id
        db.commit()

        output = _run_task(task.task_type, task.payload)

        task.status = TaskStatus.DONE
        task.output = output
        task.completed_at = datetime.now(timezone.utc)
        db.commit()
        return {"task_id": task_id, "status": "done"}

    except Exception as exc:
        db.rollback()
        task = db.query(Task).filter(Task.id == task_id).first()
        if task:
            task.status = TaskStatus.FAILED
            task.error_message = str(exc)
            db.commit()
        raise self.retry(exc=exc)
    finally:
        db.close()


def _run_task(task_type: str, payload: dict) -> str:
    client = _get_ai_client()

    prompts = {
        "content": f"เขียนคอนเทนต์การตลาดภาษาไทย เรื่อง: {payload.get('topic', 'ธุรกิจออนไลน์')} ความยาว {payload.get('length', 300)} คำ สำหรับ {payload.get('platform', 'Facebook')}",
        "summary": f"สรุปข้อความต่อไปนี้เป็นภาษาไทยแบบกระชับ:\n\n{payload.get('text', '')}",
        "translate": f"แปลข้อความต่อไปนี้เป็น{payload.get('target_lang', 'ภาษาอังกฤษ')}:\n\n{payload.get('text', '')}",
        "agent": f"ทำงานอัตโนมัติ: {payload.get('instruction', 'วิเคราะห์ตลาดและให้คำแนะนำ')}",
        "voice": f"เตรียม script สำหรับเสียงพูด เรื่อง: {payload.get('topic', 'แนะนำบริษัท')} ความยาว {payload.get('duration_sec', 60)} วินาที",
        "image": f"เขียน prompt สำหรับ AI image generation ภาษาอังกฤษ สำหรับ: {payload.get('description', 'โลโก้บริษัท')}",
    }
    prompt = prompts.get(task_type, f"ช่วยทำงาน: {payload}")

    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


@celery_app.task
def run_daily_content():
    """Auto-generate content for Pro/Biz users every morning."""
    db = SessionLocal()
    try:
        from .models import PlanType, TaskType
        users = db.query(User).filter(
            User.plan.in_([PlanType.PRO, PlanType.BIZ]),
            User.is_active == True,
            User.credits > 10,
        ).all()
        count = 0
        for user in users:
            task = Task(
                user_id=user.id,
                task_type=TaskType.CONTENT,
                payload={"topic": "เทรนด์ธุรกิจวันนี้", "platform": "Facebook", "length": 200},
                status="queued",
            )
            db.add(task)
            user.credits -= 10
            db.flush()
            process_ai_task.delay(task.id)
            count += 1
        db.commit()
        return {"generated": count}
    finally:
        db.close()


@celery_app.task
def send_growth_report():
    """Weekly growth report — placeholder for email integration."""
    db = SessionLocal()
    try:
        from sqlalchemy import func
        total_users = db.query(func.count(User.id)).scalar()
        total_tasks = db.query(func.count(Task.id)).filter(Task.status == TaskStatus.DONE).scalar()
        return {"total_users": total_users, "completed_tasks": total_tasks}
    finally:
        db.close()


@celery_app.task(bind=True, max_retries=3, default_retry_delay=30)
def run_ai_staff_task(self, log_id: str):
    """Execute an AI staff assignment (one AIStaffLog row)."""
    from .ai_staff import dispatch_staff_task
    try:
        dispatch_staff_task(log_id)
        return {"log_id": log_id, "status": "done"}
    except Exception as exc:
        raise self.retry(exc=exc)


@celery_app.task
def check_subscription_renewals():
    """Expire subscriptions and reset free credits monthly."""
    db = SessionLocal()
    try:
        from .models import PlanType
        now = datetime.now(timezone.utc)
        expired = db.query(User).filter(
            User.subscription_expires_at < now,
            User.plan != PlanType.FREE,
        ).all()
        for user in expired:
            user.plan = PlanType.FREE
            user.credits = settings.free_credits
            user.stripe_subscription_id = None
        db.commit()
        return {"expired_count": len(expired)}
    finally:
        db.close()
