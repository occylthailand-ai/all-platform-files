/**
 * ShopeeOnboarding.jsx
 * Wizard พา Seller ตั้งค่า Shopee TH ตั้งแต่สมัครจนรับเงิน
 * 69 ขั้นตอน ใน 11 ส่วน — E-commerce อันดับ 1 ไทย 20M+ ผู้ใช้
 *
 * วิธีใช้:
 *   import ShopeeOnboarding from './ShopeeOnboarding'
 *   <ShopeeOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Shopee", desc:"เริ่มต้นสร้าง Shopee Account",
    steps:[
      {n:1, t:"โหลดแอป Shopee",               d:"Play Store / App Store หรือ shopee.co.th"},
      {n:2, t:"กด 'สมัคร' + เบอร์มือถือไทย", d:"ใส่เบอร์สำหรับสมัคร"},
      {n:3, t:"ยืนยัน OTP",                   d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชีและรหัสผ่าน",    d:""},
      {n:5, t:"ใส่รูปโปรไฟล์",               d:""},
      {n:6, t:"ยืนยันอีเมล",                  d:"แนะนำเพื่อใช้ฟีเจอร์ครบ"},
      {n:7, t:"เปิด Notification",             d:"รับแจ้งเตือนออร์เดอร์"},
    ],
  },
  { id:2,  icon:"🏪", label:"เปิดร้านค้า",
    name:"เปิดร้านค้า Shopee Seller", desc:"ตั้งค่าร้านค้าให้พร้อมขาย",
    steps:[
      {n:8,  t:"ไปที่ seller.shopee.co.th",    d:"กด 'เริ่มขายเลย'"},
      {n:9,  t:"ใส่ชื่อร้านค้า",              d:"เปลี่ยนได้ 1 ครั้ง ตั้งให้ดีที่สุด",  warn:true},
      {n:10, t:"เลือกหมวดหมู่สินค้าหลัก",    d:"ของร้านค้า"},
      {n:11, t:"ใส่รูปโปรไฟล์ร้านและรูปปก",  d:""},
      {n:12, t:"เขียน Shop Description",       d:"ขายอะไร จุดเด่น นโยบายร้าน",       ai:true},
      {n:13, t:"ตั้งค่าวันและเวลาเปิดร้าน",   d:"Operating Hours"},
      {n:14, t:"ตั้งค่า Chat Auto Reply",      d:"ข้อความนอกเวลาทำการ",              ai:true},
    ],
  },
  { id:3,  icon:"✅", label:"ยืนยันตัวตน",
    name:"ยืนยันตัวตนและสมัคร Badge", desc:"Preferred Seller / Shopee Mall",
    steps:[
      {n:15, t:"Seller Centre → ยืนยันตัวตน", d:"บัญชีของฉัน"},
      {n:16, t:"อัปโหลดบัตรปชช./ทะเบียนพาณิชย์",d:"สำหรับนิติบุคคล"},
      {n:17, t:"รอ Shopee ยืนยัน 1–3 วัน",   d:""},
      {n:18, t:"สมัคร Shopee Preferred Seller",d:"ถ้ามีคุณสมบัติ"},
      {n:19, t:"สมัคร Shopee Mall",           d:"สำหรับแบรนด์ต้องการ Badge"},
      {n:20, t:"ได้รับ Badge",                 d:"เพิ่มความน่าเชื่อถือ"},
    ],
  },
  { id:4,  icon:"💳", label:"ตั้งค่าการเงิน",
    name:"ตั้งค่าการเงินและบัญชีธนาคาร", desc:"รับเงินเข้าธนาคารโดยตรง",
    steps:[
      {n:21, t:"Seller Centre → การเงิน",      d:"บัญชีธนาคาร"},
      {n:22, t:"เพิ่มบัญชีธนาคาร",            d:"กสิกร/SCB/กรุงไทย ฯลฯ"},
      {n:23, t:"ยืนยันบัญชีธนาคาร",           d:"การโอนทดสอบ"},
      {n:24, t:"ตั้งค่า Shopee Wallet",        d:"กระเป๋าเงิน Shopee"},
      {n:25, t:"เปิดใช้งาน ShopeePay",        d:"รับ-จ่ายเงิน"},
    ],
  },
  { id:5,  icon:"🚚", label:"ตั้งค่าจัดส่ง",
    name:"ตั้งค่าการจัดส่ง (Shipping)", desc:"เลือกขนส่งและตั้งค่าค่าส่ง",
    steps:[
      {n:26, t:"Seller Centre → การจัดส่ง",   d:"เลือกบริษัทขนส่ง"},
      {n:27, t:"เปิดใช้ Kerry/Flash/J&T/ไปรษณีย์/Shopee",d:""},
      {n:28, t:"ตั้งค่าน้ำหนักและขนาดพัสดุ", d:""},
      {n:29, t:"ตั้งค่าค่าจัดส่ง",            d:"ฟรีค่าส่ง หรือผู้ซื้อจ่ายเอง"},
      {n:30, t:"ตั้ง Pickup Address",          d:"จุดรับพัสดุ"},
      {n:31, t:"ตั้ง Free Shipping Threshold", d:"ฟรีค่าส่งเมื่อซื้อครบ X บาท"},
    ],
  },
  { id:6,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียนชื่อ + รายละเอียดสินค้า",
    steps:[
      {n:32, t:"Seller Centre → เพิ่มสินค้าใหม่",d:"สินค้าของฉัน"},
      {n:33, t:"เลือกหมวดหมู่ให้ถูกต้อง",    d:"Category สำคัญมาก",                warn:true},
      {n:34, t:"ตั้งชื่อสินค้า",              d:"Keyword หลัก + จุดเด่น ≤120 ตัว",   ai:true},
      {n:35, t:"อัปโหลดรูปสินค้า",           d:"Main 1:1 + รายละเอียด 2–8 รูป"},
      {n:36, t:"อัปโหลดวิดีโอสินค้า",        d:"10 วิ–1 นาที (ถ้ามี)"},
      {n:37, t:"เขียนรายละเอียดสินค้า",       d:"วัสดุ/ขนาด/วิธีใช้/ข้อควรระวัง",    ai:true},
      {n:38, t:"ตั้งราคาและราคาพิเศษ",        d:"ราคาลด"},
      {n:39, t:"ตั้งสต็อกสินค้า",            d:""},
      {n:40, t:"เพิ่ม Variation สินค้า",      d:"สี/ขนาด/รุ่น (ถ้ามี)"},
      {n:41, t:"ตั้ง Condition",              d:"ใหม่ หรือ มือสอง"},
    ],
  },
  { id:7,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Voucher", desc:"AI เขียน Voucher + Campaign ให้",
    steps:[
      {n:42, t:"Seller Centre → การตลาด",     d:"โปรโมชั่นของฉัน"},
      {n:43, t:"สร้าง Voucher ส่วนลด",        d:"% หรือลดราคาคงที่",               ai:true},
      {n:44, t:"ตั้ง Flash Sale",              d:"โปรลดราคาจำกัดเวลา"},
      {n:45, t:"เข้าร่วม Shopee Campaign",    d:"9.9/10.10/11.11/12.12"},
      {n:46, t:"ตั้ง Bundle Deal",            d:"ซื้อรวมกันได้ราคาถูก"},
      {n:47, t:"ตั้ง Add-on Deal",            d:"สินค้าเสริมราคาพิเศษ"},
      {n:48, t:"ตั้ง Coins Cashback",         d:"ให้ Shopee Coins กับลูกค้า"},
    ],
  },
  { id:8,  icon:"📢", label:"Shopee Ads",
    name:"ใช้ Shopee Ads โปรโมทสินค้า", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:49, t:"Seller Centre → Shopee Ads",  d:"สร้างโฆษณา"},
      {n:50, t:"เลือกประเภท Ads",             d:"Search Ads หรือ Discovery Ads",    ai:true},
      {n:51, t:"เลือกสินค้า + ตั้ง Keyword", d:"",                                 ai:true},
      {n:52, t:"ตั้งงบโฆษณาต่อวัน",          d:"Daily Budget + Bid per Click"},
      {n:53, t:"เผยแพร่ + ติดตาม ROAS/CTR",  d:"Dashboard"},
    ],
  },
  { id:9,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้ออย่างรวดเร็ว",
    steps:[
      {n:54, t:"รับ Notification ออร์เดอร์",  d:"Shopee Seller App"},
      {n:55, t:"ตรวจสอบรายละเอียดออร์เดอร์", d:"สินค้า/จำนวน/ที่อยู่/ช่องทางชำระ"},
      {n:56, t:"ยืนยันออร์เดอร์ภายใน 2 วัน", d:"มีบทลงโทษถ้าไม่ยืนยัน",           warn:true},
      {n:57, t:"แพ็คสินค้าตาม Standard",     d:"Shopee มีมาตรฐานบรรจุภัณฑ์"},
      {n:58, t:"พิมพ์ใบปะหน้าพัสดุ",         d:"จาก Seller Centre"},
      {n:59, t:"ส่งพัสดุภายในเวลาที่กำหนด",  d:"",                                 warn:true},
    ],
  },
  { id:10, icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"เงินผ่าน Escrow → Wallet → ธนาคาร",
    steps:[
      {n:60, t:"ลูกค้าชำระผ่าน ShopeePay/บัตร",d:"หรือ Counter/PromptPay"},
      {n:61, t:"เงินเข้า Shopee Escrow",      d:"รอ Release หลังลูกค้ารับสินค้า",   warn:true},
      {n:62, t:"เงิน Release เข้า Shopee Wallet",d:"อัตโนมัติหลัง 3 วัน"},
      {n:63, t:"กด 'โอนเงิน' จาก Wallet",    d:"ไปบัญชีธนาคาร"},
      {n:64, t:"รับเงินเข้าธนาคาร",           d:"ภายใน 1–3 วันทำการ"},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและรีวิว", desc:"รีวิวดี = อันดับขึ้น = ขายดีขึ้น",
    steps:[
      {n:65, t:"ติดตามสถานะพัสดุ",            d:"Seller Centre"},
      {n:66, t:"จัดการ Return / Refund",       d:"ถ้าลูกค้าร้องเรียน"},
      {n:67, t:"ตอบรีวิวลูกค้าทุกรายการ",    d:"รีวิวดี = อันดับขึ้น",             ai:true},
      {n:68, t:"ขอรีวิวจากลูกค้า",            d:"ผ่าน Shopee Chat หลังรับสินค้า",  ai:true},
      {n:69, t:"วิเคราะห์ข้อมูลร้านค้า",      d:"ยอดขาย/Conversion/สินค้าขายดี",  ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",orange:"#ee4d2d",
  orangeBg:"rgba(238,77,45,0.11)",orangeBorder:"rgba(238,77,45,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function ShopeeOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Shopee TH</span>
          </div>
          <span style={{fontSize:12,color:C.orange,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.orange,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.orange:allDone?"rgba(238,77,45,0.3)":C.border}`,background:i===part?C.orangeBg:allDone?"rgba(238,77,45,0.07)":"transparent",color:i===part?C.orange:allDone?C.orange:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.orangeBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.orange,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.orangeBg,color:C.orange,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(238,77,45,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(238,77,45,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.orange:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(238,77,45,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.orange,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.orange,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
