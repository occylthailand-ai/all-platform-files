from celery import Celery
from celery.schedules import crontab
from datetime import datetime, timezone
import time
import logging

from .config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

celery_app = Celery(
    "openthaiai_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["backend.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Bangkok",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    result_expires=3600,
    beat_schedule={
        "daily-content-generation": {
            "task": "backend.tasks.run_daily_content",
            "schedule": crontab(hour=9, minute=0),
        },
        "weekly-growth-report": {
            "task": "backend.tasks.send_growth_report",
            "schedule": crontab(day_of_week="monday", hour=8, minute=0),
        },
        "hourly-credit-reset-check": {
            "task": "backend.tasks.check_subscription_renewals",
            "schedule": crontab(minute=0),
        },
    },
)
