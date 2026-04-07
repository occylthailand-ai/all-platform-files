import React, { useState } from 'react';

const phases = [
  { title: "สมัครและตั้งค่าบัญชี LINE", icon: "💬", steps: [
    "โหลดแอป LINE จาก Play Store / App Store", "กด \"สมัครใหม่\" → ใส่เบอร์มือถือ", "ยืนยัน OTP 4 หลัก", "ตั้งชื่อโปรไฟล์ + รูปภาพ", "ตั้ง PIN 6 หลัก", "เชื่อม Facebook / Apple ID (ตัวเลือก)", "ตั้งค่า Privacy: ใครเพิ่มเพื่อนได้บ้าง", "เปิด notification เพื่อรับแจ้งเตือนออร์เดอร์"
  ]},
  { title: "สร้าง LINE Official Account", icon: "🏪", steps: [
    "ไปที่ account.line.biz → กด \"สร้าง Official Account\"", "ใส่ชื่อร้าน / หมวดธุรกิจ / อีเมล", "ยืนยันอีเมล", "ดาวน์โหลดแอป LINE Official Account", "ใส่รูปโปรไฟล์ร้าน + ภาพปก", "เขียน Bio ร้านค้า", "ตั้งค่า Auto Reply: ข้อความต้อนรับ + FAQ", "สร้าง Greeting Message เมื่อมีคนเพิ่มเพื่อน"
  ]},
  { title: "ตั้งค่า LINE MyShop", icon: "🛒", steps: [
    "เปิดแอป LINE Official Account → กด MyShop", "ตั้งชื่อร้านและโลโก้", "เพิ่มสินค้า: ชื่อ / รายละเอียด / ราคา / รูปภาพ / สต็อก", "ตั้งค่าการจัดส่ง: ขนส่ง / ค่าส่ง / น้ำหนัก", "เพิ่ม Coupon / โปรโมชั่น", "เปิดลิงก์ร้าน (MyShop URL)", "แชร์ลิงก์ร้านใน Bio LINE Official Account"
  ]},
  { title: "ตั้งค่า LINE Pay", icon: "💳", steps: [
    "เปิดแอป LINE → Wallet → LINE Pay", "กด \"สมัคร LINE Pay\"", "ยืนยันตัวตนด้วยบัตรประชาชน + Selfie", "ผูกบัญชีธนาคาร หรือ PromptPay", "ตั้ง Passcode LINE Pay 6 หลัก", "เปิดใช้งาน LINE Pay สำหรับรับเงินจากลูกค้า"
  ]},
  { title: "โปรโมทร้านและดึงลูกค้า", icon: "📢", aiAssisted: true, steps: [
    "[AI] โพสต์ใน LINE VOOM: วิดีโอ / รูป / โปรโมชั่น", "[AI] ส่ง Broadcast Message หาผู้ติดตามทั้งหมด", "สร้าง Rich Menu: ปุ่มเมนูด้านล่าง Chat", "[AI] สร้าง Card Message: แสดงสินค้าแบบ Carousel", "ใช้ LINE Ads เพื่อหาลูกค้าใหม่", "แชร์ QR Code ร้านบน TikTok / Facebook / IG"
  ]},
  { title: "รับออร์เดอร์และสื่อสาร", icon: "📩", steps: [
    "รับข้อความสั่งซื้อใน LINE Chat", "ตอบคำถามสินค้า / ราคา / วิธีสั่ง", "ส่งรูป/วิดีโอรีวิวเพิ่มเติมใน Chat", "ยืนยันออร์เดอร์: สินค้า / จำนวน / ที่อยู่", "แจ้งราคารวมค่าสินค้า + ค่าส่ง", "ส่ง PromptPay หรือ QR Code ให้ลูกค้าโอน", "รอรับสลิปโอนเงินจากลูกค้าใน Chat"
  ]},
  { title: "ตรวจสอบและยืนยันชำระเงิน", icon: "✅", steps: [
    "ตรวจสอบสลิปที่ลูกค้าส่งมา", "เช็คยอดเข้าใน Mobile Banking / LINE Pay จริง", "แจ้งลูกค้าว่า \"ยืนยันการชำระเงินแล้ว\"", "บันทึกออร์เดอร์ลงระบบ (Excel / Google Sheets)", "ออก Receipt หรือ Order Confirmation"
  ]},
  { title: "แพ็คและจัดส่งสินค้า", icon: "📦", steps: [
    "แพ็คสินค้าพร้อมใบปะหน้าที่อยู่ลูกค้า", "ส่งพัสดุกับขนส่ง (Flash / Kerry / J&T / ไปรษณีย์ไทย)", "แจ้งเลข Tracking ให้ลูกค้าทาง LINE Chat", "ลูกค้าติดตามพัสดุเองผ่านแอปขนส่ง", "ลูกค้ารับสินค้าแล้ว → ขอรีวิวใน LINE Chat"
  ]},
  { title: "หลังการขาย", icon: "🔄", steps: [
    "ขอรีวิว / รูปถ่ายจากลูกค้า", "เก็บรีวิวโพสต์ใน LINE VOOM / TikTok", "Follow up: \"สินค้าเป็นยังไงบ้างคะ?\" หลัง 3–5 วัน", "เชิญลูกค้าเพิ่มเพื่อน Official Account เพื่อรับโปรโมชั่นต่อ"
  ]}
];

export default function LINEOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#06C755' }}>💬 LINE Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>56 ขั้นตอน | 9 ส่วน | แชท + MyShop + LINE Pay ครบจบ</p>
      <div style={{ background: '#e8f5e9', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#06C755', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #06C755', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#06C755' : '#fff', color: i === currentPhase ? '#fff' : '#06C755' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#06C755' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#06C755', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#06C755' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#06C755', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #06C755', borderRadius: 20, background: '#fff', color: '#06C755', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#06C755', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#FF6F00', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
