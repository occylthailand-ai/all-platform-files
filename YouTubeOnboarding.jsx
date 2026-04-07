import React, { useState } from 'react';

const phases = [
  { title: "สมัครบัญชี Google + YouTube", icon: "▶️", steps: [
    "ไปที่ youtube.com → กด \"ลงชื่อเข้าใช้\" → \"สร้างบัญชี\"",
    "สร้าง Google Account ด้วยอีเมลใหม่หรือ Gmail ที่มี",
    "ยืนยัน OTP ทางเบอร์มือถือ",
    "ตั้งชื่อ + นามสกุล (ใช้ชื่อแบรนด์ได้)",
    "เข้า YouTube → กด Profile → \"สร้าง Channel\"",
    "ตั้งชื่อ Channel ที่สื่อถึงแบรนด์",
    "เปิด Notification รับแจ้งเตือน Comment และ Subscriber"
  ]},
  { title: "ตั้งค่า Channel ให้พร้อมขาย", icon: "⚙️", steps: [
    "ใส่รูป Profile Picture ที่สื่อถึงแบรนด์",
    "ใส่ Banner Image (2560x1440px)",
    "เขียน Channel Description: ขายอะไร / จุดเด่น / สั่งซื้อ",
    "ใส่ลิงก์ร้านค้าใน Banner Links",
    "ตั้ง Channel Trailer วิดีโอแนะนำ",
    "สร้าง Playlist จัดกลุ่มวิดีโอ",
    "ตั้ง Channel Keywords",
    "เปิด YouTube Studio → ตั้ง Upload Defaults"
  ]},
  { title: "สมัคร YouTube Partner Program (YPP)", icon: "💰", steps: [
    "ต้องมี 1,000 Subscribers + 4,000 Watch Hours หรือ 10M Shorts Views",
    "YouTube Studio → Monetization → สมัคร YPP",
    "เชื่อม Google AdSense สำหรับรับรายได้",
    "ยืนยันตัวตนด้วยบัตรปชช. / Passport",
    "รอ YouTube ตรวจสอบ 1–30 วัน",
    "ได้ Approval → เปิด Monetization ทุกวิดีโอ"
  ]},
  { title: "ตั้งค่า YouTube Shopping", icon: "🛍️", steps: [
    "YouTube Studio → Monetization → Shopping → เปิดใช้งาน",
    "เชื่อมร้านค้าภายนอก: Shopify / Shopee / เว็บ",
    "เพิ่มสินค้าใน YouTube Shopping",
    "Tag สินค้าในวิดีโอ: ลูกค้ากดซื้อได้ระหว่างดู",
    "เปิด Store Tab ใน Channel"
  ]},
  { title: "สร้างวิดีโอยาว Long-form", icon: "🎬", aiAssisted: true, steps: [
    "[AI] วางแผน Content: เลือกหัวข้อที่คนค้นหา (Keyword Research)",
    "[AI] เขียน Script วิดีโอ: Hook 10 วิแรก → เนื้อหา → CTA",
    "ถ่ายวิดีโอคุณภาพสูง: กล้อง + แสง + เสียง",
    "ตัดต่อวิดีโอ: CapCut / Premiere / DaVinci Resolve",
    "ออกแบบ Thumbnail ดึงดูดคลิก (สำคัญมาก)",
    "[AI] เขียน Title: ใส่ Keyword หลัก ดึงดูดคลิก",
    "[AI] เขียน Description: รายละเอียด + ลิงก์สินค้า + Timestamp",
    "[AI] ใส่ Tags 10–15 อัน",
    "เพิ่ม End Screen + Cards"
  ]},
  { title: "YouTube Shorts วิดีโอสั้น", icon: "📱", aiAssisted: true, steps: [
    "ถ่ายวิดีโอแนวตั้ง 9:16 ความยาว 15–60 วินาที",
    "ตัดต่อให้กระชับ: Hook 1–3 วิแรก",
    "ใส่เสียง Trending / เพลงจาก YouTube Audio Library",
    "[AI] เขียน Title + #Shorts + Hashtag",
    "Tag สินค้าจาก YouTube Shopping",
    "โพสต์ Shorts 1–3 ครั้ง/วัน"
  ]},
  { title: "YouTube Live ขายของสด", icon: "🔴", steps: [
    "กด \"+\" → Go Live → ตั้งชื่อ Live",
    "เชื่อมสินค้าจาก YouTube Shopping ใน Live",
    "Live อย่างน้อย 30–60 นาที ตอบ Comment ตลอด",
    "Pin สินค้าและโปรโมชั่นระหว่าง Live",
    "เปิด Super Chat / Super Stickers",
    "บันทึก Live เป็นวิดีโอถาวรใน Channel"
  ]},
  { title: "YouTube SEO และ Analytics", icon: "🔍", aiAssisted: true, steps: [
    "[AI] วิจัย Keyword ด้วย YouTube Search / TubeBuddy / VidIQ",
    "ใส่ Keyword ใน Title / Description / Tags / Filename",
    "วิเคราะห์ Analytics: Views / Watch Time / CTR / Retention",
    "ปรับ Thumbnail + Title ของวิดีโอที่ CTR ต่ำ",
    "[AI] สร้าง Content ตาม Trending Keywords"
  ]},
  { title: "YouTube Ads โปรโมท", icon: "📢", steps: [
    "เข้า Google Ads → เชื่อม YouTube Channel",
    "สร้าง Video Ads Campaign: เลือก Objective",
    "เลือก Ad Format: Skippable / Non-skippable / Bumper / Discovery",
    "ตั้ง Target Audience: อายุ / เพศ / ความสนใจ / ภูมิภาค",
    "ตั้งงบ + เผยแพร่ + ติดตาม CPV / CTR / Conversion"
  ]},
  { title: "รับออร์เดอร์และดึง Traffic", icon: "🔗", steps: [
    "ใส่ลิงก์ร้านค้าใน Description ทุกวิดีโอ",
    "พูดใน CTA ท้ายวิดีโอ: \"กดลิงก์ใน Description\"",
    "ใช้ Pinned Comment: ลิงก์สินค้าใน Comment แรก",
    "รับ DM ใน Community Tab / Comment",
    "ส่งลูกค้าไป LINE / WhatsApp / Messenger",
    "ชำระเงินผ่าน PromptPay / PayPal / ร้านค้าภายนอก"
  ]},
  { title: "รายได้จาก YouTube โดยตรง", icon: "💵", steps: [
    "รายได้โฆษณา (Ad Revenue): YouTube จ่ายต่อ 1,000 Views",
    "Super Chat / Super Thanks: ลูกค้าจ่ายเงินระหว่าง Live/วิดีโอ",
    "Channel Memberships: สมาชิกจ่ายรายเดือน",
    "YouTube Shopping Affiliate: รับ Commission จาก Tag สินค้า",
    "Sponsorship / Brand Deal: แบรนด์จ่ายเงินให้รีวิว"
  ]},
  { title: "หลังการขายและ Community", icon: "🔄", steps: [
    "ขอรีวิวและ Feedback จาก Subscriber ทาง Community Tab",
    "ตอบ Comment ทุกวิดีโอสร้าง Engagement",
    "โพสต์ใน Community Tab: รูป / Poll / อัปเดตสินค้า",
    "วิเคราะห์ Revenue Analytics: Ad / Super Chat / Membership / Shopping",
    "ปรับ Content Strategy: วิดีโอไหน Revenue สูง → ทำเพิ่ม"
  ]}
];

export default function YouTubeOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#FF0000' }}>▶️ YouTube Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>73 ขั้นตอน | 12 ส่วน | 2,500M+ Users | Video + Shorts + Live + Revenue</p>
      <div style={{ background: '#ffebee', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#FF0000', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #FF0000', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#FF0000' : '#fff', color: i === currentPhase ? '#fff' : '#FF0000' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#FF0000' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#FF0000', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#FF0000' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#FF0000', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #FF0000', borderRadius: 20, background: '#fff', color: '#FF0000', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#FF0000', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#282828', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
