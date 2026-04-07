/**
 * AliExpressOnboarding.jsx
 * Wizard พา Seller ตั้งค่า AliExpress ตั้งแต่สมัครจนรับเงิน
 * 58 ขั้นตอน ใน 10 ส่วน — 200+ ประเทศ 150M+ ผู้ซื้อ
 *
 * วิธีใช้:
 *   import AliExpressOnboarding from './AliExpressOnboarding'
 *   <AliExpressOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและเลือกตลาดเป้าหมาย",
    steps:[
      {n:1, t:"เตรียมทะเบียนพาณิชย์ไทย",      d:"ภ.พ.20 หรือทะเบียนบริษัท",           warn:true},
      {n:2, t:"เตรียม Passport หรือบัตรปชช.",  d:"สำหรับยืนยันตัวตน"},
      {n:3, t:"เตรียมบัญชีรับเงิน",            d:"Payoneer หรือธนาคาร SWIFT",          warn:true},
      {n:4, t:"เตรียมสินค้ามีเอกลักษณ์",      d:"ไม่ควรแข่งราคากับจีน",               warn:true},
      {n:5, t:"เลือกตลาดเป้าหมาย",            d:"รัสเซีย/ยุโรป/ตะวันออกกลาง/ลาตินฯ", ai:true},
    ],
  },
  { id:2,  icon:"🏪", label:"สมัครและยืนยัน",
    name:"สมัครและยืนยันตัวตน AliExpress", desc:"เปิดร้านค้าบน AliExpress Global",
    steps:[
      {n:6,  t:"ไปที่ sell.aliexpress.com",     d:"กด 'Start Selling'"},
      {n:7,  t:"สร้างบัญชี Alibaba/AliExpress", d:"ด้วยอีเมลธุรกิจ",                  ai:true},
      {n:8,  t:"เลือก Thailand → Individual/Enterprise",d:""},
      {n:9,  t:"กรอกข้อมูลธุรกิจ",            d:"ชื่อร้าน/ที่อยู่/เบอร์",             ai:true},
      {n:10, t:"อัปโหลดเอกสาร",               d:"ทะเบียนพาณิชย์+Passport/บัตรปชช."},
      {n:11, t:"ชำระค่าสมัครประจำปี",          d:"Annual Fee ~$799–$999/ปี",            warn:true},
      {n:12, t:"รอ AliExpress Approve 3–7 วัน",d:""},
    ],
  },
  { id:3,  icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้าและบัญชีการเงิน", desc:"พร้อมรับเงินผ่าน Payoneer",
    steps:[
      {n:13, t:"ตั้งค่าชื่อร้านและ Banner",    d:"",                                   ai:true},
      {n:14, t:"เขียน Shop Description อังกฤษ", d:"จุดเด่น/สินค้าหลัก/นโยบาย",        ai:true},
      {n:15, t:"เชื่อม Payoneer กับ AliExpress",d:""},
      {n:16, t:"ยืนยันบัญชีธนาคาร/Payoneer",  d:""},
      {n:17, t:"ตั้งค่าสกุลเงิน",             d:"USD เป็นหลัก"},
      {n:18, t:"ตั้งค่า Return/Warranty Policy",d:""},
    ],
  },
  { id:4,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียน Title + Description อังกฤษ",
    steps:[
      {n:19, t:"My Products → Post New Product", d:""},
      {n:20, t:"เลือกหมวดหมู่ให้ถูกต้อง",     d:"Category สำคัญมาก",                  warn:true},
      {n:21, t:"เขียน Product Title อังกฤษ",   d:"Keyword+จุดเด่น+วัสดุ+ขนาด",        ai:true},
      {n:22, t:"อัปโหลดรูปสินค้า",            d:"Main พื้นขาว + 3–6 รูป"},
      {n:23, t:"สร้าง Product Video",          d:"เพิ่ม Conversion ได้มาก"},
      {n:24, t:"เขียน Product Description",    d:"ครบถ้วน มีตาราง Size/Spec",          ai:true},
      {n:25, t:"ตั้งราคา USD",                d:"ค่าส่ง + Commission 5–8%",            warn:true},
      {n:26, t:"ตั้งสต็อก + SKU Variant",     d:"สี/ขนาด/แบบ"},
      {n:27, t:"Submit รอ Approve 1–3 วัน",   d:""},
    ],
  },
  { id:5,  icon:"🚚", label:"ตั้งค่าจัดส่ง",
    name:"ตั้งค่าการจัดส่ง", desc:"เลือกขนส่งระหว่างประเทศ",
    steps:[
      {n:28, t:"Shipping → Shipping Template",  d:""},
      {n:29, t:"เลือกขนส่งระหว่างประเทศ",      d:"AliExpress Standard/EMS/DHL/FedEx"},
      {n:30, t:"ตั้งค่าค่าส่ง",               d:"ฟรีค่าส่ง (แนะนำ) หรือผู้ซื้อจ่าย"},
      {n:31, t:"ตั้ง Processing Time",          d:"3–7 วัน"},
      {n:32, t:"ตั้ง Shipping Region",         d:"เลือกประเทศที่จะขาย"},
      {n:33, t:"เปิด AliExpress Saver Shipping",d:"ลดค่าส่ง"},
    ],
  },
  { id:6,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Marketing", desc:"เข้าร่วม Campaign ระดับโลก",
    steps:[
      {n:34, t:"Promotion → สร้างโปรโมชั่น",   d:""},
      {n:35, t:"สร้าง Coupon ส่วนลด",          d:"% หรือลดราคาคงที่",                 ai:true},
      {n:36, t:"เข้าร่วม AliExpress Campaign", d:"11.11/Anniversary/3.28"},
      {n:37, t:"ตั้ง Flash Deal",              d:"โปรลดราคาจำกัดเวลา"},
      {n:38, t:"ใช้ AliExpress Affiliate",     d:"ให้ Influencer โปรโมทสินค้า"},
    ],
  },
  { id:7,  icon:"📢", label:"AliExpress Ads",
    name:"ใช้ AliExpress Ads", desc:"CPC โฆษณาขยายการเข้าถึง",
    steps:[
      {n:39, t:"CPC Ads → สร้างแคมเปญ",       d:"",                                   ai:true},
      {n:40, t:"เลือกสินค้า + Keyword",        d:"",                                   ai:true},
      {n:41, t:"ตั้งงบโฆษณาต่อวัน + Bid",    d:""},
      {n:42, t:"ติดตาม CTR/Conversion/ROAS",  d:"Dashboard"},
    ],
  },
  { id:8,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้อให้ทันเวลา",
    steps:[
      {n:43, t:"รับ Notification ออร์เดอร์",   d:"Seller Center"},
      {n:44, t:"ตรวจสอบรายละเอียด",           d:"สินค้า/จำนวน/ที่อยู่/วิธีชำระ"},
      {n:45, t:"ยืนยันออร์เดอร์และเตรียมสินค้า",d:"ภายใน Processing Time",             warn:true},
      {n:46, t:"แพ็คสินค้าตาม AliExpress Standard",d:""},
      {n:47, t:"ส่งพัสดุระหว่างประเทศ",        d:"EMS/DHL/AliExpress Standard"},
      {n:48, t:"อัปโหลดเลข Tracking",          d:"ภายในเวลากำหนด",                    warn:true},
    ],
  },
  { id:9,  icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"AliPay Escrow → Wallet → Payoneer → ธนาคารไทย",
    steps:[
      {n:49, t:"ลูกค้าชำระ AliPay/บัตร/PayPal",d:"หรือช่องทางท้องถิ่น"},
      {n:50, t:"เงินเข้า AliExpress Escrow",   d:"รอ Release หลังลูกค้ารับสินค้า",    warn:true},
      {n:51, t:"เงิน Release เข้า Wallet",     d:"15–20 วันหลังยืนยันส่ง"},
      {n:52, t:"โอนเงิน Wallet → Payoneer",   d:""},
      {n:53, t:"โอน Payoneer → ธนาคารไทย",   d:"แลก USD → THB"},
    ],
  },
  { id:10, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและรีวิว", desc:"รักษา Shop Score ให้ดี",
    steps:[
      {n:54, t:"ติดตามสถานะพัสดุ",            d:"จนถึงมือลูกค้า"},
      {n:55, t:"จัดการ Dispute",               d:"ตอบใน 5 วัน ถ้าลูกค้าร้องเรียน",   warn:true},
      {n:56, t:"ขอรีวิวจากลูกค้า",            d:"หลังรับสินค้า",                      ai:true},
      {n:57, t:"ตอบรีวิวและ Feedback",         d:"ทุกรายการ",                          ai:true},
      {n:58, t:"วิเคราะห์ Shop Analytics",     d:"Visitors/Conversion/Top Products",   ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#e60012",
  redBg:"rgba(230,0,18,0.11)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function AliExpressOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× AliExpress 速卖通</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(230,0,18,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(230,0,18,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(230,0,18,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(230,0,18,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(230,0,18,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
