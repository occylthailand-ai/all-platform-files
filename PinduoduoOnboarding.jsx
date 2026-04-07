/**
 * PinduoduoOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Pinduoduo / Temu
 * 70 ขั้นตอน ใน 11 ส่วน — Cross-border TH→CN→Global
 *
 * วิธีใช้:
 *   import PinduoduoOnboarding from './PinduoduoOnboarding'
 *   <PinduoduoOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"📋", label:"เตรียมตัว",
    name:"เตรียมตัวก่อนสมัคร", desc:"เตรียมเอกสารและเลือกโมเดลขาย",
    steps:[
      {n:1, t:"เตรียมทะเบียนพาณิชย์",     d:"ภ.พ.20 หรือทะเบียนบริษัทไทย",          warn:true},
      {n:2, t:"เตรียมบัญชีธนาคารธุรกิจ",  d:"ไม่ใช่บัญชีส่วนตัว"},
      {n:3, t:"เตรียมเบอร์มือถือจีน",      d:"หรือสมัครผ่าน Agent จีน",              warn:true},
      {n:4, t:"เตรียม Business License จีน",d:"ถ้าต้องการเปิดร้านในจีนโดยตรง"},
      {n:5, t:"ศึกษากฎสินค้าต้องห้าม",    d:"Pinduoduo มี Policy เข้มงวด",           warn:true},
      {n:6, t:"เลือกโมเดล",               d:"ขายในจีนโดยตรง หรือผ่าน Temu"},
    ],
  },
  { id:2,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Pinduoduo", desc:"สร้าง Pinduoduo Account",
    steps:[
      {n:7,  t:"โหลดแอป Pinduoduo",         d:"App Store หรือ pinduoduo.com"},
      {n:8,  t:"กด Register + ใส่เบอร์จีน", d:"รับรหัส OTP"},
      {n:9,  t:"ยืนยัน OTP",               d:"รับรหัสทางเบอร์มือถือ"},
      {n:10, t:"ตั้งรหัสผ่าน + ชื่อบัญชี", d:"ภาษาจีนหรืออังกฤษ"},
      {n:11, t:"เชื่อม WeChat / Alipay",    d:"สำหรับชำระเงิน"},
      {n:12, t:"ยืนยันตัวตน",              d:"บัตรปชช.จีนหรือ Passport"},
      {n:13, t:"เปิด Notification",         d:"รับแจ้งเตือนออร์เดอร์"},
    ],
  },
  { id:3,  icon:"🏪", label:"เปิดร้าน",
    name:"สมัครเปิดร้าน Merchant", desc:"ขั้นตอนเปิดร้านค้าอย่างเป็นทางการ",
    steps:[
      {n:14, t:"ไปที่ mms.pinduoduo.com",    d:"Merchant Management System"},
      {n:15, t:"เลือกประเภทร้าน",           d:"ร้านทั่วไป / แบรนด์ / Flagship"},
      {n:16, t:"กรอกข้อมูลธุรกิจ",          d:"ชื่อบริษัท/ทะเบียน/ที่อยู่"},
      {n:17, t:"อัปโหลดเอกสาร",             d:"Business License/Passport"},
      {n:18, t:"ชำระค่ามัดจำร้าน",          d:"2,000–10,000 หยวน",                   warn:true},
      {n:19, t:"รอ Approve 3–7 วัน",        d:"Pinduoduo ตรวจสอบเอกสาร"},
      {n:20, t:"ลงนามสัญญาผู้ขาย",          d:"สัญญาออนไลน์"},
      {n:21, t:"ได้รับ Merchant Account",    d:"เข้าสู่ Dashboard ร้านค้า"},
    ],
  },
  { id:4,  icon:"⚙️", label:"ตั้งค่าร้าน",
    name:"ตั้งค่าร้านค้า", desc:"ตั้งค่าก่อนเริ่มขาย",
    steps:[
      {n:22, t:"ตั้งชื่อร้านและโลโก้",      d:"ภาษาจีน แนะนำ",                       ai:true},
      {n:23, t:"เขียนคำอธิบายร้านค้า",      d:"จุดเด่น/สินค้าหลัก/บริการหลังขาย",    ai:true},
      {n:24, t:"ตั้งค่าการจัดส่ง",          d:"SF Express/YTO/ZTO ฯลฯ"},
      {n:25, t:"ตั้ง Template การจัดส่ง",   d:"ค่าส่ง/พื้นที่/น้ำหนัก"},
      {n:26, t:"เชื่อม Alipay/WeChat Pay",  d:"รับชำระเงินจากลูกค้า"},
      {n:27, t:"ตั้ง After-sale Policy",    d:"นโยบายคืนสินค้าและรับประกัน"},
    ],
  },
  { id:5,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าและตั้งค่า Listing", desc:"AI เขียน Title + Description ภาษาจีน",
    steps:[
      {n:28, t:"เข้า Dashboard → เพิ่มสินค้า", d:"Merchant Management System"},
      {n:29, t:"เลือกหมวดหมู่ให้ถูกต้อง",    d:"Category ผิดถูกลบ",                  warn:true},
      {n:30, t:"ตั้งชื่อสินค้าภาษาจีน",      d:"SEO Optimized ใส่ Keyword หลัก",      ai:true},
      {n:31, t:"อัปโหลดรูปสินค้า",           d:"Main Image สีขาว + รายละเอียด 3–8 รูป"},
      {n:32, t:"เขียนรายละเอียดภาษาจีน",     d:"วัสดุ/ขนาด/วิธีใช้",                  ai:true},
      {n:33, t:"ตั้งราคา + ราคา Group Buying",d:"ราคารวมกลุ่มถูกกว่า 10–30%"},
      {n:34, t:"ตั้งสต็อก + SKU Variant",    d:"สี/ขนาด/รุ่น"},
      {n:35, t:"ใส่ Keywords และ Tags",       d:"ให้ลูกค้าค้นหาเจอ",                   ai:true},
      {n:36, t:"Submit รอ Approve 24–48 ชม.", d:"Pinduoduo ตรวจสอบก่อนขาย"},
    ],
  },
  { id:6,  icon:"🎁", label:"โปรโมชั่น",
    name:"ตั้งค่าโปรโมชั่นและ Group Buying", desc:"จุดเด่นของ Pinduoduo",
    steps:[
      {n:37, t:"ตั้งราคา Group Buying",      d:"ถูกลง 10–30% เมื่อซื้อรวม 2+ คน"},
      {n:38, t:"สร้าง Limited Time Offer",  d:"โปรลดราคาจำกัดเวลา",                  ai:true},
      {n:39, t:"เข้าร่วม Campaign",          d:"Flash Sale/618/11.11/12.12"},
      {n:40, t:"ตั้ง Coupon / Discount Code",d:"สำหรับลูกค้าใหม่",                    ai:true},
      {n:41, t:"ตั้ง Free Shipping",         d:"ฟรีค่าส่งเมื่อซื้อครบ X หยวน"},
      {n:42, t:"เข้าร่วม Duoduo Maicai",    d:"สำหรับสินค้าเกษตร/อาหาร"},
    ],
  },
  { id:7,  icon:"📢", label:"การตลาด",
    name:"การตลาดและโปรโมทสินค้า", desc:"ขยายการมองเห็นในตลาดจีน",
    steps:[
      {n:43, t:"ใช้ Duoduo Ads (多多进宝)",  d:"โฆษณาในแพลตฟอร์ม",                   ai:true},
      {n:44, t:"ตั้งงบ CPC + Keywords",     d:"Cost Per Click Bidding",               ai:true},
      {n:45, t:"แชร์ลิงก์ผ่าน WeChat",     d:"Moments / Group Chat"},
      {n:46, t:"ส่งลิงก์ Group Buying",     d:"ชวนเพื่อนซื้อด้วยกันได้ราคาถูก"},
      {n:47, t:"ขอ KOL จีนรีวิวสินค้า",    d:"Key Opinion Leader สร้าง Credibility"},
      {n:48, t:"Pinduoduo Live Streaming",  d:"ขายของสดในแพลตฟอร์ม",                 ai:true},
    ],
  },
  { id:8,  icon:"🛎️", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และจัดการ", desc:"จัดการคำสั่งซื้ออย่างรวดเร็ว",
    steps:[
      {n:49, t:"รับ Notification ออร์เดอร์",d:"Merchant Dashboard"},
      {n:50, t:"ตรวจสอบรายละเอียด",        d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:51, t:"ยืนยันออร์เดอร์",          d:"เริ่มเตรียมสินค้า"},
      {n:52, t:"พิมพ์ใบปะหน้าพัสดุ",       d:"จาก Merchant Dashboard"},
      {n:53, t:"แพ็คสินค้าตาม Standard",   d:"มีมาตรฐานบรรจุภัณฑ์"},
      {n:54, t:"ส่งพัสดุภายใน 24–48 ชม.",  d:"มีบทลงโทษถ้าล่าช้า",                  warn:true},
    ],
  },
  { id:9,  icon:"💰", label:"รับเงิน",
    name:"ระบบการชำระเงินและรับเงิน", desc:"เงินผ่าน Escrow ของ Pinduoduo",
    steps:[
      {n:55, t:"ลูกค้าชำระ Alipay/WeChat",  d:"หรือบัตรเครดิตจีน"},
      {n:56, t:"เงินเข้า Escrow",           d:"ระบบกักเงินไว้ก่อน",                  warn:true},
      {n:57, t:"เงิน Release หลัง 7–15 วัน",d:"หลังลูกค้ารับสินค้าไม่ร้องเรียน"},
      {n:58, t:"โอนเงินออกจาก Wallet",      d:"ไปบัญชีธนาคารจีน"},
      {n:59, t:"แลกเงินหยวน → บาท",        d:"ธนาคารหรือ Money Changer"},
    ],
  },
  { id:10, icon:"⭐", label:"หลังการขาย",
    name:"จัดการหลังการขายและรีวิว", desc:"รีวิวดี = อันดับขึ้น",
    steps:[
      {n:60, t:"ติดตามสถานะพัสดุ",          d:"Merchant Dashboard"},
      {n:61, t:"จัดการ Return / Refund",     d:"ถ้าลูกค้าร้องเรียน"},
      {n:62, t:"ตอบรีวิวลูกค้าทุกรายการ",   d:"รีวิวดี = อันดับขึ้น = ขายดีขึ้น",    ai:true},
      {n:63, t:"วิเคราะห์ข้อมูลขาย",        d:"GMV/Conversion/Return Rate",           ai:true},
      {n:64, t:"ปรับปรุง Listing",           d:"ตาม Feedback ลูกค้า",                  ai:true},
    ],
  },
  { id:11, icon:"🌍", label:"Temu Global",
    name:"Cross-border ผ่าน Temu", desc:"ขายสินค้าไทยสู่ตลาดโลก",
    steps:[
      {n:65, t:"สมัคร Temu Seller",         d:"seller.temu.com แพลตฟอร์มสากล"},
      {n:66, t:"อัปโหลดสินค้าไทย",          d:"OTOP/สินค้าไทย เป็น EN/จีน",           ai:true},
      {n:67, t:"ส่งสินค้าไปคลัง Temu",      d:"Temu จัดการ Logistics เอง"},
      {n:68, t:"รับเงินผ่าน Payoneer/Wire", d:"Bank Wire Transfer"},
      {n:69, t:"ติดตาม Sales Performance",  d:"Temu Seller Dashboard",                ai:true},
      {n:70, t:"ขยายตลาด 50+ ประเทศ",      d:"สหรัฐฯ/ยุโรป/ออสเตรเลีย ผ่าน Temu"},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#e73263",
  redBg:"rgba(231,50,99,0.11)",redBorder:"rgba(231,50,99,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function PinduoduoOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Pinduoduo / Temu</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(231,50,99,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(231,50,99,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(231,50,99,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(231,50,99,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(231,50,99,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
