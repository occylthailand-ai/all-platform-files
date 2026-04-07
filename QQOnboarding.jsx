/**
 * QQOnboarding.jsx
 * Wizard พา Creator ตั้งค่า QQ ตั้งแต่สมัครจนรับเงิน
 * 63 ขั้นตอน ใน 11 ส่วน — QQ Group + Community คนจีนรุ่นใหม่ 600M+
 *
 * วิธีใช้:
 *   import QQOnboarding from './QQOnboarding'
 *   <QQOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี QQ", desc:"เริ่มต้นสร้าง QQ Account",
    steps:[
      {n:1, t:"โหลดแอป QQ",                   d:"App Store/Play Store หรือ qq.com"},
      {n:2, t:"กด 注册账号 + ใส่เบอร์จีน",      d:"สมัครด้วยเบอร์มือถือ"},
      {n:3, t:"ยืนยัน OTP",                    d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ได้รับ QQ Number",               d:"เลขประจำตัว 9-10 หลัก อัตโนมัติ"},
      {n:5, t:"ตั้งชื่อ QQ Nickname",           d:"สื่อถึงแบรนด์สินค้า",             ai:true},
      {n:6, t:"ใส่รูปโปรไฟล์แบรนด์",          d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:7, t:"เปิด Notification",              d:"รับแจ้งเตือนข้อความและออร์เดอร์"},
    ],
  },
  { id:2,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ QQ ให้พร้อมขาย", desc:"โปรไฟล์ดี ลูกค้าจีนเชื่อถือมากขึ้น",
    steps:[
      {n:8,  t:"เขียน Bio (个性签名) 50 ตัว",   d:"ขายอะไร ราคา วิธีสั่งซื้อ",       ai:true},
      {n:9,  t:"ตั้ง QQ Level",                d:"เพิ่ม Activity Level สูง = น่าเชื่อ"},
      {n:10, t:"เปิด QQ Zone (空间)",           d:"บล็อก/โซเชียลในตัว QQ"},
      {n:11, t:"ใส่ลิงก์ร้านค้าใน Bio",        d:"Taobao/WeChat Shop/Pinduoduo"},
      {n:12, t:"เพิ่ม WeChat ID ใน Bio",       d:"สำหรับลูกค้าต้องการติดต่อ"},
      {n:13, t:"ตั้งค่า Privacy",              d:"ใครเพิ่มเพื่อนได้ / ใครเห็น Zone"},
    ],
  },
  { id:3,  icon:"👥", label:"QQ Group",
    name:"สร้างและจัดการ QQ Group", desc:"ชุมชนลูกค้าเหนียวแน่น",
    steps:[
      {n:14, t:"กด + → สร้าง QQ Group",        d:""},
      {n:15, t:"ตั้งชื่อ Group",               d:"สื่อถึงสินค้าหรือแบรนด์",          ai:true},
      {n:16, t:"เลือกหมวด Group",              d:"สินค้า/ท่องเที่ยว/ความงาม/อาหาร"},
      {n:17, t:"ตั้ง Group Notice (公告)",      d:"ประกาศสินค้า โปรโมชั่น วิธีสั่ง",   ai:true},
      {n:18, t:"เชิญลูกค้าเข้า Group",         d:""},
      {n:19, t:"ตั้ง Group Bot (机器人)",       d:"Auto Reply คำถามที่พบบ่อย",        ai:true},
      {n:20, t:"แบ่ง Group หลายระดับ",         d:"VIP / ทั่วไป / Wholesale"},
    ],
  },
  { id:4,  icon:"📝", label:"QQ Zone Content",
    name:"ใช้ QQ Zone สร้างคอนเทนต์", desc:"AI เขียนโพสต์จีนให้ทุกวัน",
    steps:[
      {n:21, t:"QQ Zone → สร้างโพสต์",         d:"รูปสินค้า + Caption จีน",           ai:true},
      {n:22, t:"อัปโหลดรูปสินค้า สูงสุด 9 รูป", d:"คุณภาพสูง พื้นหลังสะอาด"},
      {n:23, t:"เขียน Caption ภาษาจีน",        d:"รีวิว/วิธีใช้/ราคา",               ai:true},
      {n:24, t:"แนบลิงก์สินค้า",              d:"Taobao/Pinduoduo/WeChat Shop"},
      {n:25, t:"ใส่ Hashtag เกี่ยวข้องสินค้า", d:""},
      {n:26, t:"โพสต์ 2–3 ครั้ง/วัน",        d:"สม่ำเสมอ"},
      {n:27, t:"แชร์ QQ Zone เข้าทุก Group", d:"ขยาย Reach"},
    ],
  },
  { id:5,  icon:"📧", label:"QQ Mail",
    name:"ใช้ QQ Mail สำหรับ Email Marketing", desc:"Newsletter หาลูกค้า @qq.com",
    steps:[
      {n:28, t:"ใช้ QQ Email (@qq.com)",       d:"ส่ง Newsletter หาลูกค้า"},
      {n:29, t:"สร้าง Email Template",         d:"โปรโมชั่น/สินค้าใหม่/ส่วนลด",     ai:true},
      {n:30, t:"ส่ง Email ทุกสัปดาห์",        d:"หาลูกค้าที่ Subscribe"},
      {n:31, t:"ติดตาม Open Rate/Click Rate",  d:"QQ Mail Dashboard"},
    ],
  },
  { id:6,  icon:"🏢", label:"QQ Business",
    name:"สมัคร QQ Business", desc:"บัญชีธุรกิจเพิ่มความน่าเชื่อถือ",
    steps:[
      {n:32, t:"สมัคร QQ for Business",        d:"企业QQ ที่ b.qq.com"},
      {n:33, t:"กรอกข้อมูลธุรกิจ",            d:"ชื่อบริษัท/ทะเบียน/อีเมล"},
      {n:34, t:"ได้รับ Business QQ Number",    d:"เพิ่มความน่าเชื่อถือ"},
      {n:35, t:"เปิด Multi-agent Support",     d:"ทีมตอบ Chat ได้หลายคน"},
      {n:36, t:"เชื่อม WeChat Official",       d:"ข้ามแพลตฟอร์ม"},
    ],
  },
  { id:7,  icon:"🛍️", label:"QQ Mall",
    name:"ใช้ QQ Mini App และ QQ Mall", desc:"ร้านค้าในแอป QQ",
    steps:[
      {n:37, t:"QQ → Mini App → QQ Mini Shop", d:"ค้นหาและเปิดร้าน"},
      {n:38, t:"สมัครเปิดร้านใน QQ Mall",      d:"QQ小店"},
      {n:39, t:"เพิ่มสินค้า",                 d:"ชื่อ/ราคา/รูปภาพ/สต็อก",           ai:true},
      {n:40, t:"เชื่อม QQ Pay",               d:"รับชำระเงินจากลูกค้า"},
    ],
  },
  { id:8,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อใน Chat + Group",
    steps:[
      {n:41, t:"รับข้อความสั่งซื้อใน QQ Chat", d:"1:1 หรือ Group Chat"},
      {n:42, t:"รับออร์เดอร์ใน QQ Group",      d:"ตอบในกลุ่มหรือ DM"},
      {n:43, t:"ตอบคำถามสินค้า/ราคา/สั่ง",    d:"ตอบเร็ว = ปิดขายสูง",             ai:true},
      {n:44, t:"ส่งรูปสินค้า/วิดีโอรีวิว",    d:"ข้อมูลเพิ่มใน Chat"},
      {n:45, t:"ยืนยันออร์เดอร์",             d:"สินค้า/จำนวน/ที่อยู่"},
      {n:46, t:"แจ้งราคารวม",                d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:47, t:"ส่ง QQ Pay/WeChat/Alipay/PromptPay",d:"ให้ลูกค้าเลือกวิธีชำระ"},
    ],
  },
  { id:9,  icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบการชำระและยืนยัน", desc:"เช็คเงินเข้าและยืนยันลูกค้า",
    steps:[
      {n:48, t:"ตรวจสอบ QQ Pay/WeChat/Alipay",  d:"ยอด/วันที่/ชื่อผู้โอน"},
      {n:49, t:"เช็คยอดเข้าจริง",              d:"QQ Wallet/WeChat/Mobile Banking"},
      {n:50, t:"แจ้งยืนยันชำระแล้ว",           d:"ข้อความยืนยันทาง QQ Chat",       ai:true},
      {n:51, t:"บันทึกออร์เดอร์ลงระบบ",        d:"Excel/Google Sheets"},
      {n:52, t:"ออก Order Confirmation",        d:"ให้ลูกค้าทาง Chat",              ai:true},
    ],
  },
  { id:10, icon:"📦", label:"จัดส่ง",
    name:"แพ็คและจัดส่งสินค้า", desc:"ส่งสินค้าให้ถึงมือลูกค้า",
    steps:[
      {n:53, t:"แพ็คสินค้า + ใบปะหน้า",        d:"เขียนที่อยู่ลูกค้าชัดเจน"},
      {n:54, t:"ส่งพัสดุกับขนส่ง",             d:"SF Express/YTO/ZTO/ไปรษณีย์"},
      {n:55, t:"แจ้ง Tracking ทาง QQ Chat",    d:"ให้ลูกค้าติดตามพัสดุ",           ai:true},
      {n:56, t:"ลูกค้าติดตามพัสดุ",             d:"แอปขนส่งหรือเว็บไซต์"},
      {n:57, t:"ลูกค้ารับสินค้าแล้ว",           d:"ขอรีวิวทาง QQ Chat",             ai:true},
    ],
  },
  { id:11, icon:"⭐", label:"ถอนเงิน+หลังขาย",
    name:"ถอนเงินและหลังการขาย", desc:"รักษาลูกค้าจีนรุ่นใหม่",
    steps:[
      {n:58, t:"QQ Wallet → Withdraw",          d:"โอนไปบัญชีธนาคารจีน"},
      {n:59, t:"แลกเงินหยวน → บาท",           d:"ธนาคารหรือ Money Changer"},
      {n:60, t:"ขอรีวิวและรูปถ่าย",            d:"จากลูกค้าหลังรับสินค้า",          ai:true},
      {n:61, t:"โพสต์รีวิวใน QQ Zone/Group",  d:"สร้าง Social Proof",              ai:true},
      {n:62, t:"Follow up หลัง 3–5 วัน",      d:"ถามความพอใจ แนะนำเพิ่ม",         ai:true},
      {n:63, t:"วิเคราะห์ยอดขาย + Group Activity",d:"ปรับกลยุทธ์ให้ดีขึ้น",       ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",cyan:"#12b7f5",
  cyanBg:"rgba(18,183,245,0.11)",cyanBorder:"rgba(18,183,245,0.25)",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function QQOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× QQ 腾讯QQ</span>
          </div>
          <span style={{fontSize:12,color:C.cyan,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.cyan,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.cyan:allDone?"rgba(18,183,245,0.3)":C.border}`,background:i===part?C.cyanBg:allDone?"rgba(18,183,245,0.07)":"transparent",color:i===part?C.cyan:allDone?C.cyan:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.cyanBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.cyan,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.cyanBg,color:C.cyan,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(18,183,245,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(18,183,245,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.cyan:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.cyan:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#000",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(18,183,245,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.cyan,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.cyan,color:"#000",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:700}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
