import React, { useState } from 'react';

const phases = [
  { title: "สมัคร Google Account", icon: "🔍", steps: [
    "ไปที่ accounts.google.com → กด \"สร้างบัญชี\"",
    "ใส่ชื่อ-นามสกุล + อีเมลใหม่ (@gmail.com)",
    "ตั้งรหัสผ่าน",
    "ยืนยัน OTP ทางเบอร์มือถือ",
    "กรอกข้อมูลเพิ่มเติม: วันเกิด / เพศ",
    "ยอมรับเงื่อนไข → ได้ Google Account"
  ]},
  { title: "สมัคร Google Business Profile", icon: "📍", steps: [
    "ไปที่ business.google.com → กด \"จัดการตอนนี้\"",
    "ใส่ชื่อธุรกิจ / ร้านค้า",
    "เลือกหมวดธุรกิจ: ร้านค้า / ร้านอาหาร / บริการ",
    "ใส่ที่อยู่ร้าน (แสดงบน Google Maps)",
    "ใส่เบอร์โทร + เว็บไซต์ + อีเมล",
    "ยืนยันตัวตน: Postcard / โทร / อีเมล / Video Call",
    "รอยืนยัน 3–14 วัน",
    "ได้ Business Profile บน Maps + Search"
  ]},
  { title: "ตั้งค่า Business Profile ให้พร้อมขาย", icon: "⚙️", steps: [
    "ใส่รูปร้าน / สินค้า / โลโก้ อย่างน้อย 10 รูป",
    "เขียน Business Description",
    "ตั้งเวลาทำการ",
    "เพิ่ม Products: ชื่อ / รายละเอียด / ราคา / รูป",
    "เพิ่ม Services + ราคา",
    "เปิด Messaging: ลูกค้าแชทจาก Google Maps",
    "เปิด Booking: จองนัดหมายจาก Google"
  ]},
  { title: "สมัคร Google Merchant Center", icon: "🛍️", steps: [
    "ไปที่ merchants.google.com → สร้างบัญชี",
    "กรอกข้อมูลธุรกิจ: ชื่อ / ประเทศ / เว็บ",
    "ยืนยันเว็บไซต์ด้วย HTML Tag / Search Console",
    "ตั้งค่าจัดส่ง: ค่าส่ง / พื้นที่ / เวลา",
    "ตั้ง Return Policy",
    "เชื่อม Google Ads Account",
    "เลือก Programs: Shopping Ads / Free Listings",
    "เปิด Free Product Listings บน Shopping Tab"
  ]},
  { title: "เพิ่มสินค้า Product Feed", icon: "📦", aiAssisted: true, steps: [
    "Products → Add Products",
    "เลือกวิธี: ทีละชิ้น / Feed / เชื่อม Shopify-WooCommerce",
    "[AI] กรอก Product Title: Brand + Keyword + จุดเด่น",
    "[AI] กรอก Product Description ครบถ้วน",
    "อัปโหลดรูปสินค้า: Main Image พื้นขาว",
    "ตั้งราคา + สกุลเงิน",
    "ใส่ GTIN / MPN / Brand",
    "ตั้งสถานะ In Stock / Out of Stock",
    "Submit Product Feed → รอ Review 24–72 ชม."
  ]},
  { title: "Google Ads โฆษณา", icon: "📢", steps: [
    "ads.google.com → สร้างบัญชี Google Ads",
    "เชื่อม Merchant Center + Analytics + Tag Manager",
    "สร้าง Shopping Campaign",
    "สร้าง Performance Max Campaign (AI ทุกช่องทาง)",
    "สร้าง Search Ads + Display Ads",
    "ตั้ง Target Audience: Location / Keywords / Demographics",
    "ตั้งงบ + Bidding → เผยแพร่",
    "ติดตาม ROAS / CPC / CTR"
  ]},
  { title: "Google SEO ติดอันดับฟรี", icon: "🔎", aiAssisted: true, steps: [
    "[AI] วิจัย Keyword ด้วย Keyword Planner / Ubersuggest",
    "[AI] สร้าง Content คุณภาพสูง: Blog / Product Page",
    "[AI] ทำ On-Page SEO: Title Tag / Meta Description / H1",
    "ทำ Technical SEO: Speed / Mobile-Friendly / Sitemap / Schema",
    "สร้าง Backlink จากเว็บคุณภาพ",
    "ลงทะเบียน Google Search Console",
    "ปรับ Content ตาม Performance ทุกเดือน"
  ]},
  { title: "Google Posts + Offers", icon: "📝", aiAssisted: true, steps: [
    "[AI] สร้าง Google Posts: โพสต์สินค้า / โปรโมชั่น",
    "สร้าง Offers: คูปองส่วนลดบน Business Profile",
    "สร้าง Events: Flash Sale / อีเวนต์",
    "โพสต์สม่ำเสมอ 2–3 ครั้ง/สัปดาห์",
    "ใส่ CTA Button: \"สั่งซื้อ\" / \"โทร\" / \"ดูเว็บ\""
  ]},
  { title: "รับออร์เดอร์และดึง Traffic", icon: "🔗", steps: [
    "ลูกค้าค้นหาบน Google → เห็นร้านบน Shopping / Maps",
    "ลูกค้าคลิก → ไปเว็บ / Shopee / Lazada / LINE",
    "ลูกค้าแชทจาก Google Business Messaging",
    "ลูกค้าโทรจาก Google Maps",
    "ยืนยันออร์เดอร์: สินค้า / จำนวน / ที่อยู่",
    "ชำระเงินผ่านร้านค้าภายนอก"
  ]},
  { title: "รับเงินและจัดส่ง", icon: "💰", steps: [
    "รับเงินผ่านช่องทางร้านค้าภายนอก",
    "แพ็คสินค้า + ส่งพัสดุ",
    "แจ้ง Tracking ให้ลูกค้า",
    "ลูกค้ารับสินค้า",
    "ขอรีวิวบน Google Business Profile (สำคัญมาก)"
  ]},
  { title: "รีวิวและ Analytics", icon: "📊", steps: [
    "ตอบรีวิวลูกค้าทุกรายการ (ส่งผลต่อ Ranking มาก)",
    "ขอรีวิว 5 ดาวจากลูกค้าผ่าน Short Link",
    "วิเคราะห์ Business Insights: Views / Clicks / Calls",
    "วิเคราะห์ Google Analytics: Traffic / Conversion / Revenue",
    "วิเคราะห์ Google Ads: ROAS / CPC / CTR",
    "ปรับ Keyword / Ads / Content ตาม Performance"
  ]}
];

