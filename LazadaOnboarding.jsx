/**
 * LazadaOnboarding.jsx
 * Wizard พา Seller ตั้งค่า Lazada TH ตั้งแต่สมัครจนรับเงิน
 * 67 ขั้นตอน ใน 11 ส่วน — E-commerce อันดับ 2 ไทย 10M+ ในเครือ Alibaba
 *
 * วิธีใช้:
 *   import LazadaOnboarding from './LazadaOnboarding'
 *   <LazadaOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Lazada", desc:"เริ่มต้นสร้าง Lazada Account",
    steps:[
      {n:1, t:"โหลดแอป Lazada",                d:"Play Store/App Store หรือ lazada.co.th"},
      {n:2, t:"กด 'ลงทะเบียน' + เบอร์/FB/Google",d:"สมัครด้วยเบอร์หรือ Social"},
      {n:3, t:"ยืนยัน OTP",                    d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชีและรหัสผ่าน",     d:""},
      {n:5, t:"ยืนยันอีเมล",                   d:"สำหรับรับแจ้งเตือนสำคัญ"},
      {n:6, t:"เปิด Notification",              d:"รับแจ้งเตือนออร์เดอร์และโปรโมชั่น"},
    ],
  },
  { id:2,  icon:"🏪", label:"เปิดร้านค้า",
    name:"สมัครเปิดร้าน Lazada Seller", desc:"เปิดร้านค้าอย่างเป็นทางการ",
    steps:[
      {n:7,  t:"ไปที่ seller.lazada.co.th",    d:"กด 'เริ่มต้นขายเลย'"},
      {n:8,  t:"เลือกประเภทบัญชี",             d:"บุคคลธรรมดา หรือ นิติบุคคล"},
      {n:9,  t:"ใส่ชื่อร้านค้า",               d:"สำคัญมาก เปลี่ยนได้จำกัด",          warn:true},
      {n:10, t:"กรอกข้อมูลธุรกิจ",             d:"ที่อยู่/เบอร์/อีเมลร้านค้า"},
      {n:11, t:"อัปโหลดบัตรปชช./ทะเบียนบริษัท",d:""},
      {n:12, t:"รอ Lazada Approve 1–3 วัน",    d:""},
      {n:13, t:"ได้รับ Seller Account",         d:"เข้า Seller Center"},
    ],
  },
  { id:3,  icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้าและยืนยันตัวตน", desc:"โปรไฟล์ดี ลูกค้าเชื่อถือมากขึ้น",
    steps:[
      {n:14, t:"ตั้งค่าโปรไฟล์ร้านค้า",        d:"โลโก้/รูปปก/คำอธิบาย",              ai:true},
      {n:15, t:"เขียน Shop Description",        d:"ขายอะไร จุดเด่น นโยบายร้าน",       ai:true},
      {n:16, t:"ยืนยันตัวตน KYC",              d:"สำหรับ LazMall/Official Store"},
      {n:17, t:"สมัคร LazMall",               d:"Badge ทองคำสำหรับแบรนด์"},
      {n:18, t:"ตั้งค่า Chat Auto Reply",       d:"ข้อความนอกเวลาทำการ",              ai:true},
      {n:19, t:"ตอบ Chat ภายใน 2 ชั่วโมง",    d:"Response Rate ส่งผลต่ออันดับ",      warn:true},
    ],
  },
  { id:4,  icon:"💳", label:"ตั้งค่าการเงิน",
    name:"ตั้งค่าการเงินและบัญชีธนาคาร", desc:"รับเงินเข้าธนาคารโดยตรง",
    steps:[
      {n:20, t:"Seller Center → การเงิน",       d:"เพิ่มบัญชีธนาคาร"},
      {n:21, t:"ใส่ชื่อ/เลขบัญชี/ธนาคาร",     d:"กสิกร/SCB/กรุงไทย ฯลฯ"},
      {n:22, t:"ยืนยันบัญชีธนาคาร",            d:"การโอนทดสอบ"},
      {n:23, t:"ตั้งรอบการจ่ายเงิน",           d:"รายสัปดาห์/สองสัปดาห์"},
      {n:24, t:"เปิดใช้งาน Lazada Wallet",     d:""},
    ],
  },
  { id:5,  icon:"🚚", label:"ตั้งค่าจัดส่ง",
    name:"ตั้งค่าการจัดส่ง", desc:"เลือกขนส่งและตั้งค่า",
    steps:[
      {n:25, t:"Seller Center → การจัดส่ง",    d:"เลือกช่องทาง"},
      {n:26, t:"เลือก LEX/Kerry/Flash/J&T/ไปรษณีย์",d:""},
      {n:27, t:"ตั้ง Pickup/Drop-off Address",  d:"สำหรับพัสดุ"},
      {n:28, t:"ตั้งค่าน้ำหนักและขนาด",       d:"Default"},
      {n:29, t:"สมัคร Fulfilled by Lazada",    d:"FBL ส่งสินค้าเข้า Warehouse"},
    ],
  },
  { id:6,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียนชื่อ + รายละเอียดสินค้า",
    steps:[
      {n:30, t:"Seller Center → เพิ่มสินค้าใหม่",d:""},
      {n:31, t:"เลือกหมวดหมู่ให้ถูกต้อง",     d:"Category สำคัญมาก",                warn:true},
      {n:32, t:"ตั้งชื่อสินค้า",               d:"Brand+ชื่อ+จุดเด่น ≤255 ตัว",      ai:true},
      {n:33, t:"อัปโหลดรูปสินค้า",            d:"Main พื้นขาว + รายละเอียด 2–8 รูป"},
      {n:34, t:"อัปโหลดวิดีโอสินค้า",         d:"10–60 วิ (ถ้ามี)"},
      {n:35, t:"เขียนรายละเอียดสินค้า",        d:"วัสดุ/ขนาด/วิธีใช้/Highlight",     ai:true},
      {n:36, t:"ตั้งราคาปกติและโปรโมชั่น",    d:""},
      {n:37, t:"ตั้งสต็อกสินค้า",             d:""},
      {n:38, t:"เพิ่ม Variation",              d:"สี/ขนาด/รุ่น (ถ้ามี)"},
      {n:39, t:"กำหนด SKU Code",              d:"สำหรับจัดการสต็อก"},
    ],
  },
  { id:7,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Voucher", desc:"AI เขียน Voucher + Campaign ให้",
    steps:[
      {n:40, t:"Seller Center → การตลาด",      d:"โปรโมชั่น"},
      {n:41, t:"สร้าง Voucher ส่วนลด",         d:"% หรือลดราคา หรือฟรีค่าส่ง",       ai:true},
      {n:42, t:"ตั้ง Flash Sale",               d:"โปรลดราคาจำกัดเวลา"},
      {n:43, t:"เข้าร่วม Lazada Campaign",     d:"3.3/4.4/6.6/9.9/11.11/12.12"},
      {n:44, t:"ตั้ง Bundle Deal",             d:"ซื้อหลายชิ้นได้ราคาถูก"},
      {n:45, t:"ตั้ง Flexi Combo",            d:"Variant ราคาพิเศษ"},
      {n:46, t:"ใช้ LazCoins",               d:"Coins Cashback กับลูกค้า"},
    ],
  },
  { id:8,  icon:"📢", label:"Lazada Ads",
    name:"ใช้ Lazada Ads โปรโมทสินค้า", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:47, t:"Seller Center → Lazada Ads",   d:"สร้างแคมเปญ"},
      {n:48, t:"เลือกประเภท Ads",              d:"Sponsored Products หรือ Display",  ai:true},
      {n:49, t:"เลือกสินค้า + ตั้ง Keyword",  d:"",                                 ai:true},
      {n:50, t:"ตั้งงบโฆษณาต่อวัน",           d:"Daily Budget + Bid per Click"},
      {n:51, t:"เผยแพร่ + ติดตาม ROAS/CTR",   d:"Dashboard"},
    ],
  },
  { id:9,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้ออย่างรวดเร็ว",
    steps:[
      {n:52, t:"รับ Notification ออร์เดอร์",   d:"Lazada Seller App"},
      {n:53, t:"ตรวจสอบรายละเอียด",           d:"สินค้า/จำนวน/ที่อยู่/วิธีชำระ"},
      {n:54, t:"พิมพ์ใบปะหน้าพัสดุ",          d:"ภายใน 48 ชั่วโมง",                warn:true},
      {n:55, t:"แพ็คสินค้าตาม Standard",      d:"Lazada มีมาตรฐานบรรจุภัณฑ์"},
      {n:56, t:"ส่งพัสดุกับขนส่ง",            d:"หรือรอ Lazada Express รับ"},
      {n:57, t:"กด 'จัดส่งแล้ว'",             d:"ใน Seller Center"},
    ],
  },
  { id:10, icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"LazadaPay Escrow → Wallet → ธนาคาร",
    steps:[
      {n:58, t:"ลูกค้าชำระ LazadaPay/บัตร",   d:"หรือ Counter/PromptPay/ผ่อน"},
      {n:59, t:"เงินเข้า Lazada Escrow",       d:"รอ Release หลังรับสินค้า 7 วัน",  warn:true},
      {n:60, t:"เงิน Release เข้า Wallet",     d:"อัตโนมัติ"},
      {n:61, t:"กด 'โอนเงิน' จาก Wallet",     d:"ไปบัญชีธนาคาร"},
      {n:62, t:"รับเงินตามรอบ",               d:"รายสัปดาห์/สองสัปดาห์"},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและรีวิว", desc:"Rating ดี = อันดับสินค้าขึ้น",
    steps:[
      {n:63, t:"ติดตามสถานะพัสดุ",             d:"Seller Center"},
      {n:64, t:"จัดการ Return/Refund",          d:"ภายใน 7 วัน"},
      {n:65, t:"ตอบรีวิวลูกค้าทุกรายการ",     d:"Rating ส่งผลต่ออันดับ",            ai:true},
      {n:66, t:"ขอรีวิวผ่าน Lazada Chat",      d:"หลังลูกค้ารับสินค้า",             ai:true},
      {n:67, t:"วิเคราะห์ข้อมูลร้านค้า",       d:"ยอดขาย/Conversion/สินค้าขายดี",  ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#f9093e",
  redBg:"rgba(249,9,62,0.11)",redBorder:"rgba(249,9,62,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function LazadaOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Lazada TH</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(249,9,62,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(249,9,62,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(249,9,62,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(249,9,62,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(249,9,62,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
