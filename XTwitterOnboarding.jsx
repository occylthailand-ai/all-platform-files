import React, { useState } from 'react';

const phases = [
  {
    title: "สมัครและตั้งค่าบัญชี X",
    icon: "🐦‍⬛",
    steps: [
      "โหลดแอป X จาก Play Store / App Store หรือเข้า x.com",
      "กด \"สร้างบัญชี\" → ใส่ชื่อ + อีเมลหรือเบอร์มือถือ",
      "ยืนยัน OTP ทางอีเมลหรือเบอร์มือถือ",
      "ตั้ง Username (@handle) ที่สื่อถึงแบรนด์ สั้น จำง่าย",
      "ตั้งรหัสผ่านอย่างน้อย 8 ตัวอักษร",
      "ใส่รูปโปรไฟล์ที่สื่อถึงแบรนด์หรือสินค้า",
      "เปิด Notification รับแจ้งเตือน DM และ Mention"
    ]
  },
  {
    title: "ตั้งค่าโปรไฟล์ให้พร้อมขาย",
    icon: "✅",
    steps: [
      "ใส่รูปปก (Header Image) 1500x500px แสดงสินค้าหรือโปรโมชั่น",
      "เขียน Bio 160 ตัวอักษร: ขายอะไร / จุดเด่น / ช่องทางสั่งซื้อ",
      "ใส่ลิงก์เว็บไซต์ / LINE / Shopee / TikTok Shop ใน Profile",
      "ใส่ Location: ประเทศไทย หรือจังหวัดที่อยู่",
      "สมัคร X Premium เพื่อได้ Verified Badge ✓ ($8/เดือน)",
      "เปิด Professional Account: Settings → Professional Tools",
      "เลือกหมวดธุรกิจ: Shopping / Retail / Food / Beauty ฯลฯ"
    ]
  },
  {
    title: "ตั้งค่า X Shopping",
    icon: "🛍️",
    steps: [
      "ไปที่ Professional Tools → Shopping → เปิดใช้งาน X Shops",
      "เชื่อมร้านค้าภายนอก: Shopify / Shopee / เว็บไซต์",
      "เพิ่มสินค้าใน X Shop: ชื่อ / รูป / ราคา / ลิงก์ซื้อ",
      "เปิด Shop Tab ใน Profile ให้ลูกค้าเข้าชมสินค้า"
    ]
  },
  {
    title: "สร้างคอนเทนต์โพสต์ขาย",
    icon: "📝",
    aiAssisted: true,
    steps: [
      "เขียนโพสต์ (Tweet) สูงสุด 280 ตัวอักษร (Premium ได้ 25,000)",
      "แนบรูปสินค้า สูงสุด 4 รูปต่อโพสต์",
      "แนบวิดีโอสินค้า สูงสุด 2 นาที 20 วิ",
      "[AI] ใส่ Hashtag (#) 2–5 อัน ที่ Trending หรือเกี่ยวข้อง",
      "ใส่ลิงก์ร้านค้า / สินค้า / LINE ในโพสต์",
      "[AI] สร้าง Thread: โพสต์ต่อเนื่องเล่าเรื่องสินค้าละเอียด",
      "ใช้ Poll สอบถามความคิดเห็นลูกค้า ดึง Engagement",
      "[AI] โพสต์สม่ำเสมอ 3–5 ครั้ง/วัน ช่วง 07:00 / 12:00 / 19:00–21:00",
      "Pin โพสต์ขายดีหรือโปรโมชั่นไว้ด้านบน Profile"
    ]
  },
  {
    title: "สร้าง Engagement และการมองเห็น",
    icon: "💬",
    steps: [
      "Reply ทุก Comment / Mention จากลูกค้าและคนสนใจ",
      "Repost (Retweet) คอนเทนต์ที่เกี่ยวข้องกับสินค้า",
      "Quote Repost โพสต์ตัวเองพร้อม Caption ใหม่",
      "Like และ Reply โพสต์ของ Influencer ในกลุ่มเดียวกัน",
      "เข้าร่วมสนทนา Trending Topics ที่เกี่ยวข้องกับสินค้า",
      "สร้าง X Spaces: พูดคุยสดเรื่องสินค้า / Q&A กับลูกค้า"
    ]
  },
  {
    title: "X Ads โปรโมทสินค้า",
    icon: "📢",
    steps: [
      "ไปที่ ads.x.com → สร้าง Ads Account",
      "สร้าง Campaign: เลือก Objective (Reach / Engagement / Conversions)",
      "ตั้ง Target Audience: อายุ / เพศ / ความสนใจ / ภูมิภาค / ภาษา",
      "ตั้งงบโฆษณา Daily Budget + Bid Strategy",
      "เผยแพร่โฆษณาและติดตาม Impressions / CTR / CPC"
    ]
  },
  {
    title: "ดึง Traffic ไปร้านค้าภายนอก",
    icon: "🔗",
    steps: [
      "ใส่ลิงก์ Shopee / TikTok Shop / LINE / เว็บ ในทุกโพสต์ขาย",
      "ใช้ Link Shortener (Bitly / TinyURL) ติดตาม Click",
      "บอกให้ลูกค้า DM เพื่อสั่งซื้อโดยตรง",
      "แชร์โพสต์ X ไปยัง Facebook / LINE / Instagram ขยาย Reach",
      "สร้าง X List รวม Influencer / ลูกค้า / คู่ค้า ติดตามได้ง่าย"
    ]
  },
  {
    title: "รับออร์เดอร์และสื่อสารกับลูกค้า",
    icon: "📩",
    steps: [
      "รับ DM (Direct Message) คำสั่งซื้อจากลูกค้าใน X",
      "ตอบคำถามสินค้า / ราคา / วิธีสั่งซื้อใน DM",
      "ส่งรูปสินค้าเพิ่มเติมหรือวิดีโอรีวิวใน DM",
      "ยืนยันออร์เดอร์: ชื่อสินค้า / จำนวน / ที่อยู่จัดส่ง",
      "แจ้งราคารวม: ค่าสินค้า + ค่าจัดส่ง",
      "ส่ง QR PromptPay / เลขบัญชี / PayPal ให้ลูกค้าชำระ"
    ]
  },
  {
    title: "ตรวจสอบการชำระเงิน",
    icon: "💳",
    steps: [
      "ตรวจสอบสลิปหรือการชำระผ่าน PromptPay / PayPal / ธนาคาร",
      "เช็คยอดเข้าใน Mobile Banking",
      "แจ้งลูกค้า \"ยืนยันชำระเงินแล้ว\" ทาง DM",
      "บันทึกออร์เดอร์ลงระบบ (Excel / Google Sheets)"
    ]
  },
  {
    title: "แพ็คและจัดส่งสินค้า",
    icon: "📦",
    steps: [
      "แพ็คสินค้า + เขียนใบปะหน้าที่อยู่ลูกค้า",
      "ส่งพัสดุกับขนส่ง (Flash / Kerry / J&T / EMS สำหรับต่างประเทศ)",
      "แจ้งเลข Tracking ให้ลูกค้าทาง DM",
      "ลูกค้าติดตามพัสดุผ่านแอปขนส่ง",
      "ลูกค้ารับสินค้าแล้ว → ขอรีวิวทาง DM"
    ]
  },
  {
    title: "หลังการขายและ Retention",
    icon: "🔄",
    steps: [
      "ขอรีวิวและรูปถ่ายจากลูกค้า",
      "Repost รีวิวลูกค้าจริง สร้าง Social Proof",
      "Follow up ลูกค้าหลัง 3–5 วัน ทาง DM",
      "วิเคราะห์ X Analytics: Impressions / Engagement Rate / Link Clicks",
      "ปรับ Content Strategy: โพสต์ไหน Engagement สูง → ทำเพิ่ม"
    ]
  }
];

