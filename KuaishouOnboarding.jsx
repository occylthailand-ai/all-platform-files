/**
 * KuaishouOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Kuaishou ตั้งแต่สมัครจนรับเงิน
 * 79 ขั้นตอน ใน 12 ส่วน — Live Commerce จีน 700M+
 *
 * วิธีใช้:
 *   import KuaishouOnboarding from './KuaishouOnboarding'
 *   <KuaishouOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Kuaishou", desc:"เริ่มต้นสร้าง Kuaishou Account",
    steps:[
      {n:1, t:"โหลดแอป Kuaishou (快手)",     d:"App Store / Play Store"},
      {n:2, t:"กด 注册 + เบอร์/WeChat/Weibo", d:"สมัครด้วยเบอร์หรือ Social"},
      {n:3, t:"ยืนยัน OTP",                  d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี (昵称)",         d:"จีนหรืออังกฤษ สื่อถึงแบรนด์",      ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",                d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"ใส่รูปโปรไฟล์แบรนด์",        d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:7, t:"เขียน Bio 50 ตัวอักษร",       d:"ขายอะไร จุดเด่น วิธีสั่งซื้อ",      ai:true},
      {n:8, t:"เปิด Notification",            d:"รับแจ้งเตือน Comment และ DM"},
    ],
  },
  { id:2,  icon:"✅", label:"Verification",
    name:"สมัคร Creator / Business Account", desc:"ได้ Badge เพิ่มความน่าเชื่อถือ",
    steps:[
      {n:9,  t:"Me → Creator Center → Certification", d:"Apply for Verification"},
      {n:10, t:"เลือก Personal Creator / Enterprise",  d:"Enterprise = ธุรกิจ"},
      {n:11, t:"กรอกข้อมูลส่วนตัว/ธุรกิจ",           d:""},
      {n:12, t:"อัปโหลดเอกสาร",                       d:"บัตรปชช./Passport/Business License"},
      {n:13, t:"รอ Kuaishou ตรวจสอบ 3–7 วัน",         d:""},
      {n:14, t:"ได้รับ Verified Badge",                d:"เพิ่มความน่าเชื่อถือ"},
      {n:15, t:"เปิด Creator Center",                  d:"Analytics/Revenue/Performance"},
    ],
  },
  { id:3,  icon:"🏪", label:"KS Shop",
    name:"ตั้งค่า Kuaishou Shop", desc:"ร้านค้าในแอป ซื้อได้เลย",
    steps:[
      {n:16, t:"Creator Center → Shop → 开店",  d:"สมัครเปิดร้านค้า"},
      {n:17, t:"เลือกประเภทร้าน",               d:"ร้านทั่วไป (普通店) หรือ แบรนด์"},
      {n:18, t:"กรอกข้อมูลธุรกิจ",              d:"ชื่อบริษัท/ทะเบียน/ที่อยู่"},
      {n:19, t:"อัปโหลดเอกสาร",                 d:"Business License/Passport"},
      {n:20, t:"เชื่อม Alipay/WeChat/KS Pay",   d:"รับชำระเงิน"},
      {n:21, t:"ชำระค่ามัดจำร้านค้า",           d:"แล้วแต่หมวดสินค้า",              warn:true},
      {n:22, t:"รอ Approve 3–7 วัน",             d:""},
      {n:23, t:"ตั้งชื่อร้าน + โลโก้ + คำอธิบาย",d:"ภาษาจีน แนะนำ",               ai:true},
    ],
  },
  { id:4,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าใน Kuaishou Shop", desc:"AI เขียน Title + Description ภาษาจีน",
    steps:[
      {n:24, t:"Shop Dashboard → เพิ่มสินค้าใหม่",  d:""},
      {n:25, t:"เลือกหมวดหมู่สินค้า",               d:"Category ผิดถูกลบ",             warn:true},
      {n:26, t:"ตั้งชื่อสินค้าภาษาจีน",             d:"SEO Keyword หลัก",              ai:true},
      {n:27, t:"อัปโหลดรูปสินค้า",                  d:"Main Image พื้นขาว + 3–8 รูป"},
      {n:28, t:"เขียนรายละเอียดภาษาจีน",            d:"วัสดุ/ขนาด/วิธีใช้/จุดเด่น",   ai:true},
      {n:29, t:"ตั้งราคา/สต็อก/SKU Variant",        d:"สี/ขนาด/รุ่น"},
      {n:30, t:"Submit รอ Approve 24–48 ชม.",        d:""},
    ],
  },
  { id:5,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์และร้านให้พร้อม", desc:"โปรไฟล์ดี ลูกค้าจีนเชื่อถือมากขึ้น",
    steps:[
      {n:31, t:"ใส่ลิงก์ KS Shop ใน Bio",       d:""},
      {n:32, t:"ตั้ง Cover Photo",               d:"แสดงสินค้าหลักหรือโปรโมชั่น"},
      {n:33, t:"Pin วิดีโอขายดีด้านบน",          d:"ให้คนเห็นก่อน"},
      {n:34, t:"ตั้ง Auto Reply ใน DM",          d:"คำถามที่พบบ่อย",                ai:true},
      {n:35, t:"ตั้งค่าการจัดส่ง",               d:"ขนส่ง/ค่าส่ง/พื้นที่"},
      {n:36, t:"ตั้ง After-sale Policy",          d:"คืนสินค้าและรับประกัน"},
    ],
  },
  { id:6,  icon:"🎬", label:"สร้าง Content",
    name:"สร้างคอนเทนต์วิดีโอสั้น", desc:"AI เขียน Caption + Script ทุกวัน",
    steps:[
      {n:37, t:"ถ่ายวิดีโอแนวตั้ง 9:16",        d:"15 วิ–10 นาที"},
      {n:38, t:"ตัดต่อในแอป KS หรือ CapCut",    d:"subtitle, transition, effect"},
      {n:39, t:"ใส่เสียง Trending",              d:"Kuaishou Music Library"},
      {n:40, t:"เพิ่ม Text/Sticker/Effect",      d:"feature ที่แอปแนะนำ"},
      {n:41, t:"เขียน Caption จีน + Hook",       d:"บรรทัดแรกดึงใจ",               ai:true},
      {n:42, t:"ใส่ Hashtag 3–8 อัน",           d:"Trending + เกี่ยวข้องสินค้า",   ai:true},
      {n:43, t:"Tag สินค้าจาก KS Shop",          d:"ลูกค้ากดซื้อได้เลย"},
      {n:44, t:"ตั้งเวลาโพสต์ที่ดี",             d:"จีน: 07:00/12:00/19:00-22:00"},
      {n:45, t:"โพสต์ 1–3 ครั้ง/วัน",           d:"สม่ำเสมอ คุณภาพสำคัญ"},
    ],
  },
  { id:7,  icon:"🔴", label:"Live ขายสด",
    name:"Kuaishou Live Streaming ขายสด", desc:"Live ยาว = อัลกอริทึมชอบ",
    steps:[
      {n:46, t:"เปิดแอป → Live (直播)",          d:"ตั้งชื่อ Live บอกสินค้าและโปร",  ai:true},
      {n:47, t:"เพิ่มสินค้าเข้า Live Cart",      d:"ก่อนเริ่ม Live"},
      {n:48, t:"ตั้งราคา Flash Sale ช่วง Live", d:"สร้าง FOMO"},
      {n:49, t:"Live อย่างน้อย 2 ชั่วโมง",      d:"มีคะแนนพิเศษจากอัลกอริทึม",      warn:true},
      {n:50, t:"ตอบ Comment + Pin สินค้า",      d:"ให้ผู้ชมกดซื้อตลอด"},
      {n:51, t:"ใช้ Gift Feature",               d:"ผู้ชมส่ง Gift แลกโปรโมชั่น"},
      {n:52, t:"สรุปยอดขายหลัง Live",           d:"วิเคราะห์ผลใน Dashboard"},
    ],
  },
  { id:8,  icon:"🌟", label:"KOL/Affiliate",
    name:"ใช้ KOL / Affiliate Marketing", desc:"KOL จีนสร้าง Trust ได้เร็วมาก",
    steps:[
      {n:53, t:"ค้นหา KOL (达人) ที่เหมาะ",     d:"ตรงกลุ่มสินค้าและ Target"},
      {n:54, t:"ติดต่อผ่าน DM / 磁力聚星",       d:"Kuaishou Affiliate Platform"},
      {n:55, t:"ส่งสินค้าให้รีวิว/Commission",  d:"Seeding หรือจ่าย Commission",    ai:true},
      {n:56, t:"KOL โพสต์วิดีโอ + Tag สินค้า",  d:"ลิงก์ KS Shop ของคุณ"},
      {n:57, t:"ติดตาม Traffic จาก KOL",         d:"Dashboard วิเคราะห์ยอดขาย",     ai:true},
    ],
  },
  { id:9,  icon:"📢", label:"KS Ads",
    name:"Kuaishou Ads โปรโมทสินค้า", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:58, t:"เข้า 磁力引擎 Marketing",        d:"Kuaishou Ads Platform"},
      {n:59, t:"เลือก Ad Format",               d:"Feed/Live/Search Ads",           ai:true},
      {n:60, t:"ตั้ง Target Audience",          d:"อายุ/เพศ/ความสนใจ/ภูมิภาคจีน",  ai:true},
      {n:61, t:"ตั้งงบ + เผยแพร่ + ติดตาม",    d:"CTR/CVR Dashboard"},
    ],
  },
  { id:10, icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อใน Shop + DM",
    steps:[
      {n:62, t:"รับ Order Notification",        d:"Shop Dashboard"},
      {n:63, t:"ตรวจสอบรายละเอียด",            d:"สินค้า/จำนวน/ที่อยู่"},
      {n:64, t:"ยืนยันออร์เดอร์",              d:"เริ่มเตรียมสินค้า"},
      {n:65, t:"รับ DM จากลูกค้า",             d:"คำถามเพิ่มเติม"},
      {n:66, t:"ตอบคำถาม/แนะนำ/แจ้งราคา",     d:"ตอบเร็ว = ปิดขายสูง",            ai:true},
      {n:67, t:"ลูกค้าชำระ Alipay/WeChat/KS",  d:"ในแอปโดยตรง"},
    ],
  },
  { id:11, icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"Escrow → Release หลังลูกค้ารับสินค้า",
    steps:[
      {n:68, t:"ตรวจสอบการชำระใน Dashboard",   d:""},
      {n:69, t:"เงินเข้า Kuaishou Escrow",       d:"รอ Release หลังรับสินค้า",       warn:true},
      {n:70, t:"แพ็คสินค้า + พิมพ์ใบปะหน้า",  d:"จาก Dashboard"},
      {n:71, t:"ส่งพัสดุภายใน 48 ชม.",          d:"SF Express/YTO/ZTO",             warn:true},
      {n:72, t:"แจ้งเลข Tracking ในแอป",        d:"ลูกค้าติดตามพัสดุ"},
      {n:73, t:"ลูกค้ารับสินค้า → เงิน Release",d:"เข้า Kuaishou Wallet"},
    ],
  },
  { id:12, icon:"⭐", label:"ถอนเงิน+หลังขาย",
    name:"ถอนเงินและหลังการขาย", desc:"รักษาลูกค้าจีนให้กลับมาซื้อ",
    steps:[
      {n:74, t:"Wallet → Withdraw",             d:"โอนไปบัญชีธนาคารจีน"},
      {n:75, t:"แลกเงินหยวน → บาท",            d:"ธนาคารหรือ Money Changer"},
      {n:76, t:"ขอรีวิวจากลูกค้า",             d:"หลังรับสินค้า",                  ai:true},
      {n:77, t:"Repost วิดีโอรีวิวเป็น Content", d:"สร้าง Social Proof",            ai:true},
      {n:78, t:"Follow up หลัง 3–5 วัน",        d:"ถามความพอใจ แนะนำเพิ่ม",        ai:true},
      {n:79, t:"วิเคราะห์ Dashboard",            d:"GMV/Conversion/Watch Time/Fans", ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",orange:"#ffa500",
  orangeBg:"rgba(255,165,0,0.11)",orangeBorder:"rgba(255,165,0,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function KuaishouOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Kuaishou 快手</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.orange:allDone?"rgba(255,165,0,0.3)":C.border}`,background:i===part?C.orangeBg:allDone?"rgba(255,165,0,0.07)":"transparent",color:i===part?C.orange:allDone?C.orange:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,165,0,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,165,0,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.orange:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#000",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,165,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.orange,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.orange,color:"#000",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:700}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
