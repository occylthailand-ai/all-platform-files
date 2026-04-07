/**
 * TikTokShopOnboarding.jsx
 * Wizard พา Seller ตั้งค่า TikTok Shop ตั้งแต่สมัครจนรับเงิน
 * 75 ขั้นตอน ใน 13 ส่วน — Social Commerce อันดับ 1 ไทย 40M+
 *
 * วิธีใช้:
 *   import TikTokShopOnboarding from './TikTokShopOnboarding'
 *   <TikTokShopOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและข้อมูลให้พร้อม",
    steps:[
      {n:1, t:"เตรียมเบอร์มือถือไทย",           d:"สำหรับสมัคร TikTok Account"},
      {n:2, t:"เตรียมบัตรปชช./ทะเบียนพาณิชย์", d:"สำหรับยืนยันตัวตน"},
      {n:3, t:"เตรียมบัญชีธนาคารไทย",           d:"สำหรับรับเงิน"},
      {n:4, t:"เตรียมรูปสินค้าและรายละเอียด",   d:"ให้พร้อมก่อนเริ่ม"},
    ],
  },
  { id:2,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี TikTok", desc:"สร้าง TikTok Account สำหรับขาย",
    steps:[
      {n:5,  t:"โหลดแอป TikTok",                d:"Play Store / App Store"},
      {n:6,  t:"กด 'สมัคร' + เบอร์/Email/Google/FB",d:""},
      {n:7,  t:"ยืนยัน OTP",                    d:"รับรหัสทางเบอร์มือถือ"},
      {n:8,  t:"ตั้ง Username",                  d:"สื่อถึงแบรนด์หรือร้านค้า",         ai:true},
      {n:9,  t:"ใส่รูปโปรไฟล์แบรนด์",          d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:10, t:"เขียน Bio",                     d:"ขายอะไร จุดเด่น ช่องทางติดต่อ",   ai:true},
    ],
  },
  { id:3,  icon:"🏪", label:"เปิด TikTok Shop",
    name:"สมัครเปิด TikTok Shop Seller", desc:"เปิดร้านค้าอย่างเป็นทางการ",
    steps:[
      {n:11, t:"ไปที่ seller-th.tiktok.com",    d:"หรือจากแอป TikTok → Shop"},
      {n:12, t:"กด 'สมัครเป็นผู้ขาย'",          d:"บุคคลธรรมดา หรือ นิติบุคคล"},
      {n:13, t:"กรอกข้อมูลธุรกิจ",              d:"ชื่อร้าน/ที่อยู่/เบอร์/อีเมล",     ai:true},
      {n:14, t:"อัปโหลดบัตรปชช./ทะเบียนพาณิชย์",d:""},
      {n:15, t:"ถ่าย Selfie คู่บัตรปชช.",       d:"ยืนยันตัวตน"},
      {n:16, t:"รอ TikTok Shop Approve 1–3 วัน",d:""},
      {n:17, t:"ได้รับ Seller Account",          d:"เข้า TikTok Seller Center"},
    ],
  },
  { id:4,  icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้าและบัญชีธนาคาร", desc:"พร้อมรับเงินเข้าธนาคารโดยตรง",
    steps:[
      {n:18, t:"ตั้งค่าร้านค้า",                d:"ชื่อร้าน/โลโก้/คำอธิบาย",          ai:true},
      {n:19, t:"เขียน Shop Description",        d:"ขายอะไร จุดเด่น นโยบายร้าน",       ai:true},
      {n:20, t:"เพิ่มบัญชีธนาคารไทย",          d:"ชื่อ/เลขบัญชี/ธนาคาร"},
      {n:21, t:"ยืนยันบัญชีธนาคาร",            d:"กับ TikTok Shop"},
      {n:22, t:"ตั้งค่า TikTok Shop Wallet",   d:""},
      {n:23, t:"ตั้งค่า Chat Auto Reply",       d:"ข้อความนอกเวลาทำการ",              ai:true},
    ],
  },
  { id:5,  icon:"🚚", label:"ตั้งค่าจัดส่ง",
    name:"ตั้งค่าการจัดส่ง", desc:"เลือกขนส่งและตั้งค่าค่าส่ง",
    steps:[
      {n:24, t:"Seller Center → การจัดส่ง",    d:"เลือกบริษัทขนส่ง"},
      {n:25, t:"เลือก Flash/J&T/Kerry/ไปรษณีย์/Shopee",d:""},
      {n:26, t:"ตั้ง Warehouse/Pickup Address", d:""},
      {n:27, t:"ตั้งค่าน้ำหนักและขนาด Default",d:""},
      {n:28, t:"ตั้ง Free Shipping Threshold",  d:"ฟรีค่าส่งเมื่อซื้อครบ X บาท"},
    ],
  },
  { id:6,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียนชื่อ + รายละเอียดสินค้า",
    steps:[
      {n:29, t:"Seller Center → เพิ่มสินค้าใหม่",d:""},
      {n:30, t:"เลือกหมวดหมู่ให้ถูกต้อง",     d:"Category สำคัญมาก",                warn:true},
      {n:31, t:"ตั้งชื่อสินค้า",               d:"Keyword หลัก + จุดเด่น ≤255 ตัว",  ai:true},
      {n:32, t:"อัปโหลดรูปสินค้า",            d:"Main 1:1 + รายละเอียด 2–8 รูป"},
      {n:33, t:"อัปโหลดวิดีโอสินค้าสั้น",     d:"สำหรับโปรโมทสินค้า"},
      {n:34, t:"เขียนรายละเอียดสินค้า",        d:"วัสดุ/ขนาด/วิธีใช้/จุดเด่น",       ai:true},
      {n:35, t:"ตั้งราคาและโปรโมชั่น",        d:""},
      {n:36, t:"ตั้งสต็อก + Variation",        d:"สี/ขนาด/รุ่น (ถ้ามี)"},
      {n:37, t:"Submit รอ Approve 24 ชม.",     d:""},
    ],
  },
  { id:7,  icon:"🔗", label:"เชื่อม TikTok",
    name:"เชื่อม TikTok Shop กับ TikTok Account", desc:"Tag สินค้าในวิดีโอ กดซื้อได้เลย",
    steps:[
      {n:38, t:"เชื่อม Shop กับ TikTok Account", d:"Personal/Business Account"},
      {n:39, t:"Tag สินค้าจาก Shop ในวิดีโอ",  d:"ลูกค้ากดซื้อได้เลย"},
      {n:40, t:"ตั้งค่า Shop Tab ใน Profile",   d:"ให้ลูกค้าเข้าชมร้าน"},
      {n:41, t:"Pin สินค้าขายดีใน Shop Tab",   d:"โปรโมชั่นให้คนเห็นก่อน"},
    ],
  },
  { id:8,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Voucher", desc:"AI เขียน Voucher + Campaign ให้",
    steps:[
      {n:42, t:"Seller Center → การตลาด",      d:"สร้างโปรโมชั่น"},
      {n:43, t:"สร้าง Voucher ส่วนลด",         d:"% หรือลดราคา หรือฟรีค่าส่ง",       ai:true},
      {n:44, t:"ตั้ง Flash Sale",               d:"โปรลดราคาจำกัดเวลา"},
      {n:45, t:"เข้าร่วม TikTok Campaign",     d:"9.9/10.10/11.11/12.12/Payday"},
      {n:46, t:"ตั้ง Bundle Deal",             d:"ซื้อหลายชิ้นได้ราคาถูก"},
      {n:47, t:"ใช้ TikTok Coins Cashback",    d:"สร้าง Loyalty กับลูกค้า"},
    ],
  },
  { id:9,  icon:"🎬", label:"Content+Live",
    name:"สร้าง Content วิดีโอและ Live ขาย", desc:"AI เขียน Script + Hook + Live Script",
    steps:[
      {n:48, t:"ถ่ายและอัปโหลดวิดีโอสินค้า",  d:"Hook ดึงใจใน 3 วิแรก",             ai:true},
      {n:49, t:"Tag สินค้าในวิดีโอ",          d:"ลูกค้ากดซื้อได้เลย"},
      {n:50, t:"ใส่ Hashtag Trending + สินค้า",d:"",                                 ai:true},
      {n:51, t:"เปิด TikTok Live",             d:"ตั้งชื่อ Live บอกสินค้าและโปร",    ai:true},
      {n:52, t:"เพิ่มสินค้าเข้า Live Cart",   d:"ก่อน Live"},
      {n:53, t:"Live 1+ ชม. ตอบ Comment",     d:"Pin สินค้าตลอด"},
      {n:54, t:"สรุปยอดขายหลัง Live",          d:"Analytics Dashboard"},
    ],
  },
  { id:10, icon:"📢", label:"Ads+Affiliate",
    name:"ใช้ TikTok Ads และ Affiliate", desc:"ขยาย Reach ด้วยโฆษณาและ Creator",
    steps:[
      {n:55, t:"Seller Center → TikTok Ads",  d:"Product Shopping Ads",             ai:true},
      {n:56, t:"เลือกสินค้า + Target",        d:"Audience",                         ai:true},
      {n:57, t:"ตั้งงบโฆษณาต่อวัน",          d:"Bid per Click / CPM"},
      {n:58, t:"เปิด TikTok Affiliate",       d:"ให้ Creator โปรโมทสินค้า"},
      {n:59, t:"กำหนด Commission Rate",       d:"ให้ Creator ที่ช่วยขาย"},
    ],
  },
  { id:11, icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้ออย่างรวดเร็ว",
    steps:[
      {n:60, t:"รับ Notification ออร์เดอร์",  d:"TikTok Seller App"},
      {n:61, t:"ตรวจสอบรายละเอียด",          d:"สินค้า/จำนวน/ที่อยู่/ช่องทางชำระ"},
      {n:62, t:"ยืนยันออร์เดอร์ภายใน 2 วัน", d:"",                                  warn:true},
      {n:63, t:"แพ็คสินค้าตาม Standard",     d:"TikTok Shop มีมาตรฐาน"},
      {n:64, t:"พิมพ์ใบปะหน้าพัสดุ",         d:"จาก Seller Center"},
      {n:65, t:"ส่งพัสดุภายในเวลากำหนด",     d:"",                                  warn:true},
    ],
  },
  { id:12, icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"TikTok Pay Escrow → Wallet → ธนาคาร",
    steps:[
      {n:66, t:"ลูกค้าชำระ TikTok Pay/บัตร", d:"หรือ PromptPay/เคาน์เตอร์"},
      {n:67, t:"เงินเข้า TikTok Escrow",      d:"รอ Release หลังรับสินค้า",          warn:true},
      {n:68, t:"เงิน Release เข้า Wallet",    d:"อัตโนมัติ"},
      {n:69, t:"โอนเงิน Wallet → ธนาคาร",   d:""},
      {n:70, t:"รับเงินเข้าบัญชี 1–3 วัน",  d:""},
    ],
  },
  { id:13, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและ Analytics", desc:"วิเคราะห์และปรับกลยุทธ์ต่อเนื่อง",
    steps:[
      {n:71, t:"ติดตามสถานะพัสดุ",           d:"Seller Center"},
      {n:72, t:"จัดการ Return / Refund",      d:"ถ้าลูกค้าร้องเรียน"},
      {n:73, t:"ตอบรีวิวลูกค้าทุกรายการ",   d:"รีวิวดี = อันดับขึ้น",              ai:true},
      {n:74, t:"วิเคราะห์ TikTok Analytics", d:"GMV/Orders/Conversion/Traffic",    ai:true},
      {n:75, t:"ปรับกลยุทธ์",               d:"วิดีโอ Conversion สูง → ทำเพิ่ม",  ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#fe2c55",
  redBg:"rgba(254,44,85,0.11)",redBorder:"rgba(254,44,85,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function TikTokShopOnboarding({ onComplete }) {
  const [part,setPart]=useState(0);
  const [checked,setChecked]=useState({});
  const p=PARTS[part];
  const isLast=part===PARTS.length-1;
  const total=PARTS.reduce((a,pt)=>a+pt.steps.length,0);
  const done=Object.values(checked).filter(Boolean).length;
  const pDone=p.steps.filter(s=>checked[s.n]).length;
  const pct=Math.round((done/total)*100);
  const toggle=n=>setChecked(prev=>({...prev,[n]:!prev[n]}));

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Sarabun',sans-serif",padding:"24px 16px"}}>
      <div style={{maxWidth:580,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Kanit',sans-serif",fontWeight:700,fontSize:17,color:C.green}}>OpenThai AI</span>
            <span style={{fontSize:12,color:C.muted}}>× TikTok Shop</span>
          </div>
          <span style={{fontSize:12,color:C.red,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.red,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(254,44,85,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(254,44,85,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.redBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.red,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.redBg,color:C.red,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(254,44,85,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(254,44,85,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(254,44,85,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Kanit',sans-serif",fontSize:13.5,fontWeight:600,color:checked[s.n]?"rgba(255,255,255,0.35)":C.text,textDecoration:checked[s.n]?"line-through":"none",margin:"0 0 3px"}}>{s.t}</p>
                <p style={{fontSize:11.5,color:C.muted,margin:0,lineHeight:1.5}}>{s.d}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {s.ai&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:"rgba(29,158,117,0.12)",color:C.green,fontWeight:600}}>🤖 OpenThai AI ช่วยได้</span>}
                  {s.warn&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:C.amber,color:C.amberText,fontWeight:600}}>⚠️ ข้อควรรู้</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9}}>
          {part>0&&<button onClick={()=>setPart(i=>i-1)} style={{flex:1,padding:13,borderRadius:12,cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontFamily:"'Kanit',sans-serif",fontSize:14,fontWeight:600}}>← ย้อนกลับ</button>}
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.red,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
