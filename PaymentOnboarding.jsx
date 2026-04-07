/**
 * PaymentOnboarding.jsx
 * Onboarding flow — พาลูกค้าใหม่ตั้งค่า PromptPay ก่อนใช้งาน
 *
 * วิธีใช้:
 *   import PaymentOnboarding from './PaymentOnboarding'
 *   <PaymentOnboarding onComplete={() => navigate('/dashboard')} />
 */

import { useState } from "react";

const STEPS = [
  {
    id: 1,
    emoji: "📋",
    title: "เตรียมเอกสาร",
    short: "เอกสาร",
    desc: "เตรียมให้พร้อมก่อนไปธนาคาร",
    items: [
      { icon: "🪪", text: "บัตรประชาชนตัวจริง (หมดอายุไม่ได้)" },
      { icon: "💵", text: "เงินสด 500–1,000 บาท สำหรับเปิดบัญชี" },
      { icon: "📱", text: "มือถือที่ใช้เบอร์ของตัวเอง (สำหรับ OTP)" },
    ],
    tip: "ธนาคารบางแห่งเปิดบัญชีออนไลน์ได้เลย เช่น KBank, SCB, TTB",
  },
  {
    id: 2,
    emoji: "🏦",
    title: "เลือกธนาคาร",
    short: "ธนาคาร",
    desc: "เลือกตามความสะดวก",
    items: [
      { icon: "🟢", text: "KBank — เปิดออนไลน์ผ่านแอป K PLUS ได้เลย" },
      { icon: "🟣", text: "SCB — เปิดออนไลน์ผ่าน SCB Easy" },
      { icon: "🔵", text: "กรุงเทพ / ไทยพาณิชย์ — ไปสาขาใกล้บ้าน" },
    ],
    tip: "Bangkok Bank (ที่คุณใช้อยู่) รองรับ PromptPay 097-xxx-0801 แล้ว",
  },
  {
    id: 3,
    emoji: "✍️",
    title: "กรอกใบสมัคร",
    short: "สมัคร",
    desc: "ที่สาขาหรือในแอป",
    items: [
      { icon: "📝", text: "กรอกชื่อ-นามสกุล ที่อยู่ อาชีพ" },
      { icon: "📸", text: "สแกนบัตรประชาชน + ถ่ายรูปหน้า" },
      { icon: "✅", text: "ยืนยันตัวตนด้วย OTP บนมือถือ" },
    ],
    tip: "ใช้เวลาประมาณ 10–15 นาที ถ้าเปิดออนไลน์ยิ่งเร็วกว่านี้",
  },
  {
    id: 4,
    emoji: "💳",
    title: "รับบัญชี + ATM",
    short: "บัญชี",
    desc: "เสร็จแล้วได้ทันที",
    items: [
      { icon: "🔢", text: "ได้เลขบัญชี 10–12 หลักทันที" },
      { icon: "💳", text: "การ์ด ATM ได้รับภายใน 5–7 วัน (บางสาขารับได้เลย)" },
      { icon: "📖", text: "สมุดบัญชีออมทรัพย์ (ถ้าขอ)" },
    ],
    tip: "ถ้ารีบใช้ ขอให้ธนาคาร activate บัญชีให้โอนออนไลน์ได้ทันที",
  },
  {
    id: 5,
    emoji: "📲",
    title: "ลง Mobile Banking",
    short: "แอปธนาคาร",
    desc: "ควบคุมเงินบนมือถือ",
    items: [
      { icon: "⬇️", text: "โหลดแอปธนาคารของคุณจาก Play Store / App Store" },
      { icon: "🔑", text: "สมัครด้วยเลขบัญชี + รหัส OTP" },
      { icon: "🔐", text: "ตั้ง PIN 6 หลักสำหรับเข้าแอป" },
    ],
    tip: "เปิด notification แอปธนาคารไว้ จะได้รับแจ้งทุกครั้งที่มีเงินเข้า",
  },
  {
    id: 6,
    emoji: "⚡",
    title: "ผูก PromptPay",
    short: "PromptPay",
    desc: "รับเงินผ่านเบอร์มือถือได้เลย",
    items: [
      { icon: "🏠", text: "เปิดแอปธนาคาร → เมนู PromptPay" },
      { icon: "📱", text: "เลือก 'ผูกด้วยเบอร์มือถือ' หรือ 'เลขบัตรปชช.'" },
      { icon: "✅", text: "ยืนยัน OTP — เสร็จสิ้นใน 1 นาที" },
    ],
    tip: "PromptPay รองรับทุกธนาคารในไทย โอนหากันฟรีไม่มีค่าธรรมเนียม",
  },
  {
    id: 7,
    emoji: "💸",
    title: "โอน / รับโอน",
    short: "โอนเงิน",
    desc: "พร้อมใช้งานแล้ว",
    items: [
      { icon: "📤", text: "รับ: แชร์ QR Code หรือเบอร์ PromptPay ให้คนโอนมา" },
      { icon: "📥", text: "โอน: พิมพ์เบอร์ / เลขบัญชีปลายทาง → ยืนยัน OTP" },
      { icon: "💰", text: "โอนสูงสุด 500,000 บาท/วัน (Mobile Banking ทั่วไป)" },
    ],
    tip: "PromptPay โอนฟรีทุกธนาคาร ทุกวันตลอด 24 ชั่วโมง",
  },
  {
    id: 8,
    emoji: "🎉",
    title: "ชำระค่า OpenThai AI",
    short: "ชำระเงิน",
    desc: "ขั้นตอนสุดท้าย!",
    items: [
      { icon: "📷", text: "สแกน QR PromptPay ที่เราส่งให้ทาง LINE" },
      { icon: "💬", text: "แจ้งสลิปการโอนกลับมาใน LINE" },
      { icon: "🚀", text: "ทีมงานเปิด access ให้ภายใน 5 นาที" },
    ],
    tip: "ไม่ต้องมีบัตรเครดิต PromptPay ก็ใช้งานได้ทันที!",
  },
];

