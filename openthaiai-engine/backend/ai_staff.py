"""
OpenThaiAI — AI Staff per Department.

One AI staff member is seeded per department at startup.
Each staff member has a defined role, Thai/English name, and a set of
task_types they handle.  Tasks are dispatched via Celery.
"""
from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List

import anthropic

from .config import get_settings
from .models import (
    AIStaff, AIStaffLog, AIStaffStatus,
    DepartmentType,
)

logger = logging.getLogger(__name__)
settings = get_settings()


# ── Department seed data ──────────────────────────────────────────────────────

@dataclass
class _DeptSeed:
    department: DepartmentType
    name_th: str
    name_en: str
    role_th: str
    capabilities: List[str]   # task_types this agent handles
    system_prompt: str


DEPARTMENT_SEEDS: List[_DeptSeed] = [
    _DeptSeed(
        department=DepartmentType.MARKETING,
        name_th="น้องมาร์ค",
        name_en="Mark",
        role_th="ผู้เชี่ยวชาญการตลาดดิจิทัล",
        capabilities=["content", "image", "translate"],
        system_prompt=(
            "คุณคือ น้องมาร์ค ผู้เชี่ยวชาญการตลาดดิจิทัลของ OpenThaiAI "
            "ความเชี่ยวชาญ: คอนเทนต์โซเชียลมีเดีย แคมเปญโฆษณา SEO และ copywriting ภาษาไทย "
            "ตอบกลับเป็นภาษาไทยเสมอ เขียนชัดเจน กระชับ และเหมาะกับแบรนด์ไทย"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.SALES,
        name_th="น้องเซลล์",
        name_en="Sail",
        role_th="ผู้เชี่ยวชาญการขายและ CRM",
        capabilities=["agent", "content"],
        system_prompt=(
            "คุณคือ น้องเซลล์ ผู้เชี่ยวชาญด้านการขายของ OpenThaiAI "
            "ความเชี่ยวชาญ: lead nurturing, proposal writing, pipeline analysis, "
            "upsell/cross-sell strategy และการปิดการขายภาษาไทย "
            "ตอบเป็นภาษาไทย มีความเป็นมืออาชีพ และมุ่งเน้นผลลัพธ์"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.CUSTOMER_SERVICE,
        name_th="น้องแคร์",
        name_en="Care",
        role_th="ผู้เชี่ยวชาญบริการลูกค้า",
        capabilities=["agent", "summary", "translate"],
        system_prompt=(
            "คุณคือ น้องแคร์ ผู้ดูแลลูกค้าของ OpenThaiAI "
            "ความเชี่ยวชาญ: ตอบคำถาม แก้ปัญหา จัดการ ticket และสรุปความต้องการลูกค้า "
            "ตอบด้วยความอบอุ่น เข้าใจง่าย และแก้ปัญหาได้จริง ใช้ภาษาไทยสุภาพ"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.PRODUCT,
        name_th="น้องโปร",
        name_en="Pro",
        role_th="ผู้เชี่ยวชาญพัฒนาผลิตภัณฑ์",
        capabilities=["agent", "summary", "content"],
        system_prompt=(
            "คุณคือ น้องโปร Product Specialist ของ OpenThaiAI "
            "ความเชี่ยวชาญ: user story, PRD, competitive analysis, feature roadmap "
            "และ user research synthesis "
            "ตอบด้วยความละเอียด มีโครงสร้าง และใช้ภาษาไทยที่เข้าใจง่าย"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.FINANCE,
        name_th="น้องฟิน",
        name_en="Fin",
        role_th="ผู้เชี่ยวชาญการเงินและบัญชี",
        capabilities=["summary", "agent"],
        system_prompt=(
            "คุณคือ น้องฟิน Financial Analyst ของ OpenThaiAI "
            "ความเชี่ยวชาญ: financial reporting, cash flow analysis, budget planning, "
            "P&L summary และ tax summary ภาษาไทย "
            "ตอบด้วยความแม่นยำ มีตัวเลขชัดเจน และอ้างอิงข้อมูลได้"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.HR,
        name_th="น้องฮาย",
        name_en="Hai",
        role_th="ผู้เชี่ยวชาญทรัพยากรบุคคล",
        capabilities=["content", "agent", "summary"],
        system_prompt=(
            "คุณคือ น้องฮาย HR Specialist ของ OpenThaiAI "
            "ความเชี่ยวชาญ: job description, candidate screening, onboarding checklist, "
            "KPI framework และ HR policy ภาษาไทย "
            "ตอบด้วยความเป็นธรรม โปร่งใส และให้ความสำคัญกับคุณค่าของบุคลากร"
        ),
    ),
    _DeptSeed(
        department=DepartmentType.OPERATIONS,
        name_th="น้องออปส์",
        name_en="Ops",
        role_th="ผู้เชี่ยวชาญปฏิบัติการและระบบ",
        capabilities=["agent", "summary", "content"],
        system_prompt=(
            "คุณคือ น้องออปส์ Operations Specialist ของ OpenThaiAI "
            "ความเชี่ยวชาญ: process automation, SOP writing, incident report, "
            "workflow optimization และ KPI dashboard ภาษาไทย "
            "ตอบด้วยความเป็นระบบ มีขั้นตอนชัดเจน และพุ่งเป้าที่ประสิทธิภาพ"
        ),
    ),
]


# ── Seeder ────────────────────────────────────────────────────────────────────

def seed_ai_staff(db) -> int:
    """Insert missing AI staff rows at application startup. Returns count created."""
    created = 0
    for seed in DEPARTMENT_SEEDS:
        exists = db.query(AIStaff).filter(
            AIStaff.department == seed.department
        ).first()
        if not exists:
            staff = AIStaff(
                department=seed.department,
                name_th=seed.name_th,
                name_en=seed.name_en,
                role_th=seed.role_th,
                capabilities=seed.capabilities,
                status=AIStaffStatus.ACTIVE,
            )
            db.add(staff)
            created += 1
    if created:
        db.commit()
    return created


def get_system_prompt(department: DepartmentType) -> str:
    for seed in DEPARTMENT_SEEDS:
        if seed.department == department:
            return seed.system_prompt
    return "คุณคือผู้ช่วย AI ของ OpenThaiAI ตอบเป็นภาษาไทย"


# ── Celery task dispatcher ────────────────────────────────────────────────────

def dispatch_staff_task(log_id: str) -> None:
    """
    Called by the Celery task `run_ai_staff_task`.
    Runs the AI staff agent for the given AIStaffLog row and updates its status.
    """
    from .database import SessionLocal

    db = SessionLocal()
    try:
        log = db.query(AIStaffLog).filter(AIStaffLog.id == log_id).first()
        if not log:
            logger.error("AIStaffLog %s not found", log_id)
            return

        staff = db.query(AIStaff).filter(AIStaff.id == log.staff_id).first()
        if not staff:
            log.status = "failed"
            log.error_message = "AI staff record missing"
            db.commit()
            return

        log.status = "running"
        log.started_at = datetime.now(timezone.utc)
        staff.status = AIStaffStatus.ON_TASK
        db.commit()

        system_prompt = get_system_prompt(staff.department)
        output = _call_claude(system_prompt, log.input_summary or "")

        log.status = "done"
        log.output = output
        log.completed_at = datetime.now(timezone.utc)
        staff.status = AIStaffStatus.ACTIVE
        staff.tasks_done = (staff.tasks_done or 0) + 1
        staff.last_active = datetime.now(timezone.utc)
        db.commit()

    except Exception as exc:
        db.rollback()
        try:
            log = db.query(AIStaffLog).filter(AIStaffLog.id == log_id).first()
            if log:
                log.status = "failed"
                log.error_message = str(exc)
                log.completed_at = datetime.now(timezone.utc)
                staff = db.query(AIStaff).filter(AIStaff.id == log.staff_id).first()
                if staff:
                    staff.status = AIStaffStatus.ACTIVE
                db.commit()
        except Exception:
            pass
        raise
    finally:
        db.close()


def _call_claude(system_prompt: str, user_message: str) -> str:
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text
