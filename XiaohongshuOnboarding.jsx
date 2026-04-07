/**
 * XiaohongshuOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Xiaohongshu ตั้งแต่สมัครจนรับเงิน
 * 76 ขั้นตอน ใน 12 ส่วน — Social Commerce จีน 300M+ ผู้หญิงรักสินค้าไทย
 *
 * วิธีใช้:
 *   import XiaohongshuOnboarding from './XiaohongshuOnboarding'
 *   <XiaohongshuOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี", desc:"เริ่มต้นสร้าง Xiaohongshu Account",
    steps:[
      {n:1, t:"โหลดแอป Xiaohongshu (小红书)",d:"App Store / Play Store"},
      {n:2, t:"กด 注册 + เบอร์/WeChat/Weibo",d:"สมัครด้วยเบอร์หรือ Social"},
      {n:3, t:"ยืนยัน OTP",                 d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี (昵称)",        d:"จีนหรืออังกฤษ สื่อถึงแบรนด์",      ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",               d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"เลือก Category ที่สนใจ",     d:"Beauty/Food/Fashion/Travel ฯลฯ"},
      {n:7, t:"ใส่รูปโปรไฟล์แบรนด์",       d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:8, t:"เขียน Bio 150 ตัวอักษร",     d:"ขายอะไร จุดเด่น ช่องทางสั่ง",      ai:true},
    ],
  },
  { id:2,  icon:"✅", label:"Professional",
    name:"สมัคร Professional Account", desc:"ได้ Badge เพิ่มความน่าเชื่อถือ",
    steps:[
      {n:9,  t:"Me → Settings → Professional",d:"Apply for Professional Account"},
      {n:10, t:"เลือกประเภท Creator / Brand", d:"Creator=คอนเทนต์ / Brand=ธุรกิจ"},
      {n:11, t:"เลือกหมวดธุรกิจ",            d:"ความงาม/อาหาร/แฟชั่น/ไลฟ์สไตล์"},
      {n:12, t:"อัปโหลดเอกสาร",              d:"Business License / Passport"},
      {n:13, t:"รอ Approve 3–5 วัน",          d:"Xiaohongshu ตรวจสอบ"},
      {n:14, t:"ได้รับ Professional Badge ✓", d:"เพิ่มความน่าเชื่อถือ"},
      {n:15, t:"เปิด Creator Center",         d:"Analytics + Content Performance"},
    ],
  },
  { id:3,  icon:"🏪", label:"XHS Shop",
    name:"ตั้งค่า Xiaohongshu Shop", desc:"ซื้อได้เลยไม่ต้องออกจากแอป",
    steps:[
      {n:16, t:"Creator Center → Shop → Apply",d:"สมัครเปิดร้านค้า"},
      {n:17, t:"เลือกประเภทร้าน",             d:"Personal Shop หรือ Brand Shop"},
      {n:18, t:"กรอกข้อมูลธุรกิจ",            d:"ชื่อบริษัท/ทะเบียนการค้า"},
      {n:19, t:"ยืนยันตัวตนด้วยเอกสาร",       d:"Business License/Passport"},
      {n:20, t:"เชื่อม Alipay / WeChat Pay",  d:"รับชำระเงินจากลูกค้า"},
      {n:21, t:"รอ Approve 3–7 วัน",           d:""},
      {n:22, t:"ตั้งชื่อร้านและโลโก้",         d:"ภาษาจีน แนะนำ",                   ai:true},
      {n:23, t:"เปิดร้านบน Profile",            d:"ลูกค้าเข้าชมและซื้อได้เลย"},
    ],
  },
  { id:4,  icon:"📦", label:"เพิ่มสินค้า",
    name:"เพิ่มสินค้าใน Shop", desc:"AI เขียน Title + Description ภาษาจีน",
    steps:[
      {n:24, t:"Shop Dashboard → เพิ่มสินค้า",d:""},
      {n:25, t:"เลือกหมวดหมู่สินค้า",          d:"Category ผิดถูกลบ",                warn:true},
      {n:26, t:"ตั้งชื่อสินค้าภาษาจีน",        d:"SEO Keyword สำคัญมาก",              ai:true},
      {n:27, t:"อัปโหลดรูปสินค้า",             d:"Main Image + รายละเอียด 3–9 รูป"},
      {n:28, t:"เขียนรายละเอียดภาษาจีน",       d:"วัสดุ/ขนาด/วิธีใช้/จุดเด่น",       ai:true},
      {n:29, t:"ตั้งราคา/สต็อก/SKU",           d:"สี/ขนาด/น้ำหนัก"},
      {n:30, t:"Submit รอ Approve 24–48 ชม.",  d:""},
    ],
  },
  { id:5,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้พร้อมขาย", desc:"โปรไฟล์ดี ลูกค้าจีนเชื่อถือมากขึ้น",
    steps:[
      {n:31, t:"ใส่ลิงก์ร้านค้าใน Bio",       d:"Xiaohongshu Shop Link"},
      {n:32, t:"Pin Note ขายดีด้านบน",        d:"โปรโมชั่นล่าสุดให้คนเห็นก่อน"},
      {n:33, t:"สร้าง Collection",             d:"จัดกลุ่มสินค้าและคอนเทนต์"},
      {n:34, t:"ตั้ง Auto Reply DM",          d:"คำถามที่พบบ่อย",                    ai:true},
      {n:35, t:"เพิ่ม WeChat ID ในข้อมูล",   d:"สำหรับลูกค้าต้องการพูดคุยเพิ่ม"},
    ],
  },
  { id:6,  icon:"📸", label:"สร้าง Note",
    name:"สร้างคอนเทนต์ Note", desc:"AI เขียน Note รีวิวภาษาจีนให้ทุกวัน",
    steps:[
      {n:36, t:"กด + → สร้าง Note ใหม่",      d:"Image Note หรือ Video Note"},
      {n:37, t:"อัปโหลดรูป 1–9 รูป / วิดีโอ", d:"คุณภาพสูง สวยงาม"},
      {n:38, t:"แก้ไขรูปด้วย Filter/Effect",  d:"Aesthetic สม่ำเสมอ"},
      {n:39, t:"เขียน Title ดึงดูด",           d:"Keyword หลักใน 20 ตัวแรก",         ai:true},
      {n:40, t:"เขียน Caption ละเอียด",        d:"รีวิว/วิธีใช้/Before-After/Story",  ai:true},
      {n:41, t:"ใส่ Hashtag 5–10 อัน",        d:"Trending + เฉพาะสินค้า",            ai:true},
      {n:42, t:"Tag สินค้าจาก Shop",           d:"ลูกค้ากดซื้อได้เลย"},
      {n:43, t:"Tag Location",                 d:"แหล่งผลิตในไทย/จังหวัด"},
      {n:44, t:"ตั้งเวลาโพสต์ที่ดี",           d:"จีน: 07:00/12:00/20:00-22:00"},
    ],
  },
  { id:7,  icon:"🔴", label:"Live ขายสด",
    name:"Xiaohongshu Live Streaming", desc:"Live = ยอดขายพุ่ง + Reach ใหม่",
    steps:[
      {n:45, t:"เปิดแอป → Live (直播)",       d:"ตั้งชื่อ Live บอกสินค้าและโปร",    ai:true},
      {n:46, t:"เชื่อม Product Link จาก Shop",d:"ขายระหว่าง Live ได้เลย"},
      {n:47, t:"Live 30+ นาที โชว์สินค้า",   d:"ตอบ Comment ตลอด"},
      {n:48, t:"Pin สินค้า + โปรโมชั่น",     d:"ให้ผู้ชมกดซื้อได้ตลอด"},
      {n:49, t:"สรุปยอดขายหลังจบ",           d:"Analytics ใน Dashboard"},
    ],
  },
  { id:8,  icon:"🌟", label:"KOL/KOC",
    name:"ใช้ KOL / KOC Marketing", desc:"Micro-influencer จีนสร้าง Trust เร็ว",
    steps:[
      {n:50, t:"ค้นหา KOL/KOC ที่เหมาะ",    d:"ตรงกลุ่มสินค้าและ Target"},
      {n:51, t:"ติดต่อผ่าน DM/Brand Partner",d:"Xiaohongshu Brand Partner Platform"},
      {n:52, t:"ส่งสินค้าให้รีวิว (Seeding)", d:"หรือจ่ายค่าโปรโมท",               ai:true},
      {n:53, t:"KOL เขียน Note + Tag ร้าน",  d:"ลิงก์ Shop และสินค้า"},
      {n:54, t:"ติดตาม Traffic จาก KOL",      d:"Dashboard วิเคราะห์ยอดขาย",        ai:true},
    ],
  },
  { id:9,  icon:"📢", label:"XHS Ads",
    name:"Xiaohongshu Ads", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:55, t:"Creator Center → Ads",        d:"สร้าง Campaign"},
      {n:56, t:"เลือก Objective",             d:"Followers/Traffic/ยอดขาย Shop",    ai:true},
      {n:57, t:"ตั้ง Target + งบ → เผยแพร่", d:"อายุ/เพศ/ความสนใจ",               ai:true},
    ],
  },
  { id:10, icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อใน Shop + DM",
    steps:[
      {n:58, t:"รับ Order Notification",      d:"Shop Dashboard"},
      {n:59, t:"ตรวจสอบรายละเอียด",          d:"สินค้า/จำนวน/ที่อยู่"},
      {n:60, t:"ยืนยันออร์เดอร์",            d:"เริ่มเตรียมสินค้า"},
      {n:61, t:"รับ DM จากลูกค้า",           d:"คำถามเพิ่มเติม"},
      {n:62, t:"ตอบคำถามสินค้า/ราคา/ส่ง",   d:"ตอบเร็ว = ปิดการขายสูง",           ai:true},
      {n:63, t:"แจ้งราคารวม",               d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:64, t:"ลูกค้าชำระ Alipay/WeChat",   d:"ในแอปโดยตรง"},
    ],
  },
  { id:11, icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"เงิน Escrow → Release หลังส่งสินค้า",
    steps:[
      {n:65, t:"ตรวจสอบการชำระใน Dashboard", d:""},
      {n:66, t:"เงินเข้า Xiaohongshu Escrow", d:"รอ Release หลังลูกค้ารับสินค้า",  warn:true},
      {n:67, t:"แพ็คสินค้า + พิมพ์ใบปะหน้า",d:"จาก Dashboard"},
      {n:68, t:"ส่งพัสดุภายใน 48 ชม.",       d:"SF Express/YTO/ZTO",               warn:true},
      {n:69, t:"แจ้งเลข Tracking ในแอป",     d:"ลูกค้าติดตามพัสดุ"},
      {n:70, t:"ลูกค้ารับสินค้า→เงิน Release",d:"เข้า Xiaohongshu Wallet"},
    ],
  },
  { id:12, icon:"⭐", label:"ถอนเงิน+หลังขาย",
    name:"ถอนเงินและหลังการขาย", desc:"รักษาลูกค้าจีนให้กลับมาซื้อ",
    steps:[
      {n:71, t:"Dashboard → Wallet → Withdraw",d:"โอนไปบัญชีธนาคารจีน"},
      {n:72, t:"โอนเงินออกบัญชีธนาคาร",      d:"แลกหยวน → บาท"},
      {n:73, t:"ขอรีวิวจากลูกค้า",           d:"หลังรับสินค้า",                    ai:true},
      {n:74, t:"Repost รีวิวเป็น Note ใหม่",  d:"สร้าง Social Proof",               ai:true},
      {n:75, t:"Follow up หลัง 3–5 วัน",     d:"ถามความพอใจ แนะนำเพิ่ม",          ai:true},
      {n:76, t:"วิเคราะห์ Note Analytics",    d:"Views/Likes/Saves/Conversion",     ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",red:"#ff2d55",
  redBg:"rgba(255,45,85,0.11)",redBorder:"rgba(255,45,85,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function XiaohongshuOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Xiaohongshu 小红书</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.red:allDone?"rgba(255,45,85,0.3)":C.border}`,background:i===part?C.redBg:allDone?"rgba(255,45,85,0.07)":"transparent",color:i===part?C.red:allDone?C.red:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,45,85,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,45,85,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.red:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.red:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,45,85,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.red,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
