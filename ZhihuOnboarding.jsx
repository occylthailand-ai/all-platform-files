/**
 * ZhihuOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Zhihu ตั้งแต่สมัครจนรับเงิน
 * 66 ขั้นตอน ใน 11 ส่วน — Q&A + Content Marketing คนจีนพรีเมี่ยม 100M+
 *
 * วิธีใช้:
 *   import ZhihuOnboarding from './ZhihuOnboarding'
 *   <ZhihuOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Zhihu", desc:"เริ่มต้นสร้าง Zhihu Account",
    steps:[
      {n:1, t:"โหลดแอป Zhihu (知乎)",        d:"App Store/Play Store หรือ zhihu.com"},
      {n:2, t:"กด 注册 + เบอร์/WeChat/Weibo", d:"สมัครด้วยเบอร์หรือ Social"},
      {n:3, t:"ยืนยัน OTP",                   d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี (名字)",          d:"น่าเชื่อถือ ชื่อแบรนด์/ผู้เชี่ยวชาญ", ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",                 d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"เลือก Category ที่สนใจ",       d:"สุขภาพ/อาหาร/ท่องเที่ยว/ความงาม"},
      {n:7, t:"เปิด Notification",             d:"รับแจ้งเตือน Comment และ Follower"},
    ],
  },
  { id:2,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้น่าเชื่อถือ", desc:"โปรไฟล์ดี = คนเชื่อถือ = ซื้อง่ายขึ้น",
    steps:[
      {n:8,  t:"ใส่รูปโปรไฟล์มืออาชีพ",      d:"รูปบุคคล หรือโลโก้แบรนด์"},
      {n:9,  t:"เขียน Bio",                   d:"ตำแหน่ง/ความเชี่ยวชาญ/แบรนด์",      ai:true},
      {n:10, t:"เพิ่ม Education/Work",        d:"เพิ่มความน่าเชื่อถือ"},
      {n:11, t:"ใส่ลิงก์ร้านค้าใน Profile",  d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:12, t:"ตั้ง Headline ความเชี่ยวชาญ",d:"'ผู้เชี่ยวชาญด้าน...' ชัดเจน",       ai:true},
      {n:13, t:"Pin คำถาม/บทความดีที่สุด",   d:"ด้านบนโปรไฟล์"},
      {n:14, t:"เชื่อม WeChat / Weibo",       d:"เพิ่มความน่าเชื่อถือ"},
    ],
  },
  { id:3,  icon:"✅", label:"Creator Account",
    name:"สมัคร Zhihu Creator / Institutional", desc:"ได้ Badge เพิ่มความน่าเชื่อถือ",
    steps:[
      {n:15, t:"Creator Center → 机构号",      d:"สมัคร Institutional Account"},
      {n:16, t:"กรอกข้อมูลธุรกิจ",            d:"ชื่อบริษัท/ทะเบียนพาณิชย์"},
      {n:17, t:"อัปโหลดเอกสาร",               d:"Business License/หลักฐานตัวตน"},
      {n:18, t:"รอ Zhihu ตรวจสอบ 3–7 วัน",   d:""},
      {n:19, t:"ได้รับ Institutional Badge ✓", d:"เพิ่มความน่าเชื่อถือ"},
      {n:20, t:"เปิด Creator Dashboard",        d:"Analytics และ Revenue"},
    ],
  },
  { id:4,  icon:"✍️", label:"สร้าง Content",
    name:"สร้าง Content ประเภทต่างๆ", desc:"AI เขียนคำตอบ Q&A + บทความจีนทุกวัน",
    steps:[
      {n:21, t:"ตอบคำถาม (回答)",              d:"ค้นหาคำถามเกี่ยวสินค้า ตอบละเอียด",  ai:true},
      {n:22, t:"เขียนบทความ (文章)",           d:"รีวิวสินค้า/วิธีใช้/ประโยชน์",        ai:true},
      {n:23, t:"เขียน Idea (想法)",            d:"โพสต์สั้น 140 ตัวอักษร คล้าย Twitter", ai:true},
      {n:24, t:"สร้าง Column (专栏)",          d:"รวมบทความหัวข้อเดียวกัน"},
      {n:25, t:"ใส่รูปสินค้าคุณภาพสูง",       d:"ในบทความ/คำตอบ"},
      {n:26, t:"ใส่ลิงก์สินค้าใน Content",    d:"Taobao/Pinduoduo/JD.com"},
      {n:27, t:"เขียน Headline ดึงดูด",        d:"ตั้งคำถามหรือบอกประโยชน์ชัด",         ai:true},
      {n:28, t:"ใส่ Keyword จีนใน Title",     d:"ที่คนจีนค้นหาบ่อย",                   ai:true},
      {n:29, t:"ตอบคำถาม 1–3 ครั้ง/วัน",     d:"สม่ำเสมอ"},
      {n:30, t:"ติดตาม Topic เกี่ยวข้อง",    d:"ตอบคำถามใหม่ๆ เสมอ"},
    ],
  },
  { id:5,  icon:"🎥", label:"Live & Video",
    name:"ใช้ Zhihu Live และ Video", desc:"เพิ่ม Engagement และ Trust",
    steps:[
      {n:31, t:"สร้าง Zhihu Live (Live Talk)", d:"สอนหรือแชร์ความรู้เกี่ยวสินค้า",     ai:true},
      {n:32, t:"ตั้งราคา Live Talk",           d:"ฟรี หรือมีค่าธรรมเนียม"},
      {n:33, t:"อัปโหลด Video Content",        d:"เพิ่ม Engagement ใน Zhihu"},
      {n:34, t:"ใช้ Salt Video (盐选视频)",    d:"สำหรับ Premium Content"},
      {n:35, t:"แชร์ Link Live/Video",         d:"WeChat/Weibo ดึง Traffic"},
    ],
  },
  { id:6,  icon:"💎", label:"Salt Selection",
    name:"Zhihu Salt Selection Premium", desc:"รายได้จาก Subscription",
    steps:[
      {n:36, t:"สมัคร Salt Selection Creator", d:"盐选作者"},
      {n:37, t:"สร้าง Premium Content/E-book", d:"เกี่ยวข้องกับสินค้า",               ai:true},
      {n:38, t:"ตั้งราคา Premium Content",     d:"สมาชิกจ่ายเพื่ออ่าน"},
      {n:39, t:"รับรายได้จาก Subscription",   d:"Salt Selection Revenue"},
    ],
  },
  { id:7,  icon:"📢", label:"ZH Ads",
    name:"Zhihu Advertising", desc:"โฆษณาในรูปแบบ Q&A ดูเป็นธรรมชาติ",
    steps:[
      {n:40, t:"เข้า Zhihu Marketing Platform",d:"知乎营销平台"},
      {n:41, t:"สร้าง Knowledge Ads",          d:"知识广告 โฆษณาในรูป Q&A",            ai:true},
      {n:42, t:"ตั้ง Target Audience",          d:"อายุ/การศึกษา/ความสนใจ/ภูมิภาค",    ai:true},
      {n:43, t:"ติดตาม CTR/Engagement/CVR",   d:"Dashboard"},
    ],
  },
  { id:8,  icon:"🔗", label:"ดึง Traffic",
    name:"ดึง Traffic จาก Zhihu ไปร้านค้า", desc:"Zhihu → WeChat / Taobao",
    steps:[
      {n:44, t:"ใส่ลิงก์ร้านค้าในทุก Content", d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:45, t:"เพิ่ม WeChat ID ในโปรไฟล์",   d:"ให้ลูกค้าเพิ่มเพื่อนได้เลย"},
      {n:46, t:"สร้าง QR Code WeChat ใน Bio", d:"หรือในบทความ"},
      {n:47, t:"บอกให้ DM WeChat เพื่อสั่งซื้อ",d:"ในคำตอบและบทความ"},
      {n:48, t:"แชร์ Content ไป WeChat/Weibo", d:"ขยาย Reach"},
    ],
  },
  { id:9,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง DM",
    steps:[
      {n:49, t:"รับ DM จากลูกค้า Zhihu/WeChat",d:"แจ้งเตือนทันที"},
      {n:50, t:"ตอบคำถามสินค้า/ราคา/สั่งซื้อ", d:"ตอบเร็ว = ปิดขายสูง",              ai:true},
      {n:51, t:"ส่งรูปสินค้า/ลิงก์ใน DM",      d:"ข้อมูลเพิ่มเติม"},
      {n:52, t:"ยืนยันออร์เดอร์",              d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:53, t:"แจ้งราคารวม",                  d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:54, t:"ส่ง QR PromptPay/Alipay/WeChat",d:"ให้ลูกค้าชำระ"},
    ],
  },
  { id:10, icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"เช็คเงินเข้าและส่งสินค้า",
    steps:[
      {n:55, t:"ตรวจสอบ Alipay/WeChat/PromptPay",d:"ยอด/วันที่/ชื่อ"},
      {n:56, t:"เช็คยอดเข้าจริง",               d:"Wallet หรือ Mobile Banking"},
      {n:57, t:"แจ้งยืนยันชำระแล้ว",            d:"ข้อความยืนยันทาง DM",             ai:true},
      {n:58, t:"บันทึกออร์เดอร์ลงระบบ",         d:"Excel/Google Sheets"},
      {n:59, t:"แพ็คสินค้า + ส่งพัสดุ",          d:"SF Express/ไปรษณีย์ไทย"},
      {n:60, t:"แจ้งเลข Tracking ทาง DM",       d:"ให้ลูกค้าติดตามพัสดุ",            ai:true},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Retention", desc:"รักษาลูกค้าจีนพรีเมี่ยม",
    steps:[
      {n:61, t:"ลูกค้ารับสินค้า → ขอรีวิว",    d:"ทาง DM",                           ai:true},
      {n:62, t:"นำรีวิวเขียนเป็น Case Study",  d:"บทความใน Zhihu",                   ai:true},
      {n:63, t:"ตอบ Comment ในบทความ/คำตอบ",   d:"ทุกวัน",                           ai:true},
      {n:64, t:"Follow up หลัง 3–5 วัน",       d:"WeChat/Zhihu DM",                  ai:true},
      {n:65, t:"เพิ่มลูกค้าเข้า WeChat VIP",   d:"รับโปรโมชั่นพิเศษ"},
      {n:66, t:"วิเคราะห์ Zhihu Analytics",    d:"Views สูง → ทำเพิ่ม",              ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",blue:"#006aff",
  blueBg:"rgba(0,106,255,0.11)",blueBorder:"rgba(0,106,255,0.25)",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function ZhihuOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Zhihu 知乎</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.blue:allDone?"rgba(0,106,255,0.3)":C.border}`,background:i===part?C.blueBg:allDone?"rgba(0,106,255,0.07)":"transparent",color:i===part?C.blue:allDone?C.blue:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(0,106,255,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(0,106,255,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.blue:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(0,106,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.blue,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
