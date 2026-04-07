import React, { useState } from 'react';
const phases = [
  {"title":"สมัครบัญชี Carousell","icon":"🇸🇬","steps":["โหลดแอป Carousell","สมัครด้วยเบอร์/อีเมล/Google/Facebook","ยืนยัน OTP","ตั้งชื่อ Username","ใส่รูปโปรไฟล์","เปิด Notification"]},
  {"title":"ตั้งค่าโปรไฟล์","icon":"⚙️","steps":["เขียน Bio: ขายอะไร/จุดเด่น","ใส่ Location จังหวัด/เมือง","เชื่อม Facebook เพิ่ม Trust","ยืนยันเบอร์มือถือ","สะสม Review จากผู้ซื้อ"]},
  {"title":"ลงประกาศขายสินค้า","icon":"📸","steps":["กด Sell → ถ่ายรูปสินค้า 1-10 รูป","เลือก Category","ตั้งชื่อสินค้า + Keyword","เขียนรายละเอียด: สภาพ/ขนาด/ราคา","ตั้งราคา (ต่อรองได้/ไม่ได้)","เลือก Condition: New/Used","เลือกวิธีจัดส่ง: ส่ง/นัดรับ"]},
  {"title":"โปรโมทสินค้า","icon":"📢","steps":["ใช้ Bump/Boost ดันประกาศขึ้นด้านบน","แชร์ลิงก์สินค้าบน FB/IG/LINE","เข้าร่วม Carousell Groups ที่เกี่ยวข้อง"]},
  {"title":"รับออร์เดอร์","icon":"📩","steps":["รับ Chat จากลูกค้า","ตอบคำถาม/ต่อรองราคา","ยืนยันออร์เดอร์: สินค้า/จำนวน/ที่อยู่","แจ้งราคารวม + ค่าส่ง","ส่ง QR PromptPay / PayNow / GCash"]},
  {"title":"ตรวจสอบชำระเงิน","icon":"💳","steps":["ตรวจสอบสลิป/ยอดเข้า","แจ้งยืนยันชำระเงิน","บันทึกออร์เดอร์","ใช้ Carousell Protection (ถ้ามี)"]},
  {"title":"จัดส่งสินค้า","icon":"📦","steps":["แพ็คสินค้า","ส่งพัสดุ/นัดรับสินค้า","แจ้ง Tracking ทาง Chat","ลูกค้ารับสินค้า → ขอรีวิว"]},
  {"title":"หลังการขาย","icon":"⭐","steps":["ขอ Rating จากผู้ซื้อ","ลงสินค้าชิ้นต่อไป","วิเคราะห์สินค้าขายดี → ทำเพิ่ม"]}
];
export default function CarousellOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#FF4747' }}>🇸🇬 Carousell Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>45 ขั้นตอน | 8 ส่วน | 30M+ Users อาเซียน</p>
      <div style={{ background: '#f0f0f0', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#FF4747', height: '100%', width: pct+'%', borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #FF4747', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#FF4747' : '#fff', color: i === currentPhase ? '#fff' : '#FF4747' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#FF4747' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}</h3>
        {phase.steps.map((step, si) => {
          const key = currentPhase+'-'+si; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4 }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#FF4747', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #FF4747', borderRadius: 20, background: '#fff', color: '#FF4747', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#FF4747', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#CC3333', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
