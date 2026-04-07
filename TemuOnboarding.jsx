/**
 * TemuOnboarding.jsx
 * Wizard พา Seller ตั้งค่า TEMU ตั้งแต่สมัครจนรับเงิน
 * 50 ขั้นตอน ใน 9 ส่วน — Cross-border 50+ ประเทศ สินค้าไทยสู่ตลาดโลก
 *
 * วิธีใช้:
 *   import TemuOnboarding from './TemuOnboarding'
 *   <TemuOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1, icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและสินค้าให้พร้อม",
    steps:[
      {n:1, t:"เตรียมทะเบียนพาณิชย์ไทย",       d:"ภ.พ.20 หรือทะเบียนบริษัท",           warn:true},
      {n:2, t:"เตรียมบัตรปชช. หรือ Passport",    d:"สำหรับยืนยันตัวตน"},
      {n:3, t:"เตรียมบัญชีธนาคาร",              d:"รองรับ Payoneer / Wire Transfer",    warn:true},
      {n:4, t:"เตรียมสินค้าราคาแข่งขันได้",     d:"TEMU เน้นสินค้าราคาต่ำมาก",         warn:true},
      {n:5, t:"เลือกหมวดสินค้า",                d:"แฟชั่น/ของใช้บ้าน/ของเล่น/อิเล็กฯ"},
    ],
  },
  { id:2, icon:"🏪", label:"เปิดร้านค้า",
    name:"สมัครและเปิดร้าน TEMU Seller", desc:"เปิดร้านค้าบน TEMU Global",
    steps:[
      {n:6,  t:"ไปที่ seller.temu.com",           d:"กด 'Register as Seller'"},
      {n:7,  t:"เลือก Thailand → กรอกอีเมล",     d:"ตั้งรหัสผ่าน"},
      {n:8,  t:"ยืนยันอีเมล",                    d:"รับ OTP ทางอีเมล"},
      {n:9,  t:"กรอกข้อมูลธุรกิจ",              d:"ชื่อบริษัท/ที่อยู่/เบอร์"},
      {n:10, t:"อัปโหลดเอกสาร",                 d:"ทะเบียนพาณิชย์+บัตรปชช./Passport"},
      {n:11, t:"รอ TEMU Approve 3–7 วัน",        d:""},
      {n:12, t:"ได้รับ Seller Account",           d:"เข้า TEMU Seller Center"},
    ],
  },
  { id:3, icon:"💳", label:"ตั้งค่าการเงิน",
    name:"ตั้งค่าบัญชีและการเงิน", desc:"รับเงินผ่าน Payoneer → ธนาคารไทย",
    steps:[
      {n:13, t:"Account Settings → ข้อมูลธุรกิจ",d:"กรอกให้ครบ"},
      {n:14, t:"สมัคร Payoneer",                 d:"แนะนำ — รับเงินสะดวกที่สุด",         warn:true},
      {n:15, t:"เชื่อม Payoneer กับ TEMU",       d:""},
      {n:16, t:"ยืนยันข้อมูลภาษี (Tax Info)",   d:"ตามที่ TEMU กำหนด"},
      {n:17, t:"ตั้งค่าสกุลเงิน",               d:"USD / EUR ตามตลาดที่ขาย"},
    ],
  },
  { id:4, icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียน Title + Description อังกฤษ",
    steps:[
      {n:18, t:"Products → Add New Product",      d:""},
      {n:19, t:"เลือกหมวดหมู่ให้ถูกต้อง",       d:"Category สำคัญมาก",                  warn:true},
      {n:20, t:"ตั้งชื่อสินค้าภาษาอังกฤษ",      d:"Keyword หลัก + จุดเด่น",             ai:true},
      {n:21, t:"อัปโหลดรูปสินค้า",              d:"Main พื้นขาว + รายละเอียด 3–8 รูป"},
      {n:22, t:"เขียนรายละเอียดสินค้าอังกฤษ",   d:"วัสดุ/ขนาด/วิธีใช้/จุดเด่น",         ai:true},
      {n:23, t:"ตั้งราคาสินค้า",                d:"ต้องต่ำกว่าตลาด — TEMU กำหนด",       warn:true},
      {n:24, t:"ตั้งสต็อก + SKU Variant",       d:"สี/ขนาด/รุ่น"},
      {n:25, t:"กรอก HS Code",                  d:"สำหรับ Cross-border Customs"},
      {n:26, t:"Submit รอ Approve 24–72 ชม.",   d:""},
    ],
  },
  { id:5, icon:"🚚", label:"ส่งเข้า Warehouse",
    name:"ส่งสินค้าเข้า TEMU Warehouse", desc:"TEMU จัดการ Logistics ให้ทั้งหมด",
    steps:[
      {n:27, t:"Logistics → Shipping Plan",       d:""},
      {n:28, t:"เลือกประเทศปลายทาง",             d:"USA / UK / EU / AU ฯลฯ"},
      {n:29, t:"TEMU จัดสรร Warehouse",          d:"มักอยู่จีนหรือ USA",                  warn:true},
      {n:30, t:"เตรียมสินค้าตาม TEMU Standard",  d:"บาร์โค้ด/Label ครบ"},
      {n:31, t:"ส่งสินค้าเข้า Warehouse",        d:"ผ่านขนส่งที่ TEMU แนะนำ"},
      {n:32, t:"TEMU รับสินค้า → Active",        d:"สินค้าขายได้ทั่วโลก"},
    ],
  },
  { id:6, icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่น", desc:"เข้าร่วม Campaign ระดับโลก",
    steps:[
      {n:33, t:"Promotions → สร้างโปรโมชั่น",   d:""},
      {n:34, t:"เข้าร่วม TEMU Flash/Daily Deal", d:"TEMU คัดเลือกสินค้า",               ai:true},
      {n:35, t:"ตั้ง Coupon / Bundle Deal",      d:""},
      {n:36, t:"เข้าร่วม TEMU Campaign",        d:"Black Friday/Cyber Monday/11.11"},
    ],
  },
  { id:7, icon:"🛎️", label:"จัดการออร์เดอร์",
    name:"การจัดการออร์เดอร์", desc:"TEMU จัดการ Fulfillment เองจาก Warehouse",
    steps:[
      {n:37, t:"รับ Notification ออร์เดอร์",     d:"Seller Center"},
      {n:38, t:"ตรวจสอบออร์เดอร์",              d:"TEMU จัดการ Fulfillment เอง"},
      {n:39, t:"ติดตามสถานะออร์เดอร์",          d:"Dashboard"},
      {n:40, t:"จัดการ Return / Refund",         d:"TEMU นโยบาย Customer-first",          warn:true},
      {n:41, t:"ตรวจสอบสต็อกใน Warehouse",      d:"Replenish เมื่อใกล้หมด"},
    ],
  },
  { id:8, icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"Escrow → Wallet → Payoneer → ธนาคารไทย",
    steps:[
      {n:42, t:"ลูกค้าชำระผ่าน TEMU Payment",   d:"บัตรเครดิต/PayPal/Apple Pay ฯลฯ"},
      {n:43, t:"เงินเข้า TEMU Escrow",           d:"รอ Release หลังลูกค้ารับสินค้า",     warn:true},
      {n:44, t:"เงิน Release เข้า TEMU Wallet",  d:"7–14 วันหลังยืนยันส่งสินค้า"},
      {n:45, t:"โอน TEMU Wallet → Payoneer",     d:""},
      {n:46, t:"โอน Payoneer → ธนาคารไทย",      d:"แลก USD → THB"},
    ],
  },
  { id:9, icon:"📊", label:"วิเคราะห์+ปรับ",
    name:"วิเคราะห์และปรับปรุง", desc:"Data-driven ขยายตลาดโลก",
    steps:[
      {n:47, t:"ติดตาม Seller Analytics",        d:"GMV/Orders/Conversion/Return Rate",  ai:true},
      {n:48, t:"ปรับราคาตาม TEMU Suggestion",   d:"ระบบแนะนำราคาที่เหมาะสม",           ai:true},
      {n:49, t:"เพิ่มสต็อกสินค้าขายดี",         d:"ใน Warehouse"},
      {n:50, t:"ขยาย Category และตลาดใหม่",     d:"เพิ่มประเทศ 50+ แห่ง",              ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",orange:"#ff6a00",
  orangeBg:"rgba(255,106,0,0.11)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function TemuOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× TEMU Global</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.orange:allDone?"rgba(255,106,0,0.3)":C.border}`,background:i===part?C.orangeBg:allDone?"rgba(255,106,0,0.07)":"transparent",color:i===part?C.orange:allDone?C.orange:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,106,0,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,106,0,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.orange:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,106,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.orange,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
