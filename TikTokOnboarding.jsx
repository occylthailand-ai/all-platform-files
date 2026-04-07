import React, { useState } from 'react';

const phases = [
  { title: "สมัครและตั้งค่าบัญชี", icon: "📱", steps: [
    "โหลดแอป TikTok จาก Play Store / App Store",
    "สมัครด้วยเบอร์มือถือ / อีเมล / Google / Facebook",
    "ยืนยัน OTP",
    "ตั้งชื่อผู้ใช้ (username) สั้น จำง่าย สื่อถึงแบรนด์",
    "ใส่รูปโปรไฟล์ + ชีวประวัติ (bio) 80 ตัวอักษร",
    "เพิ่มลิงก์เว็บหรือ LINE ใน bio (ต้องมี 1,000+ followers)"
  ]},
  { title: "ตั้งค่า Business Account", icon: "💼", steps: [
    "Settings → Manage Account → Switch to Business Account",
    "เลือกหมวดธุรกิจ (สินค้า / ค้าปลีก / ความงาม ฯลฯ)",
    "เชื่อม Facebook / Instagram (ถ้ามี)",
    "เปิด Creator Tools เพื่อดู Analytics"
  ]},
  { title: "สมัคร TikTok Shop", icon: "🛍️", steps: [
    "ไปที่ seller-th.tiktok.com หรือ TikTok Seller Center",
    "สมัครด้วยบัญชี TikTok ที่มีอยู่",
    "เลือกประเภทร้าน: บุคคลธรรมดา หรือ นิติบุคคล",
    "อัปโหลดเอกสาร: บัตรปชช. / ทะเบียนพาณิชย์",
    "ยืนยันบัญชีธนาคารสำหรับรับเงิน (PromptPay / บัญชีธนาคาร)",
    "รอ TikTok อนุมัติ 1–3 วันทำการ"
  ]},
  { title: "ตั้งค่าร้านค้าใน TikTok Shop", icon: "⚙️", steps: [
    "ตั้งชื่อร้านและโลโก้",
    "เพิ่มสินค้า: ชื่อ / รายละเอียด / ราคา / สต็อก / รูปภาพ",
    "ตั้งค่าการจัดส่ง: น้ำหนัก / ขนาด / บริษัทขนส่ง",
    "ตั้งนโยบายคืนสินค้า"
  ]},
  { title: "สร้างคอนเทนต์วิดีโอ", icon: "🎬", aiAssisted: true, steps: [
    "[AI] วางแผน Hook 3 วินาทีแรก (ดึงความสนใจ)",
    "ถ่ายวิดีโอ 15–60 วินาที (แนวตั้ง 9:16)",
    "ตัดต่อในแอป TikTok หรือ CapCut",
    "[AI] ใส่ caption + hashtag 5–10 อัน",
    "ใส่เสียง Trending จาก TikTok Sound",
    "เพิ่ม Sticker / Text / Effect ที่ TikTok แนะนำ",
    "Tag สินค้าจาก TikTok Shop ในวิดีโอ"
  ]},
  { title: "โพสต์และตั้งเวลา", icon: "📅", aiAssisted: true, steps: [
    "[AI] เลือกเวลาโพสต์ที่ดีที่สุด (ไทย: 18:00–21:00 น.)",
    "ตั้ง Schedule Post ล่วงหน้า",
    "เลือก Audience: ทุกคน / เพื่อน / ส่วนตัว",
    "เปิด Duet / Stitch / Comment ตามเหมาะสม"
  ]},
  { title: "Live Streaming ขายของสด", icon: "🔴", steps: [
    "กด \"+\" → LIVE → ตั้งชื่อ Live",
    "เพิ่มสินค้าใน Live Shopping basket",
    "Live อย่างน้อย 30 นาที (อัลกอริทึมชอบ)",
    "ตอบ Comment และ Pin สินค้าระหว่าง Live",
    "สรุปยอดขายหลัง Live จบ"
  ]},
  { title: "จัดการออร์เดอร์และจัดส่ง", icon: "📦", steps: [
    "รับ notification ออร์เดอร์ใหม่ใน Seller Center",
    "แพ็คสินค้า + พิมพ์ใบปะหน้า",
    "ส่งพัสดุกับขนส่ง (Flash / Kerry / J&T)",
    "กด Confirm Shipment ใน Seller Center",
    "ติดตาม Tracking จนถึงมือลูกค้า"
  ]},
  { title: "รับเงินและดู Analytics", icon: "💰", steps: [
    "TikTok Shop โอนเงินอัตโนมัติทุก 7–14 วัน",
    "ดู Dashboard: ยอดขาย / GMV / อัตราการคืนสินค้า",
    "ดู Video Analytics: Views / Watch Time / CTR",
    "ปรับ Content ตาม Performance"
  ]},
  { title: "เติบโตและ Scale", icon: "🚀", steps: [
    "ทำ Affiliate: ให้ Creator อื่นโปรโมทสินค้าแทน",
    "ลง TikTok Ads (Spark Ads ง่ายสุด)",
    "เข้าร่วม Campaign ของ TikTok เช่น 11.11 / 12.12",
    "ขยายสินค้า / เพิ่มหมวดหมู่ตามยอดขาย",
    "วิเคราะห์ข้อมูลและปรับกลยุทธ์อย่างต่อเนื่อง"
  ]}
];

export default function TikTokOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#FE2C55' }}>📱 TikTok Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>50 ขั้นตอน | 10 ส่วน | วิดีโอสั้น + Live = ยอดขายพุ่ง</p>
      <div style={{ background: '#ffe0e6', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#FE2C55', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (
          <button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #FE2C55', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#FE2C55' : '#fff', color: i === currentPhase ? '#fff' : '#FE2C55' }}>{p.icon} {i + 1}</button>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #ffe0e6', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#FE2C55' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#25F4EE', color: '#000', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#FE2C55' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#25F4EE', color: '#000', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #FE2C55', borderRadius: 20, background: '#fff', color: '#FE2C55', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#FE2C55', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#25F4EE', color: '#000', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
