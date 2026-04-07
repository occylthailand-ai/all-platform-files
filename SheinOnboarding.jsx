/**
 * SheinOnboarding.jsx
 * Wizard พา Seller ตั้งค่า SHEIN Marketplace ตั้งแต่สมัครจนรับเงิน
 * 52 ขั้นตอน ใน 9 ส่วน — Fast Fashion 150M+ Users USA/EU/Brazil
 *
 * หมายเหตุ: SHEIN Marketplace เปิดใน USA/EU/Brazil แล้ว
 * ยังไม่เปิดอย่างเป็นทางการในไทย ณ ปัจจุบัน
 *
 * วิธีใช้:
 *   import SheinOnboarding from './SheinOnboarding'
 *   <SheinOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1, icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและสินค้าแฟชั่น",
    steps:[
      {n:1, t:"เตรียมทะเบียนพาณิชย์/บริษัท",   d:"หรือเอกสารธุรกิจ",                   warn:true},
      {n:2, t:"เตรียม Passport หรือบัตรปชช.",   d:"สำหรับยืนยันตัวตน"},
      {n:3, t:"เตรียมบัญชีรับเงิน",             d:"Payoneer / Wise แนะนำ",              warn:true},
      {n:4, t:"เตรียมสินค้าแฟชั่น Trend",       d:"SHEIN เน้น Fast Fashion ราคาย่อม",   warn:true},
      {n:5, t:"เลือกตลาดเป้าหมาย",              d:"USA / EU / Brazil",                  ai:true},
      {n:6, t:"ศึกษา SHEIN Trend",              d:"ดูสินค้าขายดีบน SHEIN",              ai:true},
    ],
  },
  { id:2, icon:"🏪", label:"สมัครและยืนยัน",
    name:"สมัครและยืนยันตัวตน SHEIN Seller", desc:"เปิดร้านค้าบน SHEIN Marketplace",
    steps:[
      {n:7,  t:"ไปที่ seller.shein.com",         d:"กด 'Become a Seller'"},
      {n:8,  t:"สร้างบัญชีอีเมลธุรกิจ",         d:"",                                   ai:true},
      {n:9,  t:"เลือกประเทศ: Thailand",          d:""},
      {n:10, t:"กรอกข้อมูลธุรกิจ",             d:"ชื่อร้าน/ที่อยู่/เบอร์/อีเมล",       ai:true},
      {n:11, t:"อัปโหลดเอกสารยืนยันตัวตน",     d:"Passport / บัตรปชช."},
      {n:12, t:"อัปโหลดเอกสารธุรกิจ",          d:"ทะเบียนพาณิชย์ / ทะเบียนบริษัท"},
      {n:13, t:"รอ SHEIN Approve 5–14 วัน",    d:"",                                    warn:true},
      {n:14, t:"ได้รับ Seller Account",          d:"เข้า SHEIN Seller Center"},
    ],
  },
  { id:3, icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้าและบัญชีการเงิน", desc:"พร้อมรับเงินผ่าน Payoneer",
    steps:[
      {n:15, t:"ตั้งค่าชื่อร้านและ Logo",       d:"",                                   ai:true},
      {n:16, t:"เขียน Shop Description",        d:"จุดเด่น/สินค้าหลัก/สไตล์แฟชั่น",   ai:true},
      {n:17, t:"เพิ่มบัญชีรับเงิน",            d:"เชื่อม Payoneer / Wise"},
      {n:18, t:"ตั้งค่า Return Policy",         d:"นโยบายคืนสินค้า"},
      {n:19, t:"ตั้งค่า Shipping Policy",       d:"เวลาจัดส่งและค่าส่ง"},
    ],
  },
  { id:4, icon:"👗", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียน Title + Description + Trend Tag",
    steps:[
      {n:20, t:"Seller Center → Add Product",   d:""},
      {n:21, t:"เลือกหมวดหมู่แฟชั่น",          d:"Women/Men/Kids/Accessories ฯลฯ",      warn:true},
      {n:22, t:"เขียน Product Title",           d:"Trend Keyword + Style + วัสดุ",      ai:true},
      {n:23, t:"อัปโหลดรูปสินค้า",             d:"พื้นขาว + Lifestyle 4–8 รูป"},
      {n:24, t:"เขียน Product Description",    d:"วัสดุ/ขนาด/Style/วิธีดูแล",          ai:true},
      {n:25, t:"ใส่ Trend Tags / Keywords",    d:"เกี่ยวกับสไตล์แฟชั่น",              ai:true},
      {n:26, t:"ตั้งราคา (USD)",              d:"แข่งขันได้กับ SHEIN Fast Fashion",    warn:true},
      {n:27, t:"ตั้งสต็อก + Size Variant",    d:"XS/S/M/L/XL/XXL"},
      {n:28, t:"ใส่ Size Chart",              d:"สำคัญมากสำหรับแฟชั่น",               warn:true},
      {n:29, t:"Submit รอ SHEIN Approve",     d:"1–3 วัน"},
    ],
  },
  { id:5, icon:"🚚", label:"ตั้งค่าจัดส่ง",
    name:"ตั้งค่าการจัดส่ง", desc:"เลือกขนส่งระหว่างประเทศ",
    steps:[
      {n:30, t:"เลือกวิธีจัดส่ง",             d:"SHEIN Logistics / EMS / DHL"},
      {n:31, t:"ตั้ง Processing Time",         d:"3–7 วัน"},
      {n:32, t:"ตั้งค่าค่าส่ง",              d:"ฟรีค่าส่ง (แนะนำ) หรือผู้ซื้อจ่าย"},
      {n:33, t:"ตั้ง Shipping Region",        d:"USA / EU / Brazil"},
      {n:34, t:"เตรียม Packaging Standard",   d:"ตาม SHEIN กำหนด"},
    ],
  },
  { id:6, icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Marketing", desc:"เข้าร่วม SHEIN Flash Sale และ Campaign",
    steps:[
      {n:35, t:"สร้าง Coupon ส่วนลด",         d:"% หรือลดราคาคงที่",                  ai:true},
      {n:36, t:"เข้าร่วม SHEIN Flash Sale",   d:"โปรลดราคาจำกัดเวลา"},
      {n:37, t:"เข้าร่วม SHEIN Campaign",     d:"Black Friday / Summer Sale ฯลฯ"},
      {n:38, t:"ใช้ SHEIN Affiliate",         d:"ให้ Influencer โปรโมทสินค้า",        ai:true},
      {n:39, t:"เชื่อม TikTok/Instagram",     d:"สร้าง Content แฟชั่น",               ai:true},
    ],
  },
  { id:7, icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้อแฟชั่นให้ทันเวลา",
    steps:[
      {n:40, t:"รับ Notification ออร์เดอร์",  d:"SHEIN Seller Center"},
      {n:41, t:"ตรวจสอบรายละเอียด",          d:"สินค้า/Size/สี/ที่อยู่/ชำระ"},
      {n:42, t:"ยืนยันออร์เดอร์ภายในเวลา",   d:"",                                    warn:true},
      {n:43, t:"แพ็คสินค้าตาม SHEIN Standard",d:""},
      {n:44, t:"ส่งพัสดุกับขนส่ง",           d:"EMS / DHL / SHEIN Logistics"},
      {n:45, t:"อัปโหลดเลข Tracking",         d:"ใน Seller Center",                   warn:true},
    ],
  },
  { id:8, icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"SHEIN Pay Escrow → Wallet → Payoneer → ธนาคารไทย",
    steps:[
      {n:46, t:"ลูกค้าชำระผ่าน SHEIN Payment", d:"บัตรเครดิต/PayPal/Apple Pay ฯลฯ"},
      {n:47, t:"เงินเข้า SHEIN Escrow",        d:"รอ Release หลังลูกค้ารับสินค้า",     warn:true},
      {n:48, t:"เงิน Release เข้า SHEIN Wallet",d:"14–21 วันหลังยืนยันส่ง"},
      {n:49, t:"โอนเงิน Wallet → Payoneer",   d:""},
      {n:50, t:"โอน Payoneer → ธนาคารไทย",   d:"แลก USD → THB"},
    ],
  },
  { id:9, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและ Analytics", desc:"รักษา Shop Score และต่อยอด",
    steps:[
      {n:51, t:"ติดตามสถานะพัสดุ",            d:"จนถึงมือลูกค้า"},
      {n:52, t:"จัดการ Return/Refund",         d:"SHEIN นโยบาย Customer-first",        warn:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",pink:"#e84485",
  pinkBg:"rgba(232,68,133,0.11)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function SheinOnboarding({ onComplete }) {
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
        {/* Notice Banner */}
        <div style={{background:"rgba(245,166,35,0.08)",border:"1px solid rgba(245,166,35,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:16,fontSize:11.5,color:"#f5a623",lineHeight:1.5}}>
          ⚠️ SHEIN Marketplace เปิดใน USA/EU/Brazil แล้ว — ยังไม่เปิดอย่างเป็นทางการในไทย ณ ปัจจุบัน
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Kanit',sans-serif",fontWeight:700,fontSize:17,color:C.green}}>OpenThai AI</span>
            <span style={{fontSize:12,color:C.muted}}>× SHEIN Marketplace</span>
          </div>
          <span style={{fontSize:12,color:C.pink,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.pink,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.pink:allDone?"rgba(232,68,133,0.3)":C.border}`,background:i===part?C.pinkBg:allDone?"rgba(232,68,133,0.07)":"transparent",color:i===part?C.pink:allDone?C.pink:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.pinkBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.pink,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.pinkBg,color:C.pink,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(232,68,133,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(232,68,133,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.pink:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.pink:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(232,68,133,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.pink,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.pink,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายแฟชั่นกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
