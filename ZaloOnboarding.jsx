import React, { useState } from 'react';

const phases = [
  { title: "สมัครและตั้งค่าบัญชี Zalo", icon: "🇻🇳", steps: [
    "โหลดแอป Zalo จาก Play Store / App Store",
    "กด \"สมัคร\" → ใส่เบอร์มือถือ",
    "ยืนยัน OTP ทาง SMS",
    "ตั้งชื่อโปรไฟล์ที่สื่อถึงแบรนด์",
    "ใส่รูปโปรไฟล์ + รูปปก (Cover Photo)",
    "ตั้งรหัสผ่าน",
    "เปิด Notification รับแจ้งเตือนข้อความและออร์เดอร์"
  ]},
  { title: "สมัคร Zalo Official Account (OA)", icon: "🏪", steps: [
    "ไปที่ oa.zalo.me → กด \"Tạo OA\" (สร้าง OA)",
    "ลงทะเบียนด้วยบัญชี Zalo",
    "เลือกประเภท OA: ร้านค้า / แบรนด์ / บริการ",
    "กรอกข้อมูลธุรกิจ: ชื่อร้าน / หมวด / ที่อยู่",
    "อัปโหลดเอกสาร: ทะเบียนพาณิชย์ / Passport",
    "รอ Zalo อนุมัติ 1–3 วัน",
    "ได้รับ Official Account พร้อมใช้งาน"
  ]},
  { title: "ตั้งค่า OA และโปรไฟล์ธุรกิจ", icon: "⚙️", steps: [
    "ตั้งชื่อ OA + โลโก้ + รูปปก",
    "เขียน OA Description ภาษาเวียดนาม",
    "ตั้งค่า Auto Reply: ข้อความต้อนรับ",
    "สร้าง Menu: ปุ่ม \"สินค้า / สั่งซื้อ / ราคา / ติดต่อ\"",
    "ตั้ง Quick Reply สำเร็จรูป",
    "เพิ่มข้อมูลติดต่อ: เบอร์ / อีเมล / เว็บ"
  ]},
  { title: "ตั้งค่า Zalo Shop", icon: "🛍️", aiAssisted: true, steps: [
    "OA Management → Shop → เปิดใช้งาน",
    "ตั้งชื่อร้านและโลโก้",
    "[AI] เพิ่มสินค้า: ชื่อ / รายละเอียด / ราคา VND / รูป / สต็อก",
    "จัดกลุ่มสินค้าเป็น Category",
    "ตั้งค่าการจัดส่ง",
    "เชื่อม ZaloPay / บัญชีธนาคารเวียดนาม",
    "เปิด Shop Tab ใน OA"
  ]},
  { title: "ตั้งค่า ZaloPay", icon: "💳", steps: [
    "โหลดแอป ZaloPay",
    "สมัคร ZaloPay ด้วยเบอร์เวียดนาม",
    "ยืนยันตัวตน (CCCD / Passport)",
    "ผูกบัญชีธนาคารเวียดนาม",
    "เปิดใช้งาน ZaloPay รับเงินจากลูกค้า"
  ]},
  { title: "สร้างคอนเทนต์และโปรโมท", icon: "📢", aiAssisted: true, steps: [
    "[AI] สร้างโพสต์ใน Zalo OA: รูปสินค้า + ข้อความเวียดนาม",
    "โพสต์ใน Zalo Moment (Timeline)",
    "[AI] ส่ง Broadcast Message หา Follower ทั้งหมด",
    "[AI] สร้าง Zalo Article: บทความยาวใน OA",
    "สร้าง Voucher / Coupon ส่วนลด",
    "แชร์ QR Code OA บน Facebook / TikTok / IG",
    "ใช้ Zalo Ads โปรโมท OA และสินค้า"
  ]},
  { title: "Zalo Ads", icon: "📊", steps: [
    "เข้า ads.zalo.me → สร้าง Ads Account",
    "สร้าง Campaign: เลือก Objective (Followers / Messages / Traffic)",
    "ตั้ง Target Audience: อายุ / เพศ / ที่อยู่ / ความสนใจ",
    "ตั้งงบโฆษณาต่อวัน",
    "เผยแพร่ + ติดตาม Reach / CTR / CPC"
  ]},
  { title: "รับออร์เดอร์และสื่อสาร", icon: "📩", steps: [
    "รับข้อความสั่งซื้อใน OA Chat",
    "ตอบคำถามสินค้า / ราคา / วิธีสั่ง",
    "ส่งสินค้าจาก Zalo Shop ให้ลูกค้าเลือกใน Chat",
    "ยืนยันออร์เดอร์: สินค้า / จำนวน / ที่อยู่",
    "แจ้งราคารวม: ค่าสินค้า + ค่าส่ง (VND)",
    "ส่ง QR ZaloPay / เลขบัญชีธนาคาร"
  ]},
  { title: "ตรวจสอบชำระเงิน", icon: "✅", steps: [
    "ลูกค้าชำระผ่าน ZaloPay / โอนธนาคาร / COD",
    "ตรวจสอบยอดเข้าใน ZaloPay / Mobile Banking",
    "แจ้งลูกค้า \"ยืนยันชำระเงินแล้ว\"",
    "ติด Label \"ชำระแล้ว\"",
    "บันทึกออร์เดอร์"
  ]},
  { title: "แพ็คและจัดส่ง", icon: "📦", steps: [
    "แพ็คสินค้า + ใบปะหน้า",
    "ส่งพัสดุ: GHN / Viettel Post / J&T VN / GHTK",
    "แจ้ง Tracking ทาง Zalo Chat",
    "ลูกค้าติดตามพัสดุ",
    "รับสินค้า → ขอรีวิว"
  ]},
  { title: "หลังการขายและ Retention", icon: "🔄", steps: [
    "ขอรีวิวและรูปถ่ายจากลูกค้า",
    "โพสต์รีวิวจริงใน OA / Moment",
    "Follow up หลัง 3–5 วัน",
    "ส่ง Broadcast โปรโมชั่นประจำสัปดาห์",
    "วิเคราะห์ OA Analytics: Followers / Messages / ยอดขาย"
  ]}
];

export default function ZaloOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#0068FF' }}>🇻🇳 Zalo Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>65 ขั้นตอน | 11 ส่วน | 75M+ Users เวียดนาม</p>
      <div style={{ background: '#e3f2fd', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#0068FF', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #0068FF', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#0068FF' : '#fff', color: i === currentPhase ? '#fff' : '#0068FF' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#0068FF' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#0068FF', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#0068FF' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#0068FF', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #0068FF', borderRadius: 20, background: '#fff', color: '#0068FF', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#0068FF', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#00A2FF', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
