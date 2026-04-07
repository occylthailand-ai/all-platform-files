import React, { useState } from 'react';

const phases = [
  { title: "สมัครและตั้งค่าบัญชี Facebook", icon: "👥", steps: [
    "โหลดแอป Facebook จาก Play Store / App Store", "กด \"สร้างบัญชีใหม่\" → ใส่ชื่อ-นามสกุล", "ใส่เบอร์มือถือหรืออีเมล", "ตั้งรหัสผ่าน (อย่างน้อย 8 ตัวอักษร)", "ยืนยัน OTP", "ใส่รูปโปรไฟล์ + รูปปก", "ตั้งค่า Privacy", "เปิด Notification"
  ]},
  { title: "สร้าง Facebook Page (ร้านค้า)", icon: "📄", steps: [
    "กด \"+\" → สร้าง Page → ใส่ชื่อร้าน", "เลือกหมวดธุรกิจ", "ใส่รูปโปรไฟล์ Page + ภาพปก", "เพิ่มคำอธิบายร้าน (About)", "ใส่ข้อมูลติดต่อ: เบอร์ / LINE / เว็บ", "ตั้ง Call-to-Action Button", "ตั้ง Auto Reply ใน Messenger", "เชิญเพื่อนกด Like Page"
  ]},
  { title: "ตั้งค่า Facebook Shop", icon: "🛒", aiAssisted: true, steps: [
    "Page → Commerce Manager → สร้าง Shop", "เลือก Checkout Method", "เลือกสกุลเงิน: บาทไทย (THB)", "ตั้งค่าการจัดส่ง", "ตั้งนโยบายคืนสินค้า", "เชื่อมบัญชีธนาคาร", "สร้าง Catalog: กลุ่มสินค้าหลัก", "[AI] เพิ่มสินค้าใน Catalog: ชื่อ / รายละเอียด / ราคา / รูป",
    "ตั้งราคาปกติ + ราคาลด", "ใส่ SKU / รหัสสินค้า", "เพิ่ม Variant: สี / ขนาด", "อัปโหลดรูปสินค้าอย่างน้อย 3 รูป", "ตั้งค่า Collection", "เพิ่ม Discount / Voucher Code", "เชื่อม Instagram Shop", "Submit Shop รอ Facebook อนุมัติ", "เปิดใช้งาน Shop บน Page"
  ]},
  { title: "สร้างคอนเทนต์และโพสต์ขาย", icon: "📝", aiAssisted: true, steps: [
    "[AI] สร้างโพสต์รูปภาพสินค้า + caption", "[AI] สร้างโพสต์วิดีโอสินค้า (Reel / Video)", "ใช้ Facebook Stories โปรโมทสินค้า", "Tag สินค้าจาก Shop ในโพสต์", "[AI] เพิ่ม Hashtag ที่เกี่ยวข้อง 5–10 อัน", "ตั้งเวลาโพสต์ (ไทย: 19:00–21:00 น.)", "Pin โพสต์ขายดีไว้ด้านบน Page", "โพสต์ใน Facebook Group ที่เกี่ยวข้อง"
  ]},
  { title: "Facebook Marketplace", icon: "🏷️", steps: [
    "กด Marketplace → สร้างรายการขายใหม่", "เลือกหมวดสินค้า", "ใส่ชื่อสินค้า / ราคา / ที่ตั้ง / รายละเอียด", "อัปโหลดรูปสินค้า (สูงสุด 10 รูป)", "เผยแพร่รายการใน Marketplace + แชร์เข้า Group"
  ]},
  { title: "รับออร์เดอร์และสื่อสาร", icon: "📩", steps: [
    "รับข้อความสั่งซื้อใน Messenger", "ตอบคำถามสินค้า / ราคา / วิธีสั่ง", "ส่งรูป/วิดีโอเพิ่มเติมใน Messenger", "ยืนยันออร์เดอร์: สินค้า / จำนวน / ที่อยู่", "แจ้งราคารวม: ค่าสินค้า + ค่าส่ง", "ส่ง QR PromptPay หรือเลขบัญชี", "รอรับสลิปโอนเงิน"
  ]},
  { title: "ตรวจสอบชำระเงิน", icon: "✅", steps: [
    "ตรวจสอบสลิป (ยอด / วันที่ / ชื่อ)", "เช็คยอดเข้าจริงใน Mobile Banking", "แจ้งลูกค้า \"ยืนยันชำระเงินแล้ว\"", "บันทึกออร์เดอร์ลงระบบ", "ออก Order Confirmation / Receipt"
  ]},
  { title: "แพ็คและจัดส่ง", icon: "📦", steps: [
    "แพ็คสินค้า + ใบปะหน้าที่อยู่ลูกค้า", "ส่งพัสดุกับขนส่ง (Flash / Kerry / J&T)", "แจ้งเลข Tracking ทาง Messenger", "ลูกค้าติดตามพัสดุ", "ลูกค้ารับสินค้า → ขอรีวิวและรูปถ่าย"
  ]},
  { title: "Facebook Ads โปรโมท", icon: "📢", steps: [
    "ตั้งค่า Meta Business Suite / Ads Manager", "สร้าง Ad Campaign: เลือก Objective", "ตั้ง Target Audience: อายุ / เพศ / ความสนใจ", "ตั้งงบโฆษณา Daily Budget", "เผยแพร่โฆษณา + ติดตาม Performance"
  ]},
  { title: "หลังการขายและ Retention", icon: "🔄", steps: [
    "ขอรีวิวและ Rating บน Facebook Page", "นำรีวิวจริงโพสต์ใน Page / Marketplace", "Follow up ลูกค้าหลัง 3–5 วัน ทาง Messenger", "สร้าง Facebook Group ของร้านเพื่อสร้างชุมชนลูกค้า"
  ]}
];

export default function FacebookOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#1877F2' }}>👥 Facebook Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>72 ขั้นตอน | 10 ส่วน | Page + Shop + Marketplace + Ads ครบจบ</p>
      <div style={{ background: '#e3f2fd', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#1877F2', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #1877F2', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#1877F2' : '#fff', color: i === currentPhase ? '#fff' : '#1877F2' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#1877F2' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#42B72A', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#1877F2' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#42B72A', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #1877F2', borderRadius: 20, background: '#fff', color: '#1877F2', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#1877F2', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#42B72A', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
