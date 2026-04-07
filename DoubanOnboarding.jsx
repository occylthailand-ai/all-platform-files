/**
 * DoubanOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Douban ตั้งแต่สมัครจนรับเงิน
 * 58 ขั้นตอน ใน 10 ส่วน — Cultural + Lifestyle คนจีนรสนิยมดี 60M+
 *
 * วิธีใช้:
 *   import DoubanOnboarding from './DoubanOnboarding'
 *   <DoubanOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี Douban", desc:"เริ่มต้นสร้าง Douban Account",
    steps:[
      {n:1, t:"โหลดแอป Douban (豆瓣)",        d:"App Store/Play Store หรือ douban.com"},
      {n:2, t:"กด 注册 + เบอร์จีน/WeChat",    d:"สมัครด้วยเบอร์หรือ WeChat"},
      {n:3, t:"ยืนยัน OTP",                   d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชี (昵称)",          d:"สื่อถึงแบรนด์ด้านวัฒนธรรม",       ai:true},
      {n:5, t:"ตั้งรหัสผ่าน",                 d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"เลือก Interest Tag",            d:"หนังสือ/ภาพยนตร์/ดนตรี/ท่องเที่ยว"},
      {n:7, t:"เปิด Notification",             d:"รับแจ้งเตือน Comment และ Message"},
    ],
  },
  { id:2,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้น่าเชื่อถือ", desc:"โปรไฟล์ Artistic = ลูกค้าเชื่อถือ",
    steps:[
      {n:8,  t:"ใส่รูปโปรไฟล์ Artistic",      d:"รูปสวย มีความ Cultural"},
      {n:9,  t:"เขียน Bio",                   d:"ความเชี่ยวชาญ/สินค้า/จุดเด่น",    ai:true},
      {n:10, t:"เพิ่ม Location",              d:"ไทย หรือเมืองเกี่ยวข้องสินค้า"},
      {n:11, t:"เชื่อม WeChat / Weibo",       d:"เพิ่มความน่าเชื่อถือ"},
      {n:12, t:"ใส่ลิงก์ร้านค้าใน Profile",  d:"Taobao/WeChat Shop/เว็บไซต์"},
      {n:13, t:"Pin รีวิว/โพสต์ที่ดีสุด",    d:"ด้านบนโปรไฟล์"},
    ],
  },
  { id:3,  icon:"👥", label:"Douban Group",
    name:"เข้าร่วมและสร้าง Douban Group", desc:"ชุมชน Niche ตรงกลุ่มเป้าหมาย",
    steps:[
      {n:14, t:"ค้นหา Group เกี่ยวข้องสินค้า", d:"'ของดีจากไทย'/'Handmade'/'ธรรมชาติ'"},
      {n:15, t:"เข้าร่วม Group มีสมาชิกมาก",  d:"มีส่วนร่วมก่อน สร้างความน่าเชื่อถือ"},
      {n:16, t:"สร้าง Douban Group ใหม่",      d:"ชื่อ + หมวด + คำอธิบาย",          ai:true},
      {n:17, t:"ตั้ง Group Rules",             d:"กฎการโพสต์ วิธีสั่งซื้อ"},
      {n:18, t:"โพสต์แนะนำสินค้าใน Group",    d:"รูป + รายละเอียด + ราคา + วิธีสั่ง", ai:true},
      {n:19, t:"เชิญสมาชิกเข้า Group",         d:""},
      {n:20, t:"ดูแล Group สม่ำเสมอ",         d:"ตอบคำถาม กระตุ้น Engagement",      ai:true},
    ],
  },
  { id:4,  icon:"✍️", label:"สร้าง Content",
    name:"สร้างคอนเทนต์ประเภทต่างๆ", desc:"AI เขียนรีวิว Blog + โพสต์จีนทุกวัน",
    steps:[
      {n:21, t:"เขียน 日记 (Diary/Blog)",      d:"รีวิวสินค้าเชิงลึก วิธีใช้",        ai:true},
      {n:22, t:"โพสต์ 广播 (Broadcast)",      d:"โพสต์สั้น + รูปสินค้า",            ai:true},
      {n:23, t:"สร้าง 相册 (Photo Album)",    d:"Gallery สินค้าสวยงาม"},
      {n:24, t:"เขียนรีวิวใน 书影音",          d:"สินค้าเกี่ยวหนังสือ/ดนตรี/ศิลปะ"},
      {n:25, t:"ใส่ลิงก์สินค้าใน Post",       d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:26, t:"เขียน Caption Aesthetic",     d:"ภาษาจีนที่มีความ Cultural",         ai:true},
      {n:27, t:"ใส่ Tag หัวข้อเกี่ยวข้อง",   d:"#泰国好物 #手工艺品 #天然草药",      ai:true},
      {n:28, t:"โพสต์ 1–2 ครั้ง/วัน",       d:"ช่วงเช้าและเย็น สม่ำเสมอ"},
    ],
  },
  { id:5,  icon:"🛍️", label:"Douban Market",
    name:"ใช้ Douban Market ขายสินค้า", desc:"ร้านค้าในแพลตฟอร์ม Douban",
    steps:[
      {n:29, t:"Douban → Market → สมัครร้าน", d:"เปิดร้านค้า"},
      {n:30, t:"กรอกข้อมูลร้านค้า",            d:"ชื่อร้าน/ประเภท/คำอธิบาย",         ai:true},
      {n:31, t:"เพิ่มสินค้า",                  d:"ชื่อ/รายละเอียด/ราคา/รูป/สต็อก",   ai:true},
      {n:32, t:"ตั้งค่าการจัดส่ง",             d:"และนโยบายร้านค้า"},
      {n:33, t:"เปิดร้านให้ลูกค้าสั่งซื้อ",   d:""},
    ],
  },
  { id:6,  icon:"📋", label:"Douban List",
    name:"สร้าง Douban List และ Collections", desc:"รายการสินค้าแนะนำ สร้าง Trust",
    steps:[
      {n:34, t:"สร้าง 豆列 (Douban List)",    d:"'ของดีจากไทยที่ต้องลอง'",           ai:true},
      {n:35, t:"เพิ่มสินค้า/บทความ/รีวิว",   d:"เข้า List"},
      {n:36, t:"แชร์ List ใน Group/Broadcast",d:""},
      {n:37, t:"ให้ลูกค้า Follow List",       d:"รับอัปเดตใหม่"},
    ],
  },
  { id:7,  icon:"🔗", label:"ดึง Traffic",
    name:"ดึง Traffic จาก Douban ไปร้านค้า", desc:"Douban → WeChat / Taobao",
    steps:[
      {n:38, t:"ใส่ลิงก์ร้านค้าในทุกโพสต์",  d:"Taobao/WeChat Shop/Pinduoduo"},
      {n:39, t:"เพิ่ม WeChat ID ใน Bio",      d:"ให้ลูกค้าเพิ่มเพื่อนได้เลย"},
      {n:40, t:"บอกให้ DM WeChat/Douban",    d:"เพื่อสั่งซื้อในทุกโพสต์"},
      {n:41, t:"แชร์โพสต์ไป Weibo/WeChat",  d:"ขยาย Reach"},
    ],
  },
  { id:8,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง Message",
    steps:[
      {n:42, t:"รับ Douban Message (私信)",    d:"คำสั่งซื้อจากลูกค้า"},
      {n:43, t:"รับออร์เดอร์ผ่าน WeChat",    d:"ถ้าลูกค้าเพิ่มเพื่อนมา"},
      {n:44, t:"ตอบคำถามสินค้า/ราคา/สั่ง",   d:"ตอบเร็ว = ปิดขายสูง",              ai:true},
      {n:45, t:"ยืนยันออร์เดอร์",             d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:46, t:"แจ้งราคารวม",                d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:47, t:"ส่ง QR Alipay/WeChat/PromptPay",d:"ให้ลูกค้าชำระ"},
    ],
  },
  { id:9,  icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"เช็คเงินเข้าและส่งสินค้า",
    steps:[
      {n:48, t:"ตรวจสอบ Alipay/WeChat/PromptPay",d:"ยอด/วันที่/ชื่อ"},
      {n:49, t:"เช็คยอดเข้าจริง",              d:"Wallet หรือ Mobile Banking"},
      {n:50, t:"แจ้งยืนยันชำระแล้ว",           d:"Douban Message หรือ WeChat",       ai:true},
      {n:51, t:"บันทึกออร์เดอร์ลงระบบ",        d:"Excel/Google Sheets"},
      {n:52, t:"แพ็คสินค้า + ส่งพัสดุ",        d:"SF Express/ไปรษณีย์ไทย"},
      {n:53, t:"แจ้งเลข Tracking",              d:"ให้ลูกค้าติดตามพัสดุ",            ai:true},
    ],
  },
  { id:10, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Retention", desc:"รักษาลูกค้าจีนรสนิยมดี",
    steps:[
      {n:54, t:"ลูกค้ารับสินค้า → ขอรีวิว",   d:"ใน Douban หรือ WeChat",            ai:true},
      {n:55, t:"นำรีวิวเขียนเป็น Blog Post",   d:"ใน Douban",                        ai:true},
      {n:56, t:"Follow up หลัง 3–5 วัน",      d:"Message / WeChat",                 ai:true},
      {n:57, t:"เพิ่มลูกค้าเข้า WeChat VIP",   d:"รับโปรโมชั่นพิเศษ"},
      {n:58, t:"วิเคราะห์ Engagement",         d:"โพสต์ไหนสูง → ทำเพิ่ม",           ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",dgreen:"#00ac62",
  dgreenBg:"rgba(0,172,98,0.11)",dgreenBorder:"rgba(0,172,98,0.25)",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function DoubanOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Douban 豆瓣</span>
          </div>
          <span style={{fontSize:12,color:C.dgreen,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.dgreen,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.dgreen:allDone?"rgba(0,172,98,0.3)":C.border}`,background:i===part?C.dgreenBg:allDone?"rgba(0,172,98,0.07)":"transparent",color:i===part?C.dgreen:allDone?C.dgreen:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.dgreenBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.dgreen,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.dgreenBg,color:C.dgreen,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(0,172,98,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(0,172,98,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.dgreen:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.dgreen:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(0,172,98,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.dgreen,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.dgreen,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
