import React, { useState } from 'react';

const phases = [
  {
    title: "สมัครและตั้งค่าบัญชี Naver",
    icon: "🇰🇷",
    steps: [
      "ไปที่ naver.com → กด \"회원가입\" (Register)",
      "ใส่อีเมลหรือเบอร์มือถือ (รองรับเบอร์ต่างประเทศ)",
      "ยืนยัน OTP ทางเบอร์มือถือหรืออีเมล",
      "ตั้ง Naver ID + รหัสผ่าน",
      "กรอกข้อมูลส่วนตัว: ชื่อ / วันเกิด",
      "ใส่รูปโปรไฟล์ที่สื่อถึงแบรนด์",
      "เปิด Notification รับแจ้งเตือนข้อความและออร์เดอร์"
    ]
  },
  {
    title: "สมัครเปิด Naver Smart Store",
    icon: "🏪",
    steps: [
      "ไปที่ sell.smartstore.naver.com → กด \"입점 신청\"",
      "เลือกประเภทผู้ขาย: บุคคล / นิติบุคคล / ผู้ขายต่างชาติ",
      "กรอกข้อมูลธุรกิจ: ชื่อร้าน / ประเภทสินค้า / ที่อยู่",
      "อัปโหลดเอกสาร: ทะเบียนพาณิชย์ / Passport",
      "เชื่อมบัญชีธนาคารเกาหลี หรือ Payoneer",
      "ลงนามสัญญาผู้ขายออนไลน์",
      "รอ Naver Approve 3–7 วันทำการ",
      "ได้รับ Smart Store Account เข้า Seller Dashboard"
    ]
  },
  {
    title: "ตั้งค่าร้านค้า Smart Store",
    icon: "⚙️",
    steps: [
      "ตั้งชื่อร้านภาษาเกาหลี + โลโก้ร้านค้า",
      "ออกแบบหน้าร้าน: Banner / Theme / Layout",
      "เขียน Shop Description ภาษาเกาหลี",
      "ตั้งค่าการจัดส่ง: CJ Logistics / Hanjin / Lotte + ค่าส่ง",
      "เชื่อม Naver Pay สำหรับรับชำระเงิน",
      "ตั้ง Return / Exchange Policy ตามมาตรฐานเกาหลี"
    ]
  },
  {
    title: "เพิ่มสินค้าและตั้งค่า Listing",
    icon: "📦",
    aiAssisted: true,
    steps: [
      "Dashboard → สินค้า → เพิ่มสินค้าใหม่",
      "เลือกหมวดหมู่สินค้าให้ถูกต้อง",
      "[AI] ตั้งชื่อสินค้าภาษาเกาหลี: Keyword + จุดเด่น + ขนาด",
      "อัปโหลดรูปสินค้า: Main Image + รูปรายละเอียด 3–10 รูป",
      "สร้าง Detail Page (상세페이지): Infographic สวยงาม",
      "[AI] เขียนรายละเอียดสินค้าภาษาเกาหลี: วัสดุ / ขนาด / วิธีใช้",
      "ตั้งราคา KRW + ราคาโปรโมชั่น",
      "ตั้งสต็อก + SKU Variant (สี / ขนาด / รุ่น)",
      "Submit สินค้ารอ Approve 24–48 ชั่วโมง"
    ]
  },
  {
    title: "Naver SEO (검색엔진최적화)",
    icon: "🔍",
    aiAssisted: true,
    steps: [
      "[AI] วิจัย Keyword ภาษาเกาหลีเกี่ยวกับสินค้าไทย",
      "ใส่ Keyword ใน Product Title, Description, Tags",
      "[AI] สร้าง Naver Blog เขียนรีวิวสินค้าภาษาเกาหลี",
      "โพสต์ใน Naver Cafe ชุมชนเฉพาะกลุ่ม",
      "[AI] สร้างคอนเทนต์ใน Naver Post บทความยาว",
      "ติดตาม Search Ranking ใน Naver Webmaster Tools"
    ]
  },
  {
    title: "โปรโมชั่นและ Marketing",
    icon: "🎁",
    steps: [
      "สร้าง Coupon ส่วนลด: % หรือลดราคาคงที่",
      "ตั้ง Time Deal: โปรลดราคาจำกัดเวลา",
      "เข้าร่วม Naver Shopping Campaign: 11.11 / ฤดูกาล",
      "ตั้ง Bundle Deal: ซื้อหลายชิ้นราคาถูก",
      "ใช้ Naver Shopping Live ขายของสด",
      "ให้ Naver Point / Shopping Cash กับลูกค้า"
    ]
  },
  {
    title: "Naver Ads (네이버 광고)",
    icon: "📢",
    steps: [
      "เข้า searchad.naver.com → สร้าง Ads Account",
      "สร้าง Search Ads Campaign เลือก Keyword",
      "ตั้ง Bid ราคาประมูลต่อ Keyword",
      "ตั้งงบโฆษณาต่อวัน (Daily Budget)",
      "ติดตาม CTR / CPC / ROAS / Conversion"
    ]
  },
  {
    title: "Naver Blog และ Cafe สร้าง Trust",
    icon: "📝",
    aiAssisted: true,
    steps: [
      "[AI] สร้าง Naver Blog ของแบรนด์ เขียนรีวิวภาษาเกาหลี",
      "[AI] โพสต์ Blog 2–3 ครั้ง/สัปดาห์ ใส่ Keyword SEO",
      "เข้าร่วม Naver Cafe ที่เกี่ยวข้อง",
      "ขอ Naver Influencer (블로거) รีวิวสินค้า",
      "ใส่ลิงก์ Smart Store ในทุก Blog Post"
    ]
  },
  {
    title: "รับออร์เดอร์และจัดการ",
    icon: "📩",
    steps: [
      "รับ Notification ออร์เดอร์ใหม่ใน Seller Dashboard",
      "ตรวจสอบรายละเอียด: สินค้า / จำนวน / ที่อยู่ / Naver Pay",
      "ยืนยันออร์เดอร์และเตรียมสินค้าภายใน 48 ชั่วโมง",
      "แพ็คสินค้าตาม Standard ของ Naver",
      "พิมพ์ใบปะหน้าพัสดุจาก Dashboard",
      "ส่งพัสดุกับขนส่ง CJ / Hanjin หรือ EMS จากไทย"
    ]
  },
  {
    title: "ชำระเงินและรับเงิน",
    icon: "💳",
    steps: [
      "ลูกค้าชำระผ่าน Naver Pay / บัตรเครดิต / โอนธนาคาร",
      "เงินเข้า Naver Escrow รอ Release หลังลูกค้ารับสินค้า",
      "เงิน Release เข้า Smart Store Wallet",
      "โอนเงินจาก Wallet ไปบัญชีธนาคาร / Payoneer",
      "แลก KRW → THB ผ่านธนาคารหรือ Payoneer"
    ]
  },
  {
    title: "หลังการขายและรีวิว",
    icon: "⭐",
    steps: [
      "ติดตามสถานะพัสดุใน Dashboard",
      "จัดการ Return / Exchange ตามนโยบาย",
      "ตอบรีวิวลูกค้าทุกรายการ (สำคัญมากในเกาหลี)",
      "ขอรีวิวจากลูกค้าหลังรับสินค้า",
      "วิเคราะห์ Store Analytics: ยอดขาย / Conversion / Traffic",
      "ปรับปรุง Listing และ Blog Content ตาม Performance"
    ]
  }
];

