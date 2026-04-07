/**
 * AlibabaOnboarding.jsx
 * Wizard พา Supplier ตั้งค่า Alibaba.com ตั้งแต่สมัครจนรับเงิน
 * 60 ขั้นตอน ใน 10 ส่วน — B2B Wholesale 200+ ประเทศ 40M+ Buyer
 *
 * วิธีใช้:
 *   import AlibabaOnboarding from './AlibabaOnboarding'
 *   <AlibabaOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและกำหนด MOQ/ราคา",
    steps:[
      {n:1, t:"เตรียมทะเบียนพาณิชย์ไทย",      d:"ภ.พ.20 หรือทะเบียนบริษัท",           warn:true},
      {n:2, t:"เตรียม Passport หรือบัตรปชช.",  d:"ยืนยันตัวตน"},
      {n:3, t:"เตรียมบัญชีรับเงินต่างประเทศ",  d:"Payoneer / Wise / SWIFT",             warn:true},
      {n:4, t:"เตรียมรูปสินค้า + รายละเอียดอังกฤษ",d:"คุณภาพสูง"},
      {n:5, t:"กำหนด MOQ และราคา Wholesale",   d:"",                                    ai:true},
    ],
  },
  { id:2,  icon:"👤", label:"สมัครและตั้งค่า",
    name:"สมัครและตั้งค่าบัญชี Alibaba Supplier", desc:"เปิด Supplier Account อย่างเป็นทางการ",
    steps:[
      {n:6,  t:"alibaba.com → Start Selling",   d:"กด 'Become a Supplier'"},
      {n:7,  t:"สร้างบัญชีด้วยอีเมลธุรกิจ",    d:"ตั้งรหัสผ่าน",                        ai:true},
      {n:8,  t:"เลือก Thailand → กรอกข้อมูล",  d:"ชื่อบริษัท/ที่อยู่/เบอร์"},
      {n:9,  t:"อัปโหลดเอกสาร",               d:"ทะเบียนพาณิชย์+Passport"},
      {n:10, t:"เลือกแผน Supplier",             d:"Free หรือ Gold ($1,699-$5,999/ปี)",   warn:true},
      {n:11, t:"รอ Alibaba Approve 3–7 วัน",   d:""},
      {n:12, t:"ได้รับ Supplier Account",       d:"เข้า Alibaba Seller Dashboard"},
    ],
  },
  { id:3,  icon:"🏢", label:"ตั้งค่าบริษัท",
    name:"ตั้งค่าบริษัทและ Storefront", desc:"AI เขียน Company Profile อังกฤษ",
    steps:[
      {n:13, t:"ตั้งค่า Company Profile",       d:"ชื่อ/ปีก่อตั้ง/พนักงาน/โรงงาน"},
      {n:14, t:"เพิ่มรูปบริษัท/โรงงาน/ใบรับรอง",d:"ISO/GMP/HACCP ถ้ามี"},
      {n:15, t:"เขียน Company Introduction",    d:"จุดแข็ง/ความเชี่ยวชาญ/ตลาด",         ai:true},
      {n:16, t:"ตั้งค่า Trade Capacity",        d:"กำลังผลิต/เครื่องจักร/R&D"},
      {n:17, t:"ออกแบบ Storefront",             d:"Banner/Logo/สีธีม",                   ai:true},
      {n:18, t:"เปิดใช้ Trade Assurance",       d:"ระบบค้ำประกันเงิน สำคัญมาก",         warn:true},
    ],
  },
  { id:4,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Product Listing", desc:"AI เขียน Title + Description + Spec",
    steps:[
      {n:19, t:"Dashboard → Post Product",      d:""},
      {n:20, t:"เลือกหมวดหมู่ให้ถูกต้อง",     d:"Category สำคัญมาก",                   warn:true},
      {n:21, t:"เขียน Product Title อังกฤษ",   d:"Keyword+จุดเด่น+วัสดุ+ขนาด",         ai:true},
      {n:22, t:"อัปโหลดรูปสินค้า",            d:"Main + รายละเอียด 6–15 รูป"},
      {n:23, t:"สร้าง Product Video",          d:"กระบวนการผลิต/สินค้า"},
      {n:24, t:"เขียน Product Description",    d:"Spec Sheet/วัสดุ/Size Chart/Cert",    ai:true},
      {n:25, t:"ตั้ง FOB/CIF Price + MOQ",    d:"ขั้นต่ำในการสั่ง",                     warn:true},
      {n:26, t:"ตั้ง Price Range ตามจำนวน",   d:"ยิ่งสั่งเยอะ ยิ่งถูก"},
      {n:27, t:"Submit รอ Approve 1–3 วัน",   d:""},
    ],
  },
  { id:5,  icon:"✅", label:"Verified Supplier",
    name:"ยืนยันตัวตนและสมัคร Verified Supplier", desc:"Badge เพิ่มความน่าเชื่อถือ",
    steps:[
      {n:28, t:"สมัคร Verified Supplier",      d:"ตรวจสอบโดย SGS / Bureau Veritas"},
      {n:29, t:"เตรียมให้ Inspector ตรวจโรงงาน",d:"สถานที่ผลิต"},
      {n:30, t:"ผ่านการตรวจ → ได้ Verified Badge",d:""},
      {n:31, t:"อัปโหลด Certificate เพิ่มเติม", d:"ISO/CE/FDA/HACCP/ฮาลาล ฯลฯ"},
      {n:32, t:"Verified = อันดับ Search สูงขึ้น",d:"ลูกค้าไว้วางใจมากขึ้น"},
    ],
  },
  { id:6,  icon:"📢", label:"Marketing Tools",
    name:"ใช้ Alibaba Marketing Tools", desc:"AI ช่วยเขียน Ad Copy + เลือก Keyword",
    steps:[
      {n:33, t:"เข้าร่วม Keyword Advertising",  d:"เหมือน Google Ads ใน Alibaba",       ai:true},
      {n:34, t:"ตั้ง P4P (Pay for Performance)", d:"โฆษณาจ่ายต่อคลิก",                  ai:true},
      {n:35, t:"เข้าร่วม Alibaba Trade Show",   d:"Virtual หรือ Online Expo"},
      {n:36, t:"ใช้ Smart Posting",             d:"AI ช่วยเขียน Description"},
      {n:37, t:"ติดตาม Analytics",              d:"Impressions/Clicks/Inquiries/CVR"},
    ],
  },
  { id:7,  icon:"💬", label:"รับ Inquiry",
    name:"รับ Inquiry และสื่อสารกับผู้ซื้อ", desc:"AI เขียน Inquiry Reply + Proposal",
    steps:[
      {n:38, t:"รับ Inquiry ใน Message Center", d:"คำถามสั่งซื้อจากทั่วโลก"},
      {n:39, t:"ตอบ Inquiry ภายใน 24 ชั่วโมง", d:"Response Rate ส่งผลต่ออันดับ",       warn:true},
      {n:40, t:"ส่ง Catalogue / Spec / Price",  d:"ให้ผู้ซื้อ",                          ai:true},
      {n:41, t:"เจรจา MOQ/ราคา/เงื่อนไข/ส่ง",  d:"",                                    ai:true},
      {n:42, t:"ส่ง Proforma Invoice (PI)",     d:"ให้ผู้ซื้อยืนยัน",                    ai:true},
      {n:43, t:"ตกลงเงื่อนไข + ยืนยัน Order", d:"Sales Contract"},
    ],
  },
  { id:8,  icon:"📄", label:"Trade Order",
    name:"สร้างและจัดการ Trade Order", desc:"บริหาร Order ตั้งแต่มัดจำถึงผลิตเสร็จ",
    steps:[
      {n:44, t:"สร้าง Trade Order ในระบบ",      d:""},
      {n:45, t:"กำหนดเงื่อนไขชำระ",            d:"T/T / L/C / Trade Assurance / Escrow", warn:true},
      {n:46, t:"ผู้ซื้อชำระ Deposit 30%",        d:"ก่อนเริ่มผลิต"},
      {n:47, t:"เริ่มผลิตตาม Spec + Timeline",  d:""},
      {n:48, t:"แจ้งความคืบหน้าการผลิต",       d:"ให้ผู้ซื้อรับทราบ",                   ai:true},
    ],
  },
  { id:9,  icon:"🚢", label:"QC+จัดส่ง",
    name:"QC และจัดส่งสินค้า", desc:"ตรวจสอบคุณภาพและส่งออกอย่างมืออาชีพ",
    steps:[
      {n:49, t:"ตรวจสอบคุณภาพสินค้า (QC)",    d:"ก่อนจัดส่ง"},
      {n:50, t:"ผู้ซื้อชำระ Balance Payment",   d:"ก่อน/หลังจัดส่ง",                    warn:true},
      {n:51, t:"เตรียมเอกสารส่งออก",           d:"Invoice/Packing List/B/L/COO",        warn:true},
      {n:52, t:"จัดส่งผ่าน Freight Forwarder",  d:"Sea / Air ระหว่างประเทศ"},
      {n:53, t:"แจ้ง Tracking / เลข B/L",      d:"ให้ผู้ซื้อ",                          ai:true},
      {n:54, t:"ผู้ซื้อรับสินค้า → ยืนยัน",   d:"ในระบบ Alibaba"},
    ],
  },
  { id:10, icon:"💰", label:"รับเงิน+หลังขาย",
    name:"รับเงินและหลังการขาย", desc:"รับเงิน + สร้าง Repeat Order",
    steps:[
      {n:55, t:"รับเงิน Wire Transfer/Payoneer", d:"หรือ Trade Assurance",               warn:true},
      {n:56, t:"แลกเงินตราต่างประเทศ",         d:"โอนเข้าธนาคารไทย"},
      {n:57, t:"ออก Receipt / เอกสารบัญชี",    d:"ให้ครบถ้วน"},
      {n:58, t:"ขอ Review / Feedback",          d:"ใน Alibaba",                          ai:true},
      {n:59, t:"Follow-up เพื่อ Repeat Order",  d:"",                                    ai:true},
      {n:60, t:"วิเคราะห์ข้อมูล",              d:"ประเทศ/สินค้าขายดี/ราคา",             ai:true},
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

export default function AlibabaOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Alibaba.com B2B</span>
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
            {isLast?"🎉 เริ่มขายส่งกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