export default function XTwitterOnboarding({ onComplete }) {
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
      <h2 style={{ textAlign: 'center', color: '#000' }}>🐦‍⬛ X (Twitter) Selling Roadmap</h2>
      <p style={{ textAlign: 'center', color: '#536471' }}>63 ขั้นตอน | 11 ส่วน | 500M+ Users ทั่วโลก</p>

      {/* Progress Bar */}
      <div style={{ background: '#e1e8ed', borderRadius: 12, height: 24, margin: '16px 0', overflow: 'hidden' }}>
        <div style={{ background: '#000', height: '100%', width: `${pct}%`, borderRadius: 12, transition: 'width 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
          {pct}%
        </div>
      </div>
      <p style={{ textAlign: 'center', fontSize: 14, color: '#536471' }}>{doneSteps}/{totalSteps} ขั้นตอน</p>

      {/* Phase Navigation */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', margin: '12px 0' }}>
        {phases.map((p, i) => (
          <button key={i} onClick={() => setCurrentPhase(i)}
            style={{
              padding: '6px 12px', border: '2px solid #000', borderRadius: 16, cursor: 'pointer', fontSize: 13,
              background: i === currentPhase ? '#000' : '#fff',
              color: i === currentPhase ? '#fff' : '#000'
            }}>
            {p.icon} {i + 1}
          </button>
        ))}
      </div>

      {/* Current Phase */}
      <div style={{ background: '#fff', border: '1px solid #e1e8ed', borderRadius: 12, padding: 16, marginTop: 12 }}>
        <h3 style={{ margin: '0 0 12px', color: '#000' }}>
          {phase.icon} ส่วนที่ {currentPhase + 1} — {phase.title}
          {phase.aiAssisted && <span style={{ background: '#17BF63', color: '#fff', padding: '2px 8px', borderRadius: 8, fontSize: 12, marginLeft: 8 }}>AI</span>}
        </h3>
        {phase.steps.map((step, si) => {
          const key = `${currentPhase}-${si}`;
          const isAI = step.startsWith('[AI]');
          const label = isAI ? step.replace('[AI] ', '') : step;
          return (
            <label key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}>
              <input type="checkbox" checked={!!checked[key]} onChange={() => toggle(currentPhase, si)} style={{ marginTop: 4 }} />
              <span style={{ textDecoration: checked[key] ? 'line-through' : 'none', color: checked[key] ? '#999' : '#000' }}>
                {isAI && <span style={{ background: '#17BF63', color: '#fff', padding: '1px 6px', borderRadius: 6, fontSize: 11, marginRight: 4 }}>AI</span>}
                {label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button onClick={() => setCurrentPhase(Math.max(0, currentPhase - 1))}
          disabled={currentPhase === 0}
          style={{ padding: '10px 20px', border: '2px solid #000', borderRadius: 20, background: '#fff', cursor: currentPhase === 0 ? 'not-allowed' : 'pointer', opacity: currentPhase === 0 ? 0.3 : 1 }}>
          ← ก่อนหน้า
        </button>
        {currentPhase < phases.length - 1 ? (
          <button onClick={() => setCurrentPhase(currentPhase + 1)}
            style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#000', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            ถัดไป →
          </button>
        ) : (
          <button onClick={onComplete}
            style={{ padding: '10px 20px', border: 'none', borderRadius: 20, background: '#17BF63', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
            เสร็จสิ้น ✓
          </button>
        )}
      </div>
    </div>
  );
}