export default function NaverOnboarding({ onComplete }) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [checked, setChecked] = useState({});

  const toggle = (pi, si) => {
    const key = `${pi}-${si}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSteps = phases.reduce((sum, p) => sum + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneSteps / totalSteps) * 100);

  const phase = phases[currentPhase];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 16, fontFamily: "'Sarabun', sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#03C75A' }}>🇰🇷 Naver Smart Store Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>69 ขั้นตอน | 11 ส่วน | Search อันดับ 1 เกาหลี 42M+ Users</p>

      {/* Progress Bar */}
      <div style={{ background: '#e8f5e9', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#03C75A', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
          {pct}%
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#666' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>

      {/* Phase Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (
          <button key={i} onClick={() => setCurrentPhase(i)}
            style={{
              padding: '6px 12px', border: '2px solid #03C75A', borderRadius: 16, cursor: 'pointer', fontSize: 13,
              background: i === currentPhase ? '#03C75A' : '#fff',
              color: i === currentPhase ? '#fff' : '#03C75A'
            }}>
            {p.icon} {i + 1}
          </button>
        ))}
      </div>

      {/* Current Phase */}
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#03C75A' }}>
          {phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#03C75A', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`;
          const isAI = step.startsWith('[AI]');
          const label = isAI ? step.replace('[AI] ', '') : step;
          return (
            <label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4, accentColor: '#03C75A' }} />
              <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#aaa' : '#333' }}>
                {isAI && <span style={{ background: '#03C75A', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}
                {label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
          style={{ padding: '10px 20px', border: '2px solid #03C75A', borderRadius: 20, background: '#fff', color: '#03C75A', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>
          ← ก่อนหน้า
        </button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)}
            style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#03C75A', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            ถัดไป →
          </button>
        ) : (
          <button onClick={onComplete}
            style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#FF6F00', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            เสร็จสิ้น ✓
          </button>
        )}
      </div>
    </div>
  );
}
