import React, { useState } from 'react';

const phases = [
  { title: "สมัครและตั้งค่าบัญชี WhatsApp", icon: "📱", steps: [
    "โหลดแอป WhatsApp จาก Play Store / App Store",
    "ใส่เบอร์มือถือ (รองรับเบอร์ไทย +66)",
    "ยืนยัน OTP ทาง SMS หรือโทรศัพท์",
    "ตั้งชื่อโปรไฟล์ + รูปภาพที่สื่อถึงแบรนด์",
    "เขียน About 139 ตัวอักษร: ขายอะไร / ช่องทางสั่งซื้อ",
    "เปิด Notification รับแจ้งเตือนข้อความ"
  ]},
  { title: "Switch to WhatsApp Business", icon: "💼", steps: [
    "โหลดแอป WhatsApp Business",
    "ย้ายบัญชีจาก WhatsApp ปกติ → Business",
    "ยืนยัน OTP เบอร์มือถือ",
    "กรอก Business Profile: ชื่อร้าน / หมวด / คำอธิบาย",
    "ใส่ข้อมูลติดต่อ: ที่อยู่ / อีเมล / เว็บไซต์",
    "ตั้งเวลาทำการ (Business Hours)",
    "เลือกหมวดธุรกิจ: Shopping / Retail / Food / Beauty"
  ]},
  { title: "ตั้งค่า Business Tools", icon: "⚙️", steps: [
    "ตั้ง Greeting Message: ข้อความต้อนรับอัตโนมัติ",
    "ตั้ง Away Message: ตอบกลับนอกเวลาทำการ",
    "สร้าง Quick Replies: ข้อความสำเร็จรูป (ราคา / วิธีสั่ง / ค่าส่ง)",
    "ตั้ง Labels (แท็กสี): จัดกลุ่มแชทลูกค้า",
    "สร้าง Short Link: wa.me/66XXXXXXXXX",
    "สร้าง QR Code ให้ลูกค้าสแกน",
    "เชื่อม WhatsApp กับ Facebook Page / Instagram"
  ]},
  { title: "สร้าง WhatsApp Catalog", icon: "🛍️", aiAssisted: true, steps: [
    "Business Tools → Catalog → เพิ่มสินค้า",
    "อัปโหลดรูปสินค้า สูงสุด 10 รูปต่อสินค้า",
    "ตั้งชื่อสินค้า + ราคา",
    "[AI] เขียนรายละเอียดสินค้า: วัสดุ / ขนาด / วิธีใช้ / จุดเด่น",
    "ใส่ลิงก์ซื้อสินค้า (เว็บ / Shopee / Lazada)",
    "จัดกลุ่มสินค้าเป็น Collection",
    "แชร์ Catalog Link ให้ลูกค้าเข้าชม"
  ]},
  { title: "สร้างคอนเทนต์และโปรโมท", icon: "📢", aiAssisted: true, steps: [
    "[AI] โพสต์ WhatsApp Status: รูป / วิดีโอ / ข้อความ (อายุ 24 ชม.)",
    "โพสต์สินค้าใน Status 3–5 ครั้ง/วัน",
    "[AI] สร้าง Broadcast List: ส่งข้อความถึงลูกค้าหลายคน (สูงสุด 256 คน)",
    "[AI] ส่ง Broadcast โปรโมชั่น / สินค้าใหม่ / Flash Sale",
    "สร้าง WhatsApp Group ลูกค้า VIP",
    "แชร์ลิงก์ wa.me/ และ QR Code บน TikTok / FB / LINE / IG",
    "ใช้ WhatsApp Channel: โพสต์ข่าวสารถึง Follower ไม่จำกัด"
  ]},
  { title: "รับออร์เดอร์และสื่อสาร", icon: "📩", steps: [
    "รับข้อความสั่งซื้อจากลูกค้าใน Chat",
    "ส่ง Catalog สินค้าให้ลูกค้าเลือกใน Chat",
    "ลูกค้ากด \"เพิ่มลงตะกร้า\" → ส่ง Cart มาใน Chat",
    "ตอบคำถามสินค้า / ราคา / วิธีสั่ง",
    "ยืนยันออร์เดอร์: สินค้า / จำนวน / ที่อยู่",
    "แจ้งราคารวม: ค่าสินค้า + ค่าส่ง",
    "ส่ง QR PromptPay / PayPal / Wise ให้ลูกค้า"
  ]},
  { title: "ตรวจสอบชำระเงิน", icon: "💳", steps: [
    "รอลูกค้าโอนเงินผ่าน PromptPay / PayPal / Wise",
    "ตรวจสอบสลิปหรือยอดเข้าใน Mobile Banking",
    "แจ้งลูกค้า \"ยืนยันชำระเงินแล้ว\" ทาง Chat",
    "เปลี่ยน Label แชทเป็น \"ชำระแล้ว\"",
    "บันทึกออร์เดอร์ลงระบบ"
  ]},
  { title: "แพ็คและจัดส่ง", icon: "📦", steps: [
    "แพ็คสินค้า + ใบปะหน้าที่อยู่ลูกค้า",
    "ส่งพัสดุกับขนส่ง (Flash / Kerry / J&T / EMS ต่างประเทศ)",
    "แจ้งเลข Tracking ทาง WhatsApp Chat",
    "เปลี่ยน Label แชทเป็น \"จัดส่งแล้ว\"",
    "ลูกค้ารับสินค้า → ขอรีวิวทาง Chat"
  ]},
  { title: "WhatsApp Business API (Scale)", icon: "🤖", steps: [
    "สมัคร WhatsApp Business API ผ่าน Meta Business Suite",
    "เชื่อม API กับ CRM / Chatbot (Respond.io / WATI / Twilio)",
    "ตั้ง Automated Message Flows: Welcome → Order → Payment → Shipping",
    "ส่ง Template Messages: แจ้ง Tracking / ยืนยันออร์เดอร์อัตโนมัติ",
    "ใช้ Click-to-WhatsApp Ads จาก Facebook / Instagram"
  ]},
  { title: "หลังการขายและ Retention", icon: "🔄", steps: [
    "ขอรีวิวและรูปถ่ายจากลูกค้าทาง Chat",
    "แชร์รีวิวลูกค้าจริงใน WhatsApp Status",
    "Follow up ลูกค้าหลัง 3–5 วัน ทาง Chat",
    "เพิ่มลูกค้าเข้า VIP Group รับโปรโมชั่นพิเศษ",
    "ส่ง Broadcast สินค้าใหม่ / โปรโมชั่นประจำสัปดาห์",
    "วิเคราะห์ WhatsApp Business Statistics"
  ]}
];

export default function WhatsAppOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#25D366' }}>📱 WhatsApp Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>62 ขั้นตอน | 10 ส่วน | 2,000M+ Users ทั่วโลก</p>
      <div style={{ background: '#e8f5e9', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#25D366', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #25D366', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#25D366' : '#fff', color: i === currentPhase ? '#fff' : '#25D366' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#25D366' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#25D366', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#25D366' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#25D366', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #25D366', borderRadius: 20, background: '#fff', color: '#25D366', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#25D366', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#128C7E', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
