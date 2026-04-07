/**
 * WeiboOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Weibo ตั้งแต่สมัครจนรับเงิน
 * 73 ขั้นตอน ใน 12 ส่วน — Brand Awareness + KOL Marketing จีน 600M+
 *
 * วิธีใช้:
 *   import WeiboOnboarding from './WeiboOnboarding'
 *   <WeiboOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Weibo", desc:"เริ่มต้นสร้าง Weibo Account",
    steps:[
      {n:1, t:"โหลดแอป Weibo",              d:"App Store/Play Store หรือ weibo.com"},
      {n:2, t:"กด 注册 + ใส่เบอร์/อีเมล",   d:"สมัครด้วยเบอร์มือถือจีน"},
      {n:3, t:"ยืนยัน OTP",                 d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี Nickname",      d:"จีนหรืออังกฤษ สื่อถึงแบรนด์",      ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",               d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"ใส่รูปโปรไฟล์แบรนด์",       d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:7, t:"เขียน Bio 160 ตัวอักษร",     d:"ขายอะไร ราคา ช่องทางสั่งซื้อ",     ai:true},
      {n:8, t:"เปิด Notification",           d:"รับแจ้งเตือน Comment และ DM"},
    ],
  },
  { id:2,  icon:"✅", label:"Verification",
    name:"ยืนยันตัวตนและสมัคร Business", desc:"ได้ V Badge เพิ่มความน่าเชื่อถือ",
    steps:[
      {n:9,  t:"Setting → Verification",    d:"Apply for Account Verification"},
      {n:10, t:"เลือก Personal V / Enterprise V", d:"Enterprise = ธุรกิจ"},
      {n:11, t:"อัปโหลดเอกสาร",             d:"บัตรปชช./Passport/ทะเบียนธุรกิจ"},
      {n:12, t:"ชำระค่าธรรมเนียม",          d:"~300 หยวน/ปี สำหรับ Enterprise",    warn:true},
      {n:13, t:"รอ Weibo ตรวจสอบ 3–7 วัน", d:""},
      {n:14, t:"ได้รับ V Badge",             d:"น้ำเงิน=Enterprise / ส้ม=Personal"},
      {n:15, t:"เปิด Weibo Store Link",      d:"เชื่อมกับร้านค้าภายนอก"},
    ],
  },
  { id:3,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้พร้อมขาย", desc:"โปรไฟล์ดี ลูกค้าจีนเชื่อถือมากขึ้น",
    steps:[
      {n:16, t:"ตั้งชื่อแบรนด์ชัดเจน",     d:"ภาษาจีนแนะนำ"},
      {n:17, t:"เขียน Bio ครบ",             d:"ขายอะไร/ราคา/สั่งที่ไหน/WeChat ID",  ai:true},
      {n:18, t:"ใส่ลิงก์ร้านค้าใน Bio",    d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:19, t:"ตั้งรูปปก Cover Photo",     d:"แสดงสินค้าหรือโปรโมชั่น"},
      {n:20, t:"Pin โพสต์ขายดีด้านบน",    d:"โปรโมชั่นล่าสุดให้คนเห็นก่อน"},
      {n:21, t:"เปิด DM (私信)",            d:"รับคำสั่งซื้อจากลูกค้า"},
    ],
  },
  { id:4,  icon:"✍️", label:"สร้าง Content",
    name:"สร้างคอนเทนต์และโพสต์ขาย", desc:"AI เขียนโพสต์จีนให้ทุกวัน",
    steps:[
      {n:22, t:"เขียนโพสต์ 2,000 ตัวอักษร", d:"Hook ดึงใจบรรทัดแรก",               ai:true},
      {n:23, t:"แนบรูปสินค้า สูงสุด 18 รูป", d:"รูปคุณภาพสูง พื้นหลังสะอาด"},
      {n:24, t:"แนบวิดีโอสินค้า",            d:"ความยาวสูงสุด 15 นาที"},
      {n:25, t:"ใส่ Hashtag (#话题#) 2–5",   d:"Trending หรือเกี่ยวข้องสินค้า",     ai:true},
      {n:26, t:"Tag บัญชีที่เกี่ยวข้อง",     d:"ซัพพลายเออร์/KOL/พาร์ทเนอร์"},
      {n:27, t:"ใส่ลิงก์สินค้าในโพสต์",      d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:28, t:"ตั้งเวลาโพสต์ที่ดี",          d:"จีน: 07:00/12:00/20:00-22:00"},
      {n:29, t:"โพสต์ 3–5 ครั้ง/วัน",       d:"สม่ำเสมอ คุณภาพสำคัญ"},
      {n:30, t:"Repost + Caption ใหม่",      d:"ขยาย Reach โพสต์เดิม",              ai:true},
    ],
  },
  { id:5,  icon:"💫", label:"Story & Super Topic",
    name:"Weibo Story และ Super Topics", desc:"สร้างชุมชนแบรนด์บน Weibo",
    steps:[
      {n:31, t:"โพสต์ Weibo Story (故事)",   d:"รูป/วิดีโอสั้น อายุ 24 ชั่วโมง",    ai:true},
      {n:32, t:"สร้าง Super Topic (超话)",   d:"ชุมชนของแบรนด์ให้ลูกค้า Follow"},
      {n:33, t:"โพสต์ใน Super Topic",       d:"เข้าถึงคนที่สนใจโดยตรง",            ai:true},
      {n:34, t:"จัด Event / Giveaway",      d:"ดึงผู้ติดตามใหม่ใน Super Topic"},
      {n:35, t:"ติดตาม #热搜# Trending",    d:"เชื่อมสินค้ากับกระแสจีน",            ai:true},
    ],
  },
  { id:6,  icon:"🔴", label:"Live ขายสด",
    name:"Weibo Live Streaming ขายสด", desc:"Live ครอบคลุมลูกค้าจีน 600M+",
    steps:[
      {n:36, t:"เปิดแอป → Live (直播)",     d:"ตั้งชื่อ Live บอกสินค้าและโปร",     ai:true},
      {n:37, t:"ตั้งค่า Live Shopping",     d:"เชื่อมลิงก์สินค้า Taobao/PDD"},
      {n:38, t:"Live 30–60 นาที",           d:"ตอบ Comment ตลอด"},
      {n:39, t:"Pin ลิงก์สินค้าระหว่าง Live",d:"ให้ผู้ชมกดซื้อได้เลย"},
      {n:40, t:"จัด Flash Sale ช่วง Live",  d:"สร้าง FOMO ยอดขายพุ่ง"},
      {n:41, t:"บันทึก Live สรุปยอดขาย",   d:"จำนวนผู้ชมและยอดขาย"},
    ],
  },
  { id:7,  icon:"🌟", label:"KOL Marketing",
    name:"ใช้ KOL / Influencer Marketing", desc:"KOL จีนสร้าง Trust ได้เร็วมาก",
    steps:[
      {n:42, t:"ค้นหา KOL (大V) ที่เหมาะ", d:"ตรงกลุ่มสินค้าและ Target"},
      {n:43, t:"ติดต่อ KOL ผ่าน DM",       d:"หรือ Weibo Marketing Platform"},
      {n:44, t:"ส่งสินค้าให้ KOL รีวิว",   d:"Seeding หรือจ่ายค่าโปรโมท",          ai:true},
      {n:45, t:"KOL โพสต์รีวิว + ลิงก์",   d:"ลิงก์ไปยัง Taobao/PDD/WeChat"},
      {n:46, t:"ติดตาม Traffic จาก KOL",    d:"Dashboard วิเคราะห์ยอดขาย",          ai:true},
    ],
  },
  { id:8,  icon:"📢", label:"Weibo Ads",
    name:"Weibo Ads โปรโมทสินค้า", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:47, t:"เข้า Weibo Marketing Platform", d:"weibo.com/ad"},
      {n:48, t:"เลือก Ad Format",              d:"Feed/Search/Display Ads"},
      {n:49, t:"ตั้ง Target Audience",          d:"อายุ/เพศ/ความสนใจ/ที่อยู่จีน",    ai:true},
      {n:50, t:"ตั้งงบโฆษณา",                 d:"Daily Budget หรือ Total Budget"},
      {n:51, t:"เผยแพร่ + ติดตาม CTR",        d:"Impressions/Conversion/Dashboard"},
    ],
  },
  { id:9,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง DM",
    steps:[
      {n:52, t:"รับ DM คำสั่งซื้อใน Weibo", d:"แจ้งเตือนทันทีเมื่อมีออร์เดอร์"},
      {n:53, t:"ตอบคำถามสินค้า/ราคา",       d:"ตอบเร็ว 5 นาที = ปิดขายสูง",        ai:true},
      {n:54, t:"ส่งรูปสินค้า/วิดีโอ",        d:"ข้อมูลเพิ่มเติมใน DM"},
      {n:55, t:"ยืนยันออร์เดอร์",           d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:56, t:"แจ้งราคารวม",              d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:57, t:"ส่งลิงก์ชำระเงิน",          d:"Alipay/WeChat Pay/PromptPay"},
      {n:58, t:"รอยืนยันการชำระ",           d:"ลูกค้ายืนยันทาง DM"},
    ],
  },
  { id:10, icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบและยืนยันชำระเงิน", desc:"เช็คเงินเข้าและยืนยันลูกค้า",
    steps:[
      {n:59, t:"ตรวจสอบ Alipay/WeChat/สลิป", d:"ยอด/วันที่/ชื่อผู้โอน"},
      {n:60, t:"เช็คยอดเข้าจริง",             d:"Alipay/WeChat Pay/Mobile Banking"},
      {n:61, t:"แจ้งยืนยันชำระแล้ว",          d:"ข้อความยืนยันทาง DM",              ai:true},
      {n:62, t:"บันทึกออร์เดอร์ลงระบบ",       d:"Excel/Google Sheets"},
      {n:63, t:"ออก Receipt ให้ลูกค้า",        d:"Order Confirmation ทาง DM",        ai:true},
    ],
  },
  { id:11, icon:"📦", label:"จัดส่ง",
    name:"แพ็คและจัดส่งสินค้า", desc:"ส่งสินค้าให้ถึงมือลูกค้า",
    steps:[
      {n:64, t:"แพ็คสินค้า + ใบปะหน้า",     d:"เขียนที่อยู่ลูกค้าชัดเจน"},
      {n:65, t:"ส่งพัสดุกับขนส่ง",           d:"SF Express/YTO/ไปรษณีย์ไทย"},
      {n:66, t:"แจ้ง Tracking ทาง DM",       d:"ส่ง Tracking Number ให้ลูกค้า",    ai:true},
      {n:67, t:"ลูกค้าติดตามพัสดุ",          d:"แอปขนส่งหรือเว็บไซต์"},
      {n:68, t:"ลูกค้ารับสินค้าแล้ว",        d:"ขอรีวิวทาง DM หรือ Comment",        ai:true},
    ],
  },
  { id:12, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Retention", desc:"รักษาลูกค้าจีนให้กลับมาซื้อ",
    steps:[
      {n:69, t:"ขอรีวิวและรูปถ่าย",          d:"รูปสินค้าจากลูกค้าจริง",             ai:true},
      {n:70, t:"Repost รีวิวใน Weibo",       d:"สร้าง Social Proof",                 ai:true},
      {n:71, t:"Follow up หลัง 3–5 วัน",    d:"ถามความพอใจ แนะนำเพิ่ม",            ai:true},
      {n:72, t:"เพิ่มลูกค้าเข้า WeChat VIP", d:"โปรโมชั่นพิเศษก่อนใคร"},
      {n:73, t:"วิเคราะห์ Weibo Analytics",  d:"Engagement สูง → ทำเพิ่ม",           ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",orange:"#ff6600",
  orangeBg:"rgba(255,102,0,0.11)",orangeBorder:"rgba(255,102,0,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function WeiboOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Weibo Roadmap</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.orange:allDone?"rgba(255,102,0,0.3)":C.border}`,background:i===part?C.orangeBg:allDone?"rgba(255,102,0,0.07)":"transparent",color:i===part?C.orange:allDone?C.orange:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(255,102,0,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(255,102,0,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.orange:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.orange:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,102,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.orange,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
