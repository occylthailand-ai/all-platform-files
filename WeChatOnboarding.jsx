/**
 * WeChatOnboarding.jsx
 * Wizard พา Creator ตั้งค่า WeChat ตั้งแต่สมัครจนรับเงิน
 * 66 ขั้นตอน ใน 11 ส่วน — tick ✓ ได้ทีละข้อ
 *
 * วิธีใช้:
 *   import WeChatOnboarding from './WeChatOnboarding'
 *   <WeChatOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี WeChat", desc:"เริ่มต้นสร้าง WeChat Account",
    steps:[
      {n:1, t:"โหลดแอป WeChat",             d:"Play Store / App Store"},
      {n:2, t:"กด Sign Up + ใส่เบอร์",      d:"รองรับเบอร์ไทย"},
      {n:3, t:"ยืนยัน OTP",                d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อโปรไฟล์ + รูป",     d:"สื่อถึงแบรนด์หรือสินค้า"},
      {n:5, t:"ตั้งรหัสผ่าน WeChat",        d:"อย่างน้อย 8 ตัวอักษร"},
      {n:6, t:"ยืนยันตัวตนผ่านเพื่อน",     d:"WeChat ต้องการผู้ใช้เดิมยืนยัน", note:true},
      {n:7, t:"ตั้งค่า Privacy",            d:"ใครเพิ่มเป็นเพื่อนได้บ้าง"},
      {n:8, t:"เปิด Notification",          d:"รับแจ้งเตือนข้อความและออร์เดอร์"},
    ],
  },
  { id:2,  icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์สำหรับขายของ", desc:"โปรไฟล์ดี ลูกค้าเชื่อถือมากขึ้น",
    steps:[
      {n:9,  t:"ตั้งชื่อ WeChat ID",        d:"จำง่าย เปลี่ยนได้ครั้งเดียว"},
      {n:10, t:"เขียน Bio / Status",        d:"ขายอะไร ราคาเริ่มต้น",            ai:true},
      {n:11, t:"ใส่รูปโปรไฟล์แบรนด์",     d:"รูปชัดเจน สื่อถึงสินค้า"},
      {n:12, t:"ตั้งรูปปก Cover Photo",     d:"แสดงสินค้าหรือโปรโมชั่น"},
      {n:13, t:"แชร์ WeChat ID + QR Code", d:"ให้ลูกค้าเพิ่มเพื่อนได้เลย"},
    ],
  },
  { id:3,  icon:"💳", label:"WeChat Pay",
    name:"ตั้งค่า WeChat Pay", desc:"รับชำระเงินจากลูกค้าจีน",
    steps:[
      {n:14, t:"Me → WeChat Pay → สมัคร",  d:"เริ่มตั้งค่า WeChat Pay"},
      {n:15, t:"ยืนยันตัวตน",              d:"บัตรประชาชนหรือ Passport"},
      {n:16, t:"ผูกบัตรเดบิต / เครดิต",   d:"หรือบัญชีธนาคาร"},
      {n:17, t:"ตั้ง Payment Password",    d:"6 หลัก ใช้ยืนยันทุกธุรกรรม"},
      {n:18, t:"เปิด Receive Money QR",   d:"ลูกค้าสแกนจ่ายได้เลย"},
      {n:19, t:"ตั้งค่า Withdrawal",       d:"โอนเงินออกไปบัญชีธนาคาร"},
      {n:20, t:"ทดสอบรับ-ส่งเงิน",        d:"ทดสอบก่อนใช้งานจริง",            note:true},
    ],
  },
  { id:4,  icon:"🏢", label:"Official Account",
    name:"สร้าง WeChat Official Account", desc:"บัญชีร้านค้ามืออาชีพ",
    steps:[
      {n:21, t:"ไปที่ mp.weixin.qq.com",   d:"สมัคร Official Account"},
      {n:22, t:"เลือกประเภท Account",      d:"Subscription / Service Account"},
      {n:23, t:"กรอกข้อมูลธุรกิจ",        d:"ชื่อร้าน / ประเภท / เอกสาร"},
      {n:24, t:"ยืนยันด้วยเอกสารธุรกิจ",  d:"ทะเบียนพาณิชย์ (Service Account)"},
      {n:25, t:"ตั้งชื่อ + รูปโปรไฟล์",   d:"ชื่อร้านที่จำง่าย สื่อถึงแบรนด์"},
      {n:26, t:"เขียน Bio ร้านค้า",        d:"ขายอะไร ราคา วิธีสั่งซื้อ",       ai:true},
      {n:27, t:"เปิด Auto Reply",          d:"ข้อความต้อนรับเมื่อมีคน Follow",   ai:true},
    ],
  },
  { id:5,  icon:"🏪", label:"Mini Program",
    name:"ตั้งค่า WeChat Mini Program", desc:"ร้านค้าออนไลน์ในแอป WeChat",
    steps:[
      {n:28, t:"สมัคร Mini Program",       d:"WeChat Open Platform"},
      {n:29, t:"เลือก Template ร้านค้า",   d:"หรือพัฒนาเอง"},
      {n:30, t:"เพิ่มสินค้า",              d:"ชื่อ/รายละเอียด/ราคา/รูป/สต็อก",   ai:true},
      {n:31, t:"ตั้งค่าการจัดส่ง",         d:"ค่าส่ง/พื้นที่/บริษัทขนส่ง"},
      {n:32, t:"เชื่อม WeChat Pay",        d:"รับชำระผ่าน Mini Program"},
      {n:33, t:"เผยแพร่ Mini Program",     d:"ลูกค้าค้นหาและใช้งานได้เลย"},
    ],
  },
  { id:6,  icon:"📣", label:"สร้าง Content",
    name:"สร้างคอนเทนต์และโปรโมท", desc:"AI เขียนโพสต์จีน-ไทย ให้ทุกวัน",
    steps:[
      {n:34, t:"โพสต์ใน Moments (朋友圈)",  d:"รูป/วิดีโอ/ข้อความสินค้า",         ai:true},
      {n:35, t:"โพสต์ 3–5 ครั้ง/วัน",     d:"คุณภาพสำคัญกว่าปริมาณ"},
      {n:36, t:"ใช้ WeChat Channels",      d:"วิดีโอสั้นคล้าย TikTok",           ai:true},
      {n:37, t:"Live บน WeChat Channels", d:"ขายของสดครอบคลุมลูกค้าจีน",        ai:true},
      {n:38, t:"ส่ง Broadcast โปรโมชั่น", d:"Official Account หาลูกค้าทุกคน",   ai:true},
      {n:39, t:"สร้าง Group Chat VIP",    d:"โปรโมชั่นพิเศษลูกค้าประจำ"},
      {n:40, t:"แชร์ QR ข้ามแพลตฟอร์ม",  d:"TikTok/LINE/FB ดึงลูกค้าเข้า WeChat"},
    ],
  },
  { id:7,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อใน WeChat Chat",
    steps:[
      {n:41, t:"รับข้อความสั่งซื้อใน Chat", d:"แจ้งเตือนทันทีเมื่อมีออร์เดอร์"},
      {n:42, t:"ตอบคำถามสินค้า / ราคา",    d:"ตอบเร็ว 5 นาที = ปิดการขายสูง",   ai:true},
      {n:43, t:"ส่งรูปสินค้า / วิดีโอ",    d:"ข้อมูลเพิ่มเติมใน Chat"},
      {n:44, t:"ยืนยันออร์เดอร์",          d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:45, t:"แจ้งราคารวม",             d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:46, t:"ส่ง WeChat Pay QR / PromptPay", d:"ให้ลูกค้าเลือกวิธีชำระ"},
      {n:47, t:"รอยืนยันจาก WeChat Pay",  d:"หรือสลิป PromptPay"},
    ],
  },
  { id:8,  icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบและยืนยันชำระเงิน", desc:"เช็คเงินเข้าและยืนยันลูกค้า",
    steps:[
      {n:48, t:"ตรวจสอบ WeChat Pay / สลิป", d:"ยอด/วันที่/ชื่อผู้โอน"},
      {n:49, t:"เช็คยอดเข้าจริง",          d:"WeChat Pay Wallet หรือ Mobile Banking"},
      {n:50, t:"แจ้งยืนยันชำระแล้ว",       d:"ส่งข้อความยืนยันทาง Chat",          ai:true},
      {n:51, t:"บันทึกออร์เดอร์ลงระบบ",   d:"Excel/Google Sheets/Mini Program"},
      {n:52, t:"ออก Receipt ให้ลูกค้า",    d:"Order Confirmation ทาง Chat",       ai:true},
    ],
  },
  { id:9,  icon:"📦", label:"จัดส่ง",
    name:"แพ็คและจัดส่งสินค้า", desc:"ส่งสินค้าให้ถึงมือลูกค้า",
    steps:[
      {n:53, t:"แพ็คสินค้า + ใบปะหน้า",   d:"เขียนที่อยู่ลูกค้าชัดเจน"},
      {n:54, t:"ส่งพัสดุกับขนส่ง",         d:"Flash/Kerry/J&T/ไปรษณีย์/Kerry จีน"},
      {n:55, t:"แจ้ง Tracking ทาง WeChat", d:"ส่ง Tracking Number ให้ลูกค้า",    ai:true},
      {n:56, t:"ลูกค้าติดตามพัสดุ",        d:"แอปขนส่งหรือเว็บไซต์"},
      {n:57, t:"ลูกค้ารับสินค้าแล้ว",      d:"ขอรีวิวทาง WeChat Chat",            ai:true},
    ],
  },
  { id:10, icon:"💰", label:"ถอนเงิน",
    name:"ถอนเงินและจัดการรายได้", desc:"โอนเงินจาก WeChat Pay เข้าธนาคาร",
    steps:[
      {n:58, t:"WeChat Pay → Wallet → Withdraw", d:"เลือกบัญชีธนาคารที่ผูกไว้"},
      {n:59, t:"โอนเงินออกบัญชีธนาคาร",    d:"ใช้เวลา 1–3 วันทำการ"},
      {n:60, t:"ตรวจสอบยอดรายได้",         d:"WeChat Pay Dashboard"},
      {n:61, t:"บันทึกรายรับ-รายจ่าย",     d:"ระบบบัญชีหรือ Google Sheets"},
    ],
  },
  { id:11, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Retention", desc:"รักษาลูกค้าจีนให้กลับมาซื้อ",
    steps:[
      {n:62, t:"ขอรีวิวและรูปถ่าย",        d:"รูปสินค้าจากลูกค้าจริง",            ai:true},
      {n:63, t:"โพสต์รีวิวใน Moments",    d:"Social Proof สร้างความน่าเชื่อถือ",  ai:true},
      {n:64, t:"Follow up หลัง 3–5 วัน",  d:"ถามความพอใจ แนะนำเพิ่ม",           ai:true},
      {n:65, t:"เพิ่มลูกค้าใน VIP Group", d:"รับโปรโมชั่นก่อนใคร"},
      {n:66, t:"วิเคราะห์ยอดขาย",         d:"WeChat Pay + Mini Program Analytics", ai:true},
    ],
  },
];

const C={
  bg:"#080810", card:"rgba(255,255,255,0.04)", border:"rgba(255,255,255,0.08)",
  green:"#1D9E75", wgreen:"#07c160",
  wgreenBg:"rgba(7,193,96,0.11)", wgreenBorder:"rgba(7,193,96,0.25)",
  amber:"rgba(245,166,35,0.12)", amberText:"#f5a623",
  text:"#ffffff", muted:"rgba(255,255,255,0.44)",
};

export default function WeChatOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× WeChat Roadmap</span>
          </div>
          <span style={{fontSize:12,color:C.wgreen,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>

        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.wgreen,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>

        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.wgreen:allDone?"rgba(7,193,96,0.3)":C.border}`,background:i===part?C.wgreenBg:allDone?"rgba(7,193,96,0.07)":"transparent",color:i===part?C.wgreen:allDone?C.wgreen:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>

        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.wgreenBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.wgreen,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.wgreenBg,color:C.wgreen,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(7,193,96,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(7,193,96,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.wgreen:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.wgreen:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(7,193,96,0.11)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.wgreen,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Kanit',sans-serif",fontSize:13.5,fontWeight:600,color:checked[s.n]?"rgba(255,255,255,0.35)":C.text,textDecoration:checked[s.n]?"line-through":"none",margin:"0 0 3px"}}>{s.t}</p>
                <p style={{fontSize:11.5,color:C.muted,margin:0,lineHeight:1.5}}>{s.d}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {s.ai&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:"rgba(29,158,117,0.12)",color:C.green,fontWeight:600}}>🤖 OpenThai AI ช่วยได้</span>}
                  {s.note&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:C.amber,color:C.amberText,fontWeight:600}}>⚠️ ข้อควรรู้</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:9}}>
          {part>0&&<button onClick={()=>setPart(i=>i-1)} style={{flex:1,padding:13,borderRadius:12,cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontFamily:"'Kanit',sans-serif",fontSize:14,fontWeight:600}}>← ย้อนกลับ</button>}
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.wgreen,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>

      </div>
    </div>
  );
}