const COLORS = {
  bg: "#0a0a0f",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  green: "#1D9E75",
  greenLight: "rgba(29,158,117,0.15)",
  greenBorder: "rgba(29,158,117,0.3)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.5)",
};

export default function PaymentOnboarding({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(new Set());

  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const progress = Math.round(((current + 1) / STEPS.length) * 100);

  function handleNext() {
    setDone((d) => new Set([...d, current]));
    if (isLast) {
      onComplete?.();
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function handleBack() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "'Sarabun', sans-serif",
    }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: 520, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: "'Kanit', sans-serif" }}>
            OpenThai AI
          </span>
          <span style={{ fontSize: 13, color: COLORS.muted }}>— ตั้งค่าการชำระเงิน</span>
        </div>

        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 999, height: 4, marginBottom: 6 }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: COLORS.green,
            borderRadius: 999,
            transition: "width 0.4s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: COLORS.muted }}>
          <span>ขั้นตอน {current + 1} จาก {STEPS.length}</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Step Pills */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap",
        justifyContent: "center", marginBottom: 28,
        width: "100%", maxWidth: 520,
      }}>
        {STEPS.map((s, i) => (
          <button key={i}
            onClick={() => setCurrent(i)}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              fontSize: 12,
              fontFamily: "'Sarabun', sans-serif",
              border: `1px solid ${i === current ? COLORS.green : done.has(i) ? "rgba(29,158,117,0.3)" : COLORS.border}`,
              background: i === current ? COLORS.greenLight : done.has(i) ? "rgba(29,158,117,0.08)" : "transparent",
              color: i === current ? COLORS.green : done.has(i) ? "#1D9E75" : COLORS.muted,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
            {done.has(i) ? "✓ " : ""}{s.short}
          </button>
        ))}
      </div>

      {/* Main Card */}
      <div style={{
        width: "100%", maxWidth: 520,
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: "32px 28px",
        marginBottom: 16,
      }}>
        {/* Step header */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: COLORS.greenLight,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, flexShrink: 0,
          }}>{step.emoji}</div>
          <div>
            <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>
              ขั้นตอนที่ {step.id}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: 0, fontFamily: "'Kanit', sans-serif" }}>
              {step.title}
            </h2>
            <p style={{ fontSize: 14, color: COLORS.muted, margin: "4px 0 0" }}>{step.desc}</p>
          </div>
        </div>

        {/* Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {step.items.map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 12, padding: "12px 14px",
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.55 }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Tip */}
        <div style={{
          background: COLORS.greenLight,
          border: `1px solid ${COLORS.greenBorder}`,
          borderRadius: 12, padding: "12px 16px",
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 16 }}>💡</span>
          <p style={{ fontSize: 13, color: "rgba(29,158,117,0.9)", margin: 0, lineHeight: 1.6 }}>{step.tip}</p>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 10, width: "100%", maxWidth: 520 }}>
        {current > 0 && (
          <button onClick={handleBack} style={{
            flex: 1, padding: "14px", borderRadius: 12,
            border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.muted,
            fontFamily: "'Kanit', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: "pointer",
          }}>
            ← ย้อนกลับ
          </button>
        )}
        <button onClick={handleNext} style={{
          flex: 2, padding: "14px", borderRadius: 12,
          border: "none",
          background: isLast ? COLORS.green : COLORS.green,
          color: "#fff",
          fontFamily: "'Kanit', sans-serif", fontSize: 15, fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.2s",
        }}>
          {isLast ? "🎉 เริ่มใช้งาน OpenThai AI!" : `ถัดไป: ${STEPS[current + 1].short} →`}
        </button>
      </div>

    </div>
  );
}
