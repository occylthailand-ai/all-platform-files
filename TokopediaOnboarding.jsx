import React, { useState } from 'react';

const phases = [
  { title: "สมัครบัญชี Tokopedia", icon: "🇮🇩", steps: [
    "โหลดแอป Tokopedia หรือเข้า tokopedia.com",
    "กด \"Daftar\" (สมัคร) → ใส่เบอร์/อีเมล",
    "ยืนยัน OTP",
    "ตั้งชื่อบัญชีและรหัสผ่าน",
    "กรอกข้อมูลส่วนตัว",
    "เปิด Notification"
  ]},
  { title: "เปิดร้านค้า Tokopedia", icon: "🏪", steps: [
    "กด \"Buka Toko\" (เปิดร้าน)",
    "ตั้งชื่อร้านค้า",
    "เลือกหมวดหมู่สินค้าหลัก",
    "ใส่ที่อยู่ร้าน / Warehouse",
    "ใส่รูปโปรไฟล์ + ปก",
    "เขียน Shop Description",
    "ตั้ง Operation Hours"
  ]},
  { title: "ยืนยันตัวตนและอัปเกรด", icon: "✅", steps: [
    "Verifikasi Toko → ยืนยันตัวตน",
    "อัปโหลด KTP / Passport",
    "ถ่ายรูป Selfie คู่เอกสาร",
    "รอ Tokopedia ยืนยัน 1–3 วัน",
    "อัปเกรดเป็น Power Merchant",
    "อัปเกรดเป็น Official Store (สำหรับแบรนด์)"
  ]},
  { title: "ตั้งค่าการเงิน", icon: "💳", steps: [
    "Saldo → เพิ่มบัญชีธนาคาร (BCA/BRI/Mandiri/BNI)",
    "ใส่ชื่อ / เลขบัญชี / ธนาคาร",
    "ยืนยันบัญชีธนาคาร",
    "ตั้งค่า Saldo Tokopedia",
    "เปิด GoPay / OVO (ตัวเลือก)"
  ]},
  { title: "ตั้งค่าการจัดส่ง", icon: "🚚", steps: [
    "Pengiriman → เลือกขนส่ง",
    "เปิด JNE / J&T / SiCepat / AnterAja / GoSend / GrabExpress",
    "ตั้ง Pickup Address",
    "ตั้งน้ำหนัก/ขนาด Default",
    "ตั้ง Free Shipping Threshold"
  ]},
  { title: "เพิ่มสินค้าและ Listing", icon: "📦", aiAssisted: true, steps: [
    "Tambah Produk (เพิ่มสินค้า)",
    "เลือกหมวดหมู่ (Kategori)",
    "[AI] ตั้งชื่อสินค้าภาษาอินโดนีเซีย: Keyword + จุดเด่น",
    "อัปโหลดรูป 2–9 รูป",
    "อัปโหลดวิดีโอ",
    "[AI] เขียนรายละเอียดภาษาอินโดนีเซีย",
    "ตั้งราคา IDR + ราคาโปรโมชั่น",
    "ตั้งสต็อก + Variant (สี/ขนาด)",
    "ตั้งน้ำหนักสินค้า"
  ]},
  { title: "โปรโมชั่นและ Voucher", icon: "🎁", steps: [
    "Iklan & Promosi → สร้างโปรโมชั่น",
    "สร้าง Voucher Toko: ส่วนลด / ฟรีค่าส่ง",
    "ตั้ง Flash Sale",
    "เข้าร่วม Campaign: WIB / Ramadan / 11.11 / 12.12",
    "ตั้ง Bundling",
    "ใช้ Broadcast Chat"
  ]},
  { title: "TopAds (Tokopedia Ads)", icon: "📢", steps: [
    "TopAds → สร้างแคมเปญ",
    "เลือก Product / Shop / Display Ads",
    "เลือกสินค้า + Keyword",
    "ตั้งงบ + Bid per Click",
    "ติดตาม CTR / CPC / ROAS"
  ]},
  { title: "รับออร์เดอร์และจัดการ", icon: "📩", steps: [
    "รับ Notification ออร์เดอร์ใหม่",
    "ตรวจสอบรายละเอียด",
    "กด \"Terima Pesanan\" ภายใน 2 วัน",
    "แพ็คสินค้า",
    "พิมพ์ใบปะหน้าพัสดุ",
    "ส่งพัสดุ / Request Pickup"
  ]},
  { title: "ชำระเงินและรับเงิน", icon: "💰", steps: [
    "ลูกค้าชำระ GoPay / OVO / VA / บัตรเครดิต / Alfamart / Indomaret",
    "เงินเข้า Escrow (Rekening Bersama)",
    "ลูกค้ากด \"Selesai\" → เงิน Release",
    "กด \"Tarik Dana\" ถอนไปบัญชีธนาคาร",
    "รับเงินภายใน 1–2 วันทำการ"
  ]},
  { title: "หลังการขายและรีวิว", icon: "⭐", steps: [
    "ติดตามสถานะพัสดุ",
    "จัดการ Komplain / Return / Refund",
    "ตอบรีวิว (Ulasan) ทุกรายการ",
    "ขอรีวิวจากลูกค้าผ่าน Chat",
    "วิเคราะห์ Dashboard: ยอดขาย / Conversion / Traffic"
  ]}
];

export default function TokopediaOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#42B549' }}>🇮🇩 Tokopedia Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>65 ขั้นตอน | 11 ส่วน | 100M+ Users อินโดนีเซีย</p>
      <div style={{ background: '#e8f5e9', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#42B549', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #42B549', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#42B549' : '#fff', color: i === currentPhase ? '#fff' : '#42B549' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#42B549' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#42B549', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#42B549' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#42B549', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #42B549', borderRadius: 20, background: '#fff', color: '#42B549', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#42B549', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#2E7D32', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
