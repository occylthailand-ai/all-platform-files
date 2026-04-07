/**
 * TaobaoOnboarding.jsx
 * Wizard พา Seller ตั้งค่า Taobao ตั้งแต่สมัครจนรับเงิน
 * 69 ขั้นตอน ใน 11 ส่วน — E-commerce จีนอันดับ 1 โลก 800M+
 *
 * วิธีใช้:
 *   import TaobaoOnboarding from './TaobaoOnboarding'
 *   <TaobaoOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและเลือกโมเดลขาย",
    steps:[
      {n:1, t:"เตรียมเบอร์มือถือจีน",          d:"หรือสมัครผ่าน Agent จีน",             warn:true},
      {n:2, t:"เตรียมบัตรปชช.จีนหรือ Passport", d:"สำหรับยืนยันตัวตน"},
      {n:3, t:"เตรียม Alipay Account",          d:"สำคัญมาก ใช้รับเงิน",               warn:true},
      {n:4, t:"เตรียมทะเบียนพาณิชย์ไทย",      d:"ภ.พ.20 หรือทะเบียนบริษัท"},
      {n:5, t:"เลือกโมเดล",                    d:"Taobao ในจีน หรือ Taobao Global"},
    ],
  },
  { id:2,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Taobao", desc:"สร้าง Taobao Account",
    steps:[
      {n:6,  t:"ไปที่ taobao.com → 免费注册",  d:"สมัครบัญชีฟรี"},
      {n:7,  t:"ใส่เบอร์จีน → ยืนยัน OTP",   d:""},
      {n:8,  t:"ตั้ง Taobao ID + รหัสผ่าน",  d:""},
      {n:9,  t:"เชื่อมบัญชีกับ Alipay",       d:"จำเป็นมากสำหรับรับเงิน",             warn:true},
      {n:10, t:"ยืนยันตัวตน Real-name",       d:"บัตรปชช.จีน / Passport"},
      {n:11, t:"ตั้งรูปโปรไฟล์และชื่อแสดง",  d:"",                                   ai:true},
      {n:12, t:"เปิด Notification",            d:"รับแจ้งเตือนออร์เดอร์และข้อความ"},
    ],
  },
  { id:3,  icon:"🏪", label:"เปิดร้านค้า",
    name:"สมัครเปิดร้าน Taobao Store", desc:"ขั้นตอนเปิดร้านอย่างเป็นทางการ",
    steps:[
      {n:13, t:"consumerservice.taobao.com",   d:"สมัครเปิดร้าน"},
      {n:14, t:"เลือกประเภทร้าน",              d:"ร้านทั่วไป (普通店) หรือ Tmall"},
      {n:15, t:"กรอกข้อมูลร้านค้า",            d:"ชื่อร้าน/ประเภทสินค้า/คำอธิบาย",     ai:true},
      {n:16, t:"อัปโหลดเอกสาร",               d:"Business License/Passport"},
      {n:17, t:"ชำระค่ามัดจำ",                d:"1,000–10,000 หยวน แล้วแต่หมวด",      warn:true},
      {n:18, t:"รอ Taobao Approve 3–7 วัน",   d:""},
      {n:19, t:"ลงนามสัญญาผู้ขาย",            d:"Seller Agreement"},
      {n:20, t:"ได้รับ Seller Account",        d:"เข้า Seller Center (千牛)"},
    ],
  },
  { id:4,  icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้า", desc:"ตั้งค่าก่อนเริ่มขาย",
    steps:[
      {n:21, t:"ตั้งชื่อร้านจีน + โลโก้",     d:"",                                   ai:true},
      {n:22, t:"ออกแบบหน้าร้าน",              d:"Banner/Shop Decoration"},
      {n:23, t:"เขียน Shop Description จีน",  d:"จุดเด่น/สินค้าหลัก/นโยบาย",          ai:true},
      {n:24, t:"ตั้งค่าการจัดส่ง",            d:"SF/YTO/ZTO + ค่าส่ง + พื้นที่"},
      {n:25, t:"เชื่อม Alipay กับร้านค้า",   d:"รับชำระเงิน"},
      {n:26, t:"ตั้ง After-sale Policy",      d:"คืนสินค้า/รับประกัน/เวลาจัดส่ง"},
    ],
  },
  { id:5,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียนชื่อ + รายละเอียด + Detail Page จีน",
    steps:[
      {n:27, t:"Seller Center → 发布宝贝",     d:"เพิ่มสินค้าใหม่"},
      {n:28, t:"เลือกหมวดหมู่ให้ถูกต้อง",    d:"Category ผิดถูกลบ",                   warn:true},
      {n:29, t:"ตั้งชื่อสินค้าภาษาจีน",      d:"Keyword หลัก ≤60 ตัวอักษร",           ai:true},
      {n:30, t:"อัปโหลดรูปสินค้า",           d:"Main พื้นขาว + รายละเอียด 3–9 รูป"},
      {n:31, t:"สร้าง Detail Page (产品详情)", d:"Infographic + ข้อมูล Long Page",      ai:true},
      {n:32, t:"เขียนรายละเอียดสินค้าจีน",   d:"วัสดุ/ขนาด/วิธีใช้/จุดเด่น",          ai:true},
      {n:33, t:"ตั้งราคาปกติ + ราคาโปรโมชั่น",d:""},
      {n:34, t:"ตั้งสต็อก + SKU Variant",    d:"สี/ขนาด/รุ่น"},
      {n:35, t:"Submit รอ Approve 24–48 ชม.", d:""},
    ],
  },
  { id:6,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Marketing", desc:"AI เขียน Coupon + Campaign ให้",
    steps:[
      {n:36, t:"Taobao Marketing Center",     d:"ตั้งค่าโปรโมชั่น"},
      {n:37, t:"สร้าง Coupon (优惠券)",        d:"ส่วนลด % หรือลดราคาคงที่",            ai:true},
      {n:38, t:"ตั้ง Limited Time Discount",  d:"限时打折 โปรจำกัดเวลา"},
      {n:39, t:"เข้าร่วม Taobao Campaign",   d:"618/11.11/12.12/99"},
      {n:40, t:"ตั้ง Bundle Deal",           d:"ซื้อหลายชิ้นได้ราคาถูก"},
      {n:41, t:"ตั้ง Free Shipping",         d:"ฟรีค่าส่งเมื่อซื้อครบ X หยวน"},
      {n:42, t:"ตั้ง Taobao Points (积分)",   d:"คะแนนสะสมกับลูกค้า"},
    ],
  },
  { id:7,  icon:"📢", label:"Taobao Train",
    name:"ใช้ Taobao Train โฆษณา", desc:"Pay-per-Click โฆษณาใน Taobao",
    steps:[
      {n:43, t:"เข้า Taobao Train (直通车)",   d:"ระบบโฆษณา PPC"},
      {n:44, t:"สร้าง Ad Campaign",           d:"เลือกสินค้าที่จะโปรโมท",              ai:true},
      {n:45, t:"เลือก Keyword + ตั้ง Bid",   d:"ราคาประมูลแต่ละ Keyword",             ai:true},
      {n:46, t:"ตั้งงบโฆษณาต่อวัน",         d:"Daily Budget"},
      {n:47, t:"ติดตาม CTR/CPC/ROI/CVR",    d:"Dashboard"},
    ],
  },
  { id:8,  icon:"🔴", label:"Taobao Live",
    name:"ใช้ Taobao Live ขายสด", desc:"Live = ยอดขายพุ่ง + Reach ใหม่",
    steps:[
      {n:48, t:"เปิดแอป → Live (淘宝直播)",   d:"ตั้งชื่อ Live",                       ai:true},
      {n:49, t:"เชื่อมสินค้าเข้า Live Cart",  d:""},
      {n:50, t:"Live 1–2 ชม. ตอบ Comment",   d:""},
      {n:51, t:"Pin สินค้าและโปรโมชั่น",     d:"ให้ผู้ชมกดซื้อได้"},
      {n:52, t:"สรุปยอดขายและวิเคราะห์",    d:"หลังจบ Live"},
    ],
  },
  { id:9,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้ออย่างรวดเร็ว",
    steps:[
      {n:53, t:"รับ Notification ออร์เดอร์",  d:"Seller Center (千牛)"},
      {n:54, t:"ตรวจสอบรายละเอียด",          d:"สินค้า/จำนวน/ที่อยู่/Alipay"},
      {n:55, t:"ยืนยันออร์เดอร์",            d:"เริ่มเตรียมสินค้า"},
      {n:56, t:"แพ็คสินค้าตาม Standard",     d:"Taobao มีมาตรฐานบรรจุภัณฑ์"},
      {n:57, t:"พิมพ์ใบปะหน้าพัสดุ",         d:"จาก Seller Center"},
      {n:58, t:"ส่งพัสดุภายใน 24–72 ชม.",   d:"SF Express/YTO/ZTO",                  warn:true},
    ],
  },
  { id:10, icon:"💰", label:"รับเงิน",
    name:"ระบบชำระเงินและรับเงิน", desc:"Alipay Escrow → Wallet → ธนาคาร",
    steps:[
      {n:59, t:"ลูกค้าชำระ Alipay/Huabei",   d:"หรือบัตรเครดิตจีน"},
      {n:60, t:"เงินเข้า Alipay Escrow",      d:"รอ Release หลังรับสินค้า 15 วัน",    warn:true},
      {n:61, t:"เงิน Release เข้า Alipay",   d:"อัตโนมัติ"},
      {n:62, t:"โอนเงิน Alipay → ธนาคารจีน", d:""},
      {n:63, t:"แลกเงินหยวน → บาท",         d:"ธนาคารหรือ Money Changer"},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและ Reputation", desc:"DSR Score สูง = ขายดีระยะยาว",
    steps:[
      {n:64, t:"ติดตามสถานะพัสดุ",           d:"Seller Center"},
      {n:65, t:"จัดการ Return/Refund",        d:"退款退货 ถ้าลูกค้าร้องเรียน"},
      {n:66, t:"ตอบรีวิวลูกค้า DSR Score",   d:"ตอบทุกรายการ รักษาคะแนน 4.8+",     ai:true},
      {n:67, t:"ขอรีวิวผ่าน Taobao Chat",    d:"หลังลูกค้ารับสินค้า",               ai:true},
      {n:68, t:"ติดตาม Shop Score DSR",      d:"Detailed Seller Rating"},
      {n:69, t:"วิเคราะห์ Seller Dashboard", d:"GMV/Conversion/Traffic/Best-seller", ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#ff5a00",
  redBg:"rgba(255,90,0,0.11)",redBorder:"rgba(255,90,0,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function TaobaoOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Taobao 淘宝</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(255,90,0,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(255,90,0,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,90,0,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,90,0,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,90,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
