/**
 * IQiyiOnboarding.jsx
 * Wizard พา Creator ตั้งค่า iQiyi ตั้งแต่สมัครจนรับเงิน
 * 61 ขั้นตอน ใน 11 ส่วน — Video Platform จีน 500M+ Brand Awareness
 *
 * วิธีใช้:
 *   import IQiyiOnboarding from './IQiyiOnboarding'
 *   <IQiyiOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี iQiyi", desc:"เริ่มต้นสร้าง iQiyi Account",
    steps:[
      {n:1, t:"โหลดแอป iQiyi (爱奇艺)",        d:"App Store/Play Store หรือ iq.com"},
      {n:2, t:"กด 注册 + เบอร์/WeChat/Weibo/QQ",d:"สมัครด้วยเบอร์หรือ Social"},
      {n:3, t:"ยืนยัน OTP",                    d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี (昵称)",           d:"สื่อถึงแบรนด์",                     ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",                  d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"ใส่รูปโปรไฟล์แบรนด์",          d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:7, t:"เปิด Notification",              d:"รับแจ้งเตือน Comment และ Follower"},
    ],
  },
  { id:2,  icon:"✅", label:"Creator Account",
    name:"สมัคร iQiyi Creator Account", desc:"ได้ Badge + ฟีเจอร์ Creator ครบ",
    steps:[
      {n:8,  t:"Creator Center (号主中心)",     d:"สมัครเป็น Creator"},
      {n:9,  t:"เลือกประเภท Content",          d:"Lifestyle/Food/Travel/Beauty ฯลฯ"},
      {n:10, t:"กรอกข้อมูล Channel",           d:"ชื่อ/หมวด/จุดเด่น",               ai:true},
      {n:11, t:"อัปโหลดเอกสารยืนยัน",         d:"Passport/บัตรปชช."},
      {n:12, t:"รอ iQiyi ตรวจสอบ 3–7 วัน",    d:""},
      {n:13, t:"ได้รับ Creator Badge",          d:"เปิดฟีเจอร์ Creator ครบ"},
    ],
  },
  { id:3,  icon:"⚙️", label:"ตั้งค่า Channel",
    name:"ตั้งค่า Channel ให้พร้อมขาย", desc:"โปรไฟล์ดี ลูกค้าจีนเชื่อถือมากขึ้น",
    steps:[
      {n:14, t:"ตั้งชื่อ Channel + Banner",    d:"สื่อถึงแบรนด์หรือสินค้า",          ai:true},
      {n:15, t:"เขียน Channel Description",    d:"ขายอะไร จุดเด่น วิธีติดต่อ",       ai:true},
      {n:16, t:"ใส่ลิงก์ร้านค้าใน Bio",       d:"Taobao/WeChat Shop/Pinduoduo"},
      {n:17, t:"เพิ่ม WeChat ID ใน Profile",  d:"สำหรับลูกค้าต้องการสั่ง"},
      {n:18, t:"Pin วิดีโอขายดีด้านบน",       d:"Brand Showcase ให้คนเห็นก่อน"},
    ],
  },
  { id:4,  icon:"🎬", label:"สร้างวิดีโอ",
    name:"สร้างคอนเทนต์วิดีโอ", desc:"AI เขียน Script + Title + Description จีน",
    steps:[
      {n:19, t:"ถ่ายวิดีโอรีวิวสินค้า",       d:"คุณภาพสูง แสงดี เสียงชัด"},
      {n:20, t:"ตัดต่อให้น่าสนใจ",            d:"Intro Hook ดึงใจใน 3 วิแรก",       ai:true},
      {n:21, t:"เพิ่ม Subtitle ภาษาจีน",      d:"ในวิดีโอ",                         ai:true},
      {n:22, t:"เขียน Title วิดีโอจีน",       d:"Keyword หลักที่คนค้นหา",           ai:true},
      {n:23, t:"เขียน Description วิดีโอ",    d:"รายละเอียดสินค้า + ลิงก์ร้าน",     ai:true},
      {n:24, t:"เพิ่ม Tag / Keyword",         d:"เกี่ยวข้องกับสินค้า",              ai:true},
      {n:25, t:"ตั้งปก Thumbnail ดึงดูด",     d:"คลิก"},
      {n:26, t:"อัปโหลดและเผยแพร่",          d:""},
    ],
  },
  { id:5,  icon:"📱", label:"Short Video",
    name:"ใช้ iQiyi Short Video (随刻)", desc:"วิดีโอสั้น ขยาย Reach ใหม่",
    steps:[
      {n:27, t:"เข้า iQiyi → Random (随刻)",  d:"แพลตฟอร์มวิดีโอสั้น"},
      {n:28, t:"สร้างวิดีโอสั้น 15 วิ–3 นาที",d:"แนวตั้ง 9:16 เกี่ยวสินค้า"},
      {n:29, t:"ใส่ Hashtag ที่ Trending",    d:"ในหมวดสินค้า",                    ai:true},
      {n:30, t:"Tag สินค้าหรือใส่ลิงก์ร้าน", d:""},
      {n:31, t:"โพสต์ 1–2 ครั้ง/วัน",       d:"สม่ำเสมอ"},
    ],
  },
  { id:6,  icon:"📢", label:"Brand Ads",
    name:"iQiyi Brand Advertising", desc:"โฆษณาสำหรับแบรนด์ระดับสูง",
    steps:[
      {n:32, t:"iQiyi Brand Marketing Platform",d:"爱奇艺品牌广告"},
      {n:33, t:"เลือกรูปแบบโฆษณา",           d:"Pre-roll/Banner/Sponsored",         ai:true},
      {n:34, t:"เลือก Target Audience",       d:"อายุ/เพศ/ความสนใจ/ภูมิภาคจีน",    ai:true},
      {n:35, t:"ตั้งงบโฆษณา",               d:"CPM หรือ CPV"},
      {n:36, t:"เผยแพร่ + ติดตาม Views/CTR", d:"Brand Recall Dashboard"},
    ],
  },
  { id:7,  icon:"🔴", label:"iQiyi Live",
    name:"ใช้ iQiyi Live ขายสด", desc:"Live Shopping ผู้ชม 500M+",
    steps:[
      {n:37, t:"เปิดแอป → Live (直播)",       d:"สร้าง Live ใหม่",                  ai:true},
      {n:38, t:"ตั้งชื่อ Live",               d:"บอกสินค้าและโปรโมชั่น"},
      {n:39, t:"เชื่อมลิงก์สินค้าใน Live",   d:"จากร้านค้าภายนอก"},
      {n:40, t:"Live 30–60 นาที",            d:"ตอบ Comment ตลอด"},
      {n:41, t:"แชร์ลิงก์ Live ไป WeChat/Weibo",d:"ดึงผู้ชม"},
    ],
  },
  { id:8,  icon:"🔗", label:"ดึง Traffic",
    name:"ดึง Traffic จาก iQiyi ไปร้านค้า", desc:"iQiyi → WeChat / Taobao",
    steps:[
      {n:42, t:"ใส่ลิงก์ร้านค้าใน Description",d:"ทุกวิดีโอ Taobao/WeChat/PDD"},
      {n:43, t:"พูดถึงลิงก์ในวิดีโอ",         d:"'สั่งซื้อที่ลิงก์ใน Description'"},
      {n:44, t:"เพิ่ม WeChat ID",             d:"ให้ลูกค้า DM เพื่อสั่งซื้อ"},
      {n:45, t:"แชร์วิดีโอไป WeChat/Weibo",  d:"ขยาย Reach"},
    ],
  },
  { id:9,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง DM / WeChat",
    steps:[
      {n:46, t:"รับ DM คำสั่งซื้อใน iQiyi",  d:"หรือ WeChat"},
      {n:47, t:"รับออร์เดอร์ผ่าน WeChat",    d:"ถ้าลูกค้าเพิ่มเพื่อนมา"},
      {n:48, t:"ตอบคำถามสินค้า/ราคา/สั่ง",   d:"ตอบเร็ว = ปิดขายสูง",             ai:true},
      {n:49, t:"ยืนยันออร์เดอร์",            d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:50, t:"แจ้งราคารวม",               d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:51, t:"ส่ง QR Alipay/WeChat/PromptPay",d:"ให้ลูกค้าชำระ"},
    ],
  },
  { id:10, icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"เช็คเงินเข้าและส่งสินค้า",
    steps:[
      {n:52, t:"ตรวจสอบ Alipay/WeChat/PromptPay",d:"ยอด/วันที่/ชื่อ"},
      {n:53, t:"เช็คยอดเข้าจริง",             d:"Wallet หรือ Mobile Banking"},
      {n:54, t:"แจ้งยืนยันชำระแล้ว",          d:"ทาง DM / WeChat",                ai:true},
      {n:55, t:"แพ็คสินค้า + ส่งพัสดุ",       d:"SF Express/ไปรษณีย์ไทย"},
      {n:56, t:"แจ้งเลข Tracking",             d:"ให้ลูกค้าติดตามพัสดุ",           ai:true},
      {n:57, t:"ลูกค้ารับสินค้า → ขอรีวิว",   d:"รูปถ่ายทาง DM/WeChat",           ai:true},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Analytics", desc:"วิเคราะห์และปรับกลยุทธ์ Content",
    steps:[
      {n:58, t:"นำรีวิวสร้างวิดีโอ Testimonial",d:"ใน iQiyi",                      ai:true},
      {n:59, t:"วิเคราะห์ Creator Analytics",  d:"Views/Watch Time/Fans Growth"},
      {n:60, t:"ปรับ Content Strategy",        d:"วิดีโอ Views สูง → ทำเพิ่ม",    ai:true},
      {n:61, t:"Follow up ลูกค้าหลัง 3–5 วัน",d:"ทาง WeChat",                     ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",blue:"#00a0e9",
  blueBg:"rgba(0,160,233,0.11)",blueBorder:"rgba(0,160,233,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function IQiyiOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× iQiyi 爱奇艺</span>
          </div>
          <span style={{fontSize:12,color:C.blue,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.blue,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.blue:allDone?"rgba(0,160,233,0.3)":C.border}`,background:i===part?C.blueBg:allDone?"rgba(0,160,233,0.07)":"transparent",color:i===part?C.blue:allDone?C.blue:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.blueBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.blue,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.blueBg,color:C.blue,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(0,160,233,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(0,160,233,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.blue:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(0,160,233,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.blue,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Kanit',sans-serif",fontSize:13.5,fontWeight:600,color:checked[s.n]?"rgba(255,255,255,0.35)":C.text,textDecoration:checked[s.n]?"line-through":"none",margin:"0 0 3px"}}>{s.t}</p>
                <p style={{fontSize:11.5,color:C.muted,margin:0,lineHeight:1.5}}>{s.d}</p>
                {s.ai&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:"rgba(29,158,117,0.12)",color:C.green,fontWeight:600}}>🤖 OpenThai AI ช่วยได้</span>}
              </div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9}}>
          {part>0&&<button onClick={()=>setPart(i=>i-1)} style={{flex:1,padding:13,borderRadius:12,cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontFamily:"'Kanit',sans-serif",fontSize:14,fontWeight:600}}>← ย้อนกลับ</button>}
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.blue,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
