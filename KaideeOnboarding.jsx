/**
 * KaideeOnboarding.jsx
 * Wizard พา Seller ตั้งค่า Kaidee ตั้งแต่สมัครจนรับเงิน
 * 43 ขั้นตอน ใน 8 ส่วน — ประกาศซื้อขายอันดับ 1 ไทย 10M+
 *
 * วิธีใช้:
 *   import KaideeOnboarding from './KaideeOnboarding'
 *   <KaideeOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1, icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Kaidee", desc:"เริ่มต้นสร้าง Kaidee Account",
    steps:[
      {n:1, t:"โหลดแอป Kaidee",                  d:"Play Store/App Store หรือ kaidee.com"},
      {n:2, t:"กด 'สมัครสมาชิก' + เบอร์/FB/Google",d:""},
      {n:3, t:"ยืนยัน OTP",                       d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อผู้ใช้ (Username)",         d:"น่าเชื่อถือ สื่อถึงแบรนด์",          ai:true},
      {n:5, t:"ใส่รูปโปรไฟล์",                    d:"สื่อถึงแบรนด์หรือตัวตน"},
      {n:6, t:"เปิด Notification",                 d:"รับแจ้งเตือนข้อความจากลูกค้า"},
    ],
  },
  { id:2, icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้น่าเชื่อถือ", desc:"โปรไฟล์ดี ลูกค้าเชื่อถือมากขึ้น",
    steps:[
      {n:7,  t:"เขียน Bio / คำอธิบาย",            d:"ขายอะไร จุดเด่น วิธีติดต่อ",         ai:true},
      {n:8,  t:"ยืนยันเบอร์มือถือ",               d:"เพิ่มความน่าเชื่อถือ"},
      {n:9,  t:"เพิ่มที่อยู่จังหวัด",              d:"ให้ลูกค้าค้นหาพบ"},
      {n:10, t:"เชื่อม Facebook",                 d:"เพิ่มความน่าเชื่อถือ"},
      {n:11, t:"สะสม Review",                     d:"จากผู้ซื้อ เพิ่ม Trust Score"},
    ],
  },
  { id:3, icon:"📝", label:"ลงประกาศ",
    name:"ลงประกาศขายสินค้า", desc:"AI เขียนชื่อประกาศ + รายละเอียด",
    steps:[
      {n:12, t:"กด '+' หรือ 'ลงประกาศ'",          d:"เลือกหมวดหมู่ให้ถูกต้อง"},
      {n:13, t:"เลือกหมวดย่อย",                   d:"บ้าน/รถ/มือถือ/เสื้อผ้า/ของสะสม ฯลฯ"},
      {n:14, t:"อัปโหลดรูปสินค้า",                d:"สูงสุด 20 รูป รูปเยอะ = ขายเร็ว"},
      {n:15, t:"เขียนชื่อประกาศ",                 d:"ชัดเจน ใส่ Keyword ที่คนค้นหา",       ai:true},
      {n:16, t:"เขียนรายละเอียดสินค้า",            d:"สภาพ/ขนาด/สี/อายุใช้งาน/เหตุผลขาย", ai:true},
      {n:17, t:"ตั้งราคา",                        d:"ระบุว่าต่อรองได้หรือไม่"},
      {n:18, t:"เลือกสภาพสินค้า",                 d:"ใหม่/มือสอง/ใกล้เคียงใหม่"},
      {n:19, t:"ระบุที่อยู่/จังหวัด/เขต",         d:"ที่สินค้าอยู่"},
      {n:20, t:"เลือกวิธีจัดส่ง",                 d:"ส่งพัสดุ/นัดรับ/ทั้งสองแบบ"},
    ],
  },
  { id:4, icon:"📢", label:"โฆษณาประกาศ",
    name:"เลือกแพ็กเกจโฆษณา", desc:"Boost ประกาศให้ขึ้นด้านบน",
    steps:[
      {n:21, t:"ลงประกาศฟรี",                    d:"แสดงผลปกติ ตกลงไปตามเวลา"},
      {n:22, t:"เลือก Boost / โปรโมทประกาศ",     d:"จ่ายเงินให้ขึ้นด้านบนนานขึ้น",       ai:true},
      {n:23, t:"เลือก Package",                   d:"รายวัน/รายสัปดาห์/รายเดือน"},
      {n:24, t:"ชำระค่าโฆษณา",                   d:"บัตรเครดิต/PromptPay/True Money"},
    ],
  },
  { id:5, icon:"💬", label:"สื่อสารลูกค้า",
    name:"รับคำถามและสื่อสารกับลูกค้า", desc:"ตอบเร็ว = ปิดขายได้",
    steps:[
      {n:25, t:"รับข้อความจากลูกค้า",             d:"Kaidee Chat ในแอป"},
      {n:26, t:"ตอบคำถามสินค้า",                  d:"สภาพ/รายละเอียด/ราคาต่อรอง",         ai:true},
      {n:27, t:"ส่งรูปเพิ่มเติมหรือวิดีโอ",       d:"ในกล่องข้อความ"},
      {n:28, t:"ต่อรองราคา",                      d:"ถ้ายินดี และยืนยันราคาสุดท้าย"},
      {n:29, t:"ยืนยันวิธีชำระเงินและจัดส่ง",    d:"กับลูกค้า"},
      {n:30, t:"แจ้งข้อมูลชำระเงิน",             d:"เลขพร้อมเพย์/บัญชี/QR Code"},
    ],
  },
  { id:6, icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบการชำระเงิน", desc:"เช็คเงินเข้าก่อนส่งสินค้าเสมอ",
    steps:[
      {n:31, t:"รอลูกค้าโอน PromptPay/ธนาคาร",   d:"",                                    warn:true},
      {n:32, t:"ตรวจสอบยอดเงินเข้า",              d:"Mobile Banking หรือรับสลิป",          warn:true},
      {n:33, t:"ยืนยันชำระเงินทาง Chat",          d:"",                                    ai:true},
      {n:34, t:"บันทึกออร์เดอร์",                 d:"Excel / Google Sheets"},
    ],
  },
  { id:7, icon:"📦", label:"จัดส่งสินค้า",
    name:"จัดส่งสินค้าหรือนัดรับ", desc:"ส่งพัสดุหรือนัดรับในจุดปลอดภัย",
    steps:[
      {n:35, t:"แพ็คสินค้าให้มิดชิด",            d:"ป้องกันความเสียหาย"},
      {n:36, t:"ส่งพัสดุ/นัดรับจุดปลอดภัย",      d:"Kerry/Flash/J&T/ไปรษณีย์ไทย",       warn:true},
      {n:37, t:"แจ้งเลข Tracking ทาง Chat",       d:"ให้ลูกค้าติดตามพัสดุ",              ai:true},
      {n:38, t:"ติดตามสถานะพัสดุ",               d:"จนถึงมือลูกค้า"},
      {n:39, t:"ลูกค้ารับสินค้า → ขอรีวิว",      d:"ใน Kaidee",                          ai:true},
    ],
  },
  { id:8, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและจัดการประกาศ", desc:"สะสม Review และต่อยอดการขาย",
    steps:[
      {n:40, t:"กด 'ปิดประกาศ' หรือ 'ขายแล้ว'",  d:"เมื่อสินค้าขายได้"},
      {n:41, t:"รับ Review จากผู้ซื้อ",           d:"สะสม Star Rating"},
      {n:42, t:"ลงประกาศสินค้าชิ้นต่อไป",        d:"ต่อเนื่อง"},
      {n:43, t:"วิเคราะห์สินค้าขายดี",           d:"นำมาลงขายเพิ่ม",                     ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",teal:"#00b478",
  tealBg:"rgba(0,180,120,0.11)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function KaideeOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Kaidee ไทยดี</span>
          </div>
          <span style={{fontSize:12,color:C.teal,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.teal,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.teal:allDone?"rgba(0,180,120,0.3)":C.border}`,background:i===part?C.tealBg:allDone?"rgba(0,180,120,0.07)":"transparent",color:i===part?C.teal:allDone?C.teal:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.tealBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.teal,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.tealBg,color:C.teal,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(0,180,120,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(0,180,120,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.teal:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(0,180,120,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.teal,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.teal,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