export default function GoogleOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});
  const toggle = (pi, si) => { const key = `${pi}-${si}`; setChecked(prev => ({ ...prev, [key]: !prev[key] })); };
  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);
  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#4285F4' }}>🔍 Google Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>75 ขั้นตอน | 11 ส่วน | 4,300M+ Users ทั่วโลก</p>
      <div style={{ background: '#e8eaf6', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#4285F4', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{pct}%</div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (<button key={i} onClick={() => setCurrentPhase(i)} style={{ padding: '6px 12px', border: '2px solid #4285F4', borderRadius: 16, cursor: 'pointer', fontSize: 13, background: i === currentPhase ? '#4285F4' : '#fff', color: i === currentPhase ? '#fff' : '#4285F4' }}>{p.icon} {i + 1}</button>))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#4285F4' }}>{phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#34A853', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`; const isAI = step.startsWith('[AI]'); const label = isAI ? step.replace('[AI] ', '') : step;
          return (<label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#4285F4' }} />
            <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
              {isAI && <span style={{ background: '#34A853', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}{label}
            </span></label>);
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0} style={{ padding: '10px 20px', border: '2px solid #4285F4', borderRadius: 20, background: '#fff', color: '#4285F4', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>← ก่อนหน้า</button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#4285F4', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>ถัดไป →</button>
        ) : (<button onClick={onComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#34A853', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>เสร็จสิ้น ✓</button>)}
      </div>
    </div>
  );
}
