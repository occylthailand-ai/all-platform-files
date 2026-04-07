/**
 * AmazonOnboarding.jsx
 * Wizard พา Seller ตั้งค่า Amazon Global ตั้งแต่สมัครจนรับเงิน
 * 66 ขั้นตอน ใน 11 ส่วน — 21 Marketplaces 300M+ ผู้ซื้อทั่วโลก
 *
 * วิธีใช้:
 *   import AmazonOnboarding from './AmazonOnboarding'
 *   <AmazonOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและวางแผนก่อนเริ่ม",
    steps:[
      {n:1, t:"เตรียม Passport หรือบัตรปชช.",  d:"ภาษาอังกฤษ ยืนยันตัวตน",              warn:true},
      {n:2, t:"เตรียมบัตรเครดิตต่างประเทศ",    d:"Visa / Mastercard",                   warn:true},
      {n:3, t:"เตรียมบัญชีรับเงิน",            d:"Payoneer / Wise แนะนำ",               warn:true},
      {n:4, t:"เตรียมเบอร์รับ OTP ได้",        d:""},
      {n:5, t:"เลือก Marketplace",              d:"USA/UK/Japan/Germany/UAE ฯลฯ",        ai:true},
      {n:6, t:"เลือกแผน Seller",               d:"Individual(35฿/ชิ้น) หรือ Pro($39.99/ด.)"},
    ],
  },
  { id:2,  icon:"👤", label:"สมัครและยืนยัน",
    name:"สมัครและยืนยันตัวตน Amazon Seller", desc:"ขั้นตอนสำคัญที่สุด — ทำให้ถูกต้อง",
    steps:[
      {n:7,  t:"ไปที่ sell.amazon.com → Sign up",d:""},
      {n:8,  t:"สร้าง Amazon Account",          d:"ใช้อีเมลธุรกิจ แนะนำ",               ai:true},
      {n:9,  t:"เลือกประเทศ: Thailand",         d:""},
      {n:10, t:"กรอกข้อมูลธุรกิจ",             d:"ชื่อร้าน/ที่อยู่/เบอร์โทร",           ai:true},
      {n:11, t:"อัปโหลดเอกสารยืนยันตัวตน",    d:"Passport หรือบัตรปชช."},
      {n:12, t:"อัปโหลดหลักฐานที่อยู่",        d:"Bank Statement ≤90 วัน"},
      {n:13, t:"ยืนยันบัตรเครดิต",             d:"ตัดเงินทดสอบ",                        warn:true},
      {n:14, t:"รอ Amazon ยืนยัน 1–7 วัน",    d:"Video Call หรือ Document Review"},
    ],
  },
  { id:3,  icon:"⚙️", label:"ตั้งค่า Seller Central",
    name:"ตั้งค่า Seller Central", desc:"ตั้งค่าให้ครบก่อนเริ่มขาย",
    steps:[
      {n:15, t:"เข้า sellercentral.amazon.com", d:"ตั้งค่าข้อมูลร้านค้าครบ"},
      {n:16, t:"ตั้งค่าบัญชีรับเงิน",          d:"Payoneer / Wise / ธนาคารท้องถิ่น"},
      {n:17, t:"ตั้งค่าภาษี (Tax Information)", d:"ตามที่ Amazon กำหนด",                warn:true},
      {n:18, t:"ตั้งค่า Shipping",              d:"เลือก FBA หรือ FBM"},
      {n:19, t:"ตั้ง Return Address",           d:"สำหรับสินค้าที่ลูกค้าคืน"},
      {n:20, t:"ตั้งค่าแจ้งเตือน",             d:"Email/SMS เมื่อมีออร์เดอร์ใหม่"},
    ],
  },
  { id:4,  icon:"🔍", label:"วิจัยสินค้า",
    name:"วิจัยสินค้าและ Keyword", desc:"AI ช่วยหา Keyword + วิจัยตลาด",
    steps:[
      {n:21, t:"วิจัยสินค้าด้วย Tools",        d:"Helium10/Jungle Scout/AMZScout",      ai:true},
      {n:22, t:"ตรวจสอบ Competition",           d:"คู่แข่ง/ราคา/จำนวน Review"},
      {n:23, t:"วิจัย Keyword ภาษาอังกฤษ",     d:"คนค้นหาเกี่ยวกับสินค้าไทย",          ai:true},
      {n:24, t:"ตรวจสอบ Restricted Categories", d:"บางหมวดต้องขออนุมัติก่อน",           warn:true},
      {n:25, t:"คำนวณ Margin",                  d:"ราคาขาย - Fee - ค่าส่ง - ต้นทุน",   ai:true},
    ],
  },
  { id:5,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียน Title + Bullets + Description อังกฤษ",
    steps:[
      {n:26, t:"Catalog → Add a Product",       d:""},
      {n:27, t:"ค้นหา ASIN ที่มีอยู่แล้ว",     d:"ถ้ามี Sell on existing listing"},
      {n:28, t:"กรอก UPC / EAN Barcode",        d:"สมัคร GS1 ถ้าไม่มี (~$30/ปี)",       warn:true},
      {n:29, t:"เขียน Product Title อังกฤษ",   d:"Brand + Keyword + จุดเด่น + ขนาด",   ai:true},
      {n:30, t:"เขียน Bullet Points 5 ข้อ",    d:"จุดเด่นสำคัญของสินค้า",              ai:true},
      {n:31, t:"เขียน Product Description",    d:"รายละเอียดครบ วัสดุ ขนาด วิธีใช้",  ai:true},
      {n:32, t:"อัปโหลดรูปสินค้า",            d:"Main พื้นขาว 100% + 6–8 รูป"},
      {n:33, t:"ตั้งราคา + สต็อก + SKU",      d:""},
      {n:34, t:"ใส่ Backend Keywords",          d:"Search Terms ที่ไม่อยู่ใน Title",    ai:true},
    ],
  },
  { id:6,  icon:"🚚", label:"FBA หรือ FBM",
    name:"เลือกวิธีจัดส่ง FBA หรือ FBM", desc:"FBA = Prime Badge / FBM = ควบคุมเอง",
    steps:[
      {n:35, t:"FBA: ส่งเข้า Amazon Warehouse", d:"Amazon จัดส่ง ได้ Prime Badge",       warn:true},
      {n:36, t:"FBM: จัดส่งเองจากไทย",         d:"เมื่อมีออร์เดอร์"},
      {n:37, t:"ถ้า FBA: สร้าง Shipment Plan", d:"พิมพ์ Label → ส่งเข้า Amazon FC"},
      {n:38, t:"ถ้า FBM: ตั้ง Shipping Template",d:"ค่าส่ง + เวลาจัดส่ง"},
      {n:39, t:"พิจารณา SFP",                  d:"จัดส่งเองแต่ได้ Prime Badge"},
    ],
  },
  { id:7,  icon:"📢", label:"Promotions+Ads",
    name:"ตั้งค่าโปรโมชั่นและ PPC Ads", desc:"AI ช่วยเขียน Ad Copy + เลือก Keyword",
    steps:[
      {n:40, t:"สร้าง Coupon / Promotion",      d:"ส่วนลดดึงดูดลูกค้าใหม่",             ai:true},
      {n:41, t:"ตั้ง Lightning Deal / Best Deal",d:"เข้าร่วมโปรโมชั่น Amazon"},
      {n:42, t:"สร้าง Sponsored Products Ads",  d:"PPC โฆษณา",                          ai:true},
      {n:43, t:"เลือก Keyword + ตั้ง Bid",     d:"ราคาประมูล",                          ai:true},
      {n:44, t:"ตั้งงบโฆษณาต่อวัน",           d:"Daily Budget"},
      {n:45, t:"ติดตาม ACoS",                  d:"Advertising Cost of Sale ให้อยู่เป้า"},
    ],
  },
  { id:8,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"FBA = อัตโนมัติ / FBM = จัดการเอง",
    steps:[
      {n:46, t:"รับ Notification ออร์เดอร์",   d:"Seller Central"},
      {n:47, t:"FBA: Amazon จัดการทั้งหมด",    d:"ไม่ต้องทำอะไร"},
      {n:48, t:"FBM: แพ็คสินค้า + พิมพ์ Label",d:"จาก Seller Central"},
      {n:49, t:"ส่งพัสดุระหว่างประเทศ",        d:"DHL/FedEx/EMS/Thailand Post"},
      {n:50, t:"อัปโหลดเลข Tracking",          d:"ใน Seller Central ภายในเวลากำหนด",  warn:true},
      {n:51, t:"ติดตามสถานะพัสดุ",             d:"จนถึงมือลูกค้า"},
    ],
  },
  { id:9,  icon:"💰", label:"รับเงิน",
    name:"ระบบชำระเงินและรับเงิน", desc:"Amazon Pay → Disbursement → Payoneer → ธนาคารไทย",
    steps:[
      {n:52, t:"ลูกค้าชำระผ่าน Amazon Payment", d:"บัตรเครดิต / Amazon Pay"},
      {n:53, t:"เงินเข้า Amazon Seller Account", d:"Disbursement ทุก 14 วัน"},
      {n:54, t:"Amazon หักค่า Fee",              d:"Referral 8-15% + FBA Fee",           warn:true},
      {n:55, t:"เงินโอนเข้า Payoneer / Wise",  d:"ตามที่ตั้งไว้"},
      {n:56, t:"โอน Payoneer → ธนาคารไทย",     d:"แลก USD → THB"},
    ],
  },
  { id:10, icon:"⭐", label:"รีวิว+หลังขาย",
    name:"จัดการรีวิวและหลังการขาย", desc:"Account Health สำคัญมาก",
    steps:[
      {n:57, t:"ติดตาม Order Defect Rate",      d:"ODR ต้องต่ำกว่า 1% เสมอ",           warn:true},
      {n:58, t:"จัดการ A-to-Z Claim",           d:"และ Chargeback ถ้าลูกค้าร้องเรียน"},
      {n:59, t:"ใช้ Request a Review",          d:"ขอรีวิวผ่านระบบ Amazon เท่านั้น",   ai:true},
      {n:60, t:"ตอบ Customer Message",          d:"ภายใน 24 ชั่วโมง",                   warn:true},
      {n:61, t:"วิเคราะห์ Business Report",    d:"Sessions/CVR/Revenue/BSR",           ai:true},
    ],
  },
  { id:11, icon:"🚀", label:"ขยายธุรกิจ",
    name:"ขยายธุรกิจและ Brand Registry", desc:"สร้างแบรนด์ระดับโลก",
    steps:[
      {n:62, t:"สมัคร Amazon Brand Registry",   d:"ถ้ามีเครื่องหมายการค้า"},
      {n:63, t:"เปิดใช้ A+ Content",            d:"ตกแต่ง Product Page ให้สวยงาม",     ai:true},
      {n:64, t:"สร้าง Amazon Storefront",       d:"หน้าร้านส่วนตัวใน Amazon",           ai:true},
      {n:65, t:"ขยายไปยัง Marketplace อื่น",   d:"UK/Japan/Germany/UAE"},
      {n:66, t:"พิจารณา Amazon Global Logistics",d:"ลดต้นทุนขนส่ง"},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",amz:"#ff9900",
  amzBg:"rgba(255,153,0,0.11)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function AmazonOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Amazon Global</span>
          </div>
          <span style={{fontSize:12,color:C.amz,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.amz,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.amz:allDone?"rgba(255,153,0,0.3)":C.border}`,background:i===part?C.amzBg:allDone?"rgba(255,153,0,0.07)":"transparent",color:i===part?C.amz:allDone?C.amz:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.amzBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.amz,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.amzBg,color:C.amz,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,153,0,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,153,0,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.amz:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.amz:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#000",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,153,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.amz,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.amz,color:"#000",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:700}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
