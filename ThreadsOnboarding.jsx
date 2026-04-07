/**
 * ThreadsOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Threads ตั้งแต่สมัครจนรับเงิน
 * 55 ขั้นตอน ใน 9 ส่วน — tick ✓ ได้ทีละข้อ
 *
 * วิธีใช้:
 *   import ThreadsOnboarding from './ThreadsOnboarding'
 *   <ThreadsOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1, icon:"📸", label:"Instagram ก่อน",
    name:"เตรียมบัญชี Instagram ก่อน", desc:"Threads ต้องใช้ IG Account",
    steps:[
      {n:1, t:"โหลดแอป Instagram",              d:"Play Store / App Store"},
      {n:2, t:"สมัครด้วยเบอร์ / อีเมล",         d:"กรอกข้อมูลส่วนตัว"},
      {n:3, t:"ตั้ง Username",                   d:"สั้น จำง่าย สื่อถึงแบรนด์"},
      {n:4, t:"ใส่รูปโปรไฟล์ + Bio",            d:"บอกว่าขายอะไร ราคาเริ่มต้น",      ai:true},
      {n:5, t:"Switch to Professional Account", d:"Creator หรือ Business"},
      {n:6, t:"ยืนยันอีเมลหรือเบอร์",           d:"กดลิงก์ยืนยันในอีเมล"},
    ],
  },
  { id:2, icon:"🧵", label:"สมัคร Threads",
    name:"สมัครและตั้งค่า Threads", desc:"สร้างบัญชีผ่าน Instagram",
    steps:[
      {n:7,  t:"โหลดแอป Threads",               d:"Play Store / App Store"},
      {n:8,  t:"Log in with Instagram",         d:"เข้าสู่ระบบด้วย IG Account"},
      {n:9,  t:"นำเข้าโปรไฟล์จาก IG",          d:"ข้อมูลดึงมาอัตโนมัติ"},
      {n:10, t:"ปรับ Bio ใน Threads",           d:"ขายอะไร ราคา ช่องทางสั่ง",        ai:true},
      {n:11, t:"เลือก Privacy: Public",         d:"แนะนำสำหรับขายของ"},
      {n:12, t:"ติดตาม Account ที่เกี่ยวข้อง", d:"Creator / ซัพพลายเออร์ / ลูกค้า"},
      {n:13, t:"เปิด Notification",             d:"รับแจ้งเตือน DM และ Reply ทันที"},
    ],
  },
  { id:3, icon:"⚙️", label:"ตั้งค่าโปรไฟล์",
    name:"ตั้งค่าโปรไฟล์ให้พร้อมขาย", desc:"โปรไฟล์ดี ขายได้ง่ายกว่า",
    steps:[
      {n:14, t:"ปรับชื่อโปรไฟล์",              d:"ให้ตรงกับแบรนด์สินค้า"},
      {n:15, t:"เขียน Bio ให้ครบ",             d:"ขายอะไร / ราคา / สั่งซื้อที่ไหน",  ai:true},
      {n:16, t:"เพิ่มลิงก์",                   d:"IG Shop / LINE / PromptPay QR"},
      {n:17, t:"Profile Picture ตรงกับ IG",    d:"Branding เดียวกันทุกแพลตฟอร์ม"},
      {n:18, t:"Pin โพสต์ขายดีด้านบน",        d:"โปรโมชั่น/สินค้าหลักให้คนเห็นก่อน"},
    ],
  },
  { id:4, icon:"✍️", label:"สร้าง Content",
    name:"สร้างคอนเทนต์และโพสต์ขาย", desc:"AI เขียนโพสต์ Threads ให้ทุกวัน",
    steps:[
      {n:19, t:"เขียนโพสต์ข้อความขาย",        d:"500 ตัวอักษร Hook ดึงใจ",          ai:true},
      {n:20, t:"แนบรูปสินค้า",                 d:"สูงสุด 10 รูปต่อโพสต์"},
      {n:21, t:"แนบวิดีโอสินค้า",              d:"สูงสุด 5 นาที"},
      {n:22, t:"ใส่ Hashtag 3–5 อัน",         d:"ที่เกี่ยวข้องกับสินค้า",            ai:true},
      {n:23, t:"Tag บัญชี IG ร้านตัวเอง",     d:"เชื่อม Threads กับ Instagram"},
      {n:24, t:"Reply ต่อโพสต์ตัวเอง",        d:"Thread ยาว ใส่รายละเอียดเพิ่ม",    ai:true},
      {n:25, t:"Quote Repost + Caption ใหม่",  d:"โพสต์ซ้ำด้วยมุมมองใหม่",           ai:true},
      {n:26, t:"Cross-post ไป IG Stories",    d:"ขยาย Reach อัตโนมัติ"},
      {n:27, t:"โพสต์ 3–5 ครั้ง/วัน",        d:"07:00 / 12:00 / 19:00–21:00 น."},
    ],
  },
  { id:5, icon:"💫", label:"Engagement",
    name:"สร้าง Engagement และการมองเห็น", desc:"ยิ่ง Engage มาก ยิ่งคนเห็นเยอะ",
    steps:[
      {n:28, t:"ตอบ Reply ทุกความคิดเห็น",     d:"ตอบเร็ว = อัลกอริทึมชอบ",          ai:true},
      {n:29, t:"Like และ Repost Content",      d:"สร้างสัมพันธ์กับ Creator อื่น"},
      {n:30, t:"Follow Creator กลุ่มเดียว",   d:"เพิ่มโอกาสถูก Follow กลับ"},
      {n:31, t:"สร้าง Poll / ถามความเห็น",    d:"ดึง Engagement จากผู้ติดตาม",       ai:true},
      {n:32, t:"ร่วม Thread กระแส",           d:"เพิ่มการมองเห็นจากคนใหม่"},
      {n:33, t:"Mention @ Account เกี่ยวข้อง", d:"ขนส่ง / ซัพพลายเออร์ / พาร์ทเนอร์"},
    ],
  },
  { id:6, icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง DM",
    steps:[
      {n:34, t:"รับ DM คำสั่งซื้อใน Threads", d:"แจ้งเตือนทันทีเมื่อมีออร์เดอร์"},
      {n:35, t:"ตอบคำถามสินค้า / ราคา",       d:"ตอบเร็ว 5 นาที = ปิดการขายสูง",   ai:true},
      {n:36, t:"ส่งรูปสินค้า / วิดีโอรีวิว",  d:"ข้อมูลเพิ่มเติมทาง DM"},
      {n:37, t:"ยืนยันออร์เดอร์",             d:"สินค้า / จำนวน / ที่อยู่จัดส่ง"},
      {n:38, t:"แจ้งราคารวม",                 d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:39, t:"ส่ง QR PromptPay / เลขบัญชี", d:"ให้ลูกค้าโอนเงินทาง DM"},
      {n:40, t:"รอสลิปโอนเงิน",               d:"ลูกค้าส่งสลิปมาทาง DM"},
    ],
  },
  { id:7, icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบและยืนยันชำระเงิน", desc:"เช็คเงินเข้าและยืนยันลูกค้า",
    steps:[
      {n:41, t:"ตรวจสอบสลิปลูกค้า",           d:"ยอด / วันที่ / ชื่อผู้โอน"},
      {n:42, t:"เช็คยอดเข้าจริง",             d:"เปิด Mobile Banking ยืนยัน"},
      {n:43, t:"แจ้งยืนยันชำระแล้ว",         d:"ส่งข้อความยืนยันทาง DM",           ai:true},
      {n:44, t:"บันทึกออร์เดอร์ลงระบบ",      d:"Excel / Google Sheets"},
      {n:45, t:"ออก Receipt ให้ลูกค้า",       d:"Order Confirmation ทาง DM",        ai:true},
    ],
  },
  { id:8, icon:"📦", label:"จัดส่ง",
    name:"แพ็คและจัดส่งสินค้า", desc:"ส่งสินค้าให้ถึงมือลูกค้า",
    steps:[
      {n:46, t:"แพ็คสินค้า + ใบปะหน้า",       d:"เขียนที่อยู่ลูกค้าชัดเจน"},
      {n:47, t:"ส่งพัสดุกับขนส่ง",             d:"Flash / Kerry / J&T / ไปรษณีย์"},
      {n:48, t:"แจ้งเลข Tracking ทาง DM",     d:"ส่ง Tracking Number ให้ลูกค้า",   ai:true},
      {n:49, t:"ลูกค้าติดตามพัสดุ",            d:"แอปขนส่งหรือเว็บไซต์"},
      {n:50, t:"ลูกค้ารับสินค้าแล้ว",          d:"ขอรีวิวและรูปถ่ายทาง DM",          ai:true},
    ],
  },
  { id:9, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและ Cross-Platform", desc:"รักษาลูกค้าและขยาย Reach",
    steps:[
      {n:51, t:"ขอรีวิวและรูปถ่าย",            d:"รูปสินค้าจากลูกค้าจริง",           ai:true},
      {n:52, t:"โพสต์รีวิวใน Threads + IG",   d:"Social Proof ข้ามแพลตฟอร์ม",      ai:true},
      {n:53, t:"Follow up หลัง 3–5 วัน",      d:"ถามความพอใจ แนะนำสินค้าเพิ่ม",    ai:true},
      {n:54, t:"แชร์โพสต์ Threads ไป IG",     d:"ขยาย Reach อัตโนมัติ"},
      {n:55, t:"วิเคราะห์ Insights",           d:"โพสต์ Engagement สูง → ทำเพิ่ม",  ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",white:"#ffffff",
  whiteBg:"rgba(255,255,255,0.08)",whiteBorder:"rgba(255,255,255,0.18)",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function ThreadsOnboarding({ onComplete }) {
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

        {/* Top bar */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontFamily:"'Kanit',sans-serif",fontWeight:700,fontSize:17,color:C.green}}>OpenThai AI</span>
            <span style={{fontSize:12,color:C.muted}}>× Threads Roadmap</span>
          </div>
          <span style={{fontSize:12,color:C.white,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>

        {/* Progress */}
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:"#fff",borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>

        {/* Tabs */}
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return(
              <button key={i} onClick={()=>setPart(i)} style={{
                padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,
                fontFamily:"'Sarabun',sans-serif",cursor:"pointer",
                border:`1px solid ${i===part?"rgba(255,255,255,0.6)":allDone?"rgba(255,255,255,0.3)":C.border}`,
                background:i===part?C.whiteBg:allDone?"rgba(255,255,255,0.05)":"transparent",
                color:i===part?C.white:allDone?C.white:C.muted,
              }}>{allDone?"✓ ":""}{pt.label}</button>
            );
          })}
        </div>

        {/* Part header */}
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.whiteBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:"rgba(255,255,255,0.6)",fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.whiteBg,color:C.white,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>

        {/* Steps */}
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{
              display:"flex",alignItems:"flex-start",gap:11,
              padding:"13px 15px",borderRadius:13,cursor:"pointer",
              background:checked[s.n]?"rgba(255,255,255,0.06)":C.card,
              border:`1px solid ${checked[s.n]?"rgba(255,255,255,0.2)":C.border}`,
              transition:"all 0.2s",
            }}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?"#fff":"rgba(255,255,255,0.18)"}`,background:checked[s.n]?"#fff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#000",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(255,255,255,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:"rgba(255,255,255,0.7)",fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
              <div style={{flex:1}}>
                <p style={{fontFamily:"'Kanit',sans-serif",fontSize:13.5,fontWeight:600,color:checked[s.n]?"rgba(255,255,255,0.35)":C.text,textDecoration:checked[s.n]?"line-through":"none",margin:"0 0 3px"}}>{s.t}</p>
                <p style={{fontSize:11.5,color:C.muted,margin:0,lineHeight:1.5}}>{s.d}</p>
                {s.ai&&<span style={{display:"inline-block",marginTop:5,fontSize:10,padding:"2px 8px",borderRadius:999,background:"rgba(29,158,117,0.12)",color:C.green,fontWeight:600}}>🤖 OpenThai AI ช่วยได้</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div style={{display:"flex",gap:9}}>
          {part>0&&<button onClick={()=>setPart(i=>i-1)} style={{flex:1,padding:13,borderRadius:12,cursor:"pointer",border:`1px solid ${C.border}`,background:"transparent",color:C.muted,fontFamily:"'Kanit',sans-serif",fontSize:14,fontWeight:600}}>← ย้อนกลับ</button>}
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:"#fff",color:"#000",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:700}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>

      </div>
    </div>
  );
}
