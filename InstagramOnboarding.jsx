/**
 * InstagramOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Instagram ตั้งแต่สมัครจนรับเงิน
 * 75 ขั้นตอน ใน 12 ส่วน — tick ✓ ได้ทีละข้อ
 *
 * วิธีใช้:
 *   import InstagramOnboarding from './InstagramOnboarding'
 *   <InstagramOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",   name:"สมัครและตั้งค่าบัญชี Instagram", desc:"เริ่มต้นสร้าง IG Account",
    steps:[
      {n:1, t:"โหลดแอป Instagram",              d:"Play Store / App Store"},
      {n:2, t:"สร้างบัญชีใหม่",                d:"ใส่อีเมลหรือเบอร์มือถือ"},
      {n:3, t:"ตั้ง Username",                  d:"สั้น จำง่าย สื่อถึงแบรนด์"},
      {n:4, t:"ตั้งรหัสผ่าน",                  d:"อย่างน้อย 8 ตัวอักษร"},
      {n:5, t:"ยืนยัน OTP",                    d:"รับรหัสทางเบอร์หรืออีเมล"},
      {n:6, t:"ใส่รูปโปรไฟล์",                d:"สื่อถึงแบรนด์หรือสินค้า"},
      {n:7, t:"เขียน Bio 150 ตัวอักษร",        d:"ขายอะไร ราคาเริ่มต้น ช่องทางสั่ง",  ai:true},
      {n:8, t:"เพิ่มลิงก์ใน Bio",              d:"LINE / เว็บ / Linktree / PromptPay"},
    ],
  },
  { id:2,  icon:"🏢", label:"Professional",   name:"Switch to Professional Account", desc:"เปิด Analytics และ Shopping",
    steps:[
      {n:9,  t:"Settings → Switch Professional", d:"Creator หรือ Business Account"},
      {n:10, t:"เลือกประเภท Creator / Business", d:"Creator=คอนเทนต์ / Business=ร้านค้า"},
      {n:11, t:"เลือกหมวดธุรกิจ",              d:"สินค้า / แฟชั่น / อาหาร / ความงาม"},
      {n:12, t:"เชื่อม Facebook Page",          d:"สำหรับใช้ Meta Ads"},
      {n:13, t:"ใส่ข้อมูลติดต่อ",              d:"อีเมล / เบอร์โทร / ที่อยู่"},
      {n:14, t:"เปิด Instagram Insights",       d:"Reach / Engagement / Followers"},
    ],
  },
  { id:3,  icon:"🛍️", label:"IG Shop",        name:"ตั้งค่า Instagram Shop", desc:"ขายของในแอปโดยตรง",
    steps:[
      {n:15, t:"Settings → Business → Shopping", d:"เริ่มตั้งค่า IG Shop"},
      {n:16, t:"เชื่อม Facebook Commerce Manager",d:"ระบบกลางจัดการ Catalog"},
      {n:17, t:"สร้าง Product Catalog",          d:"กลุ่มสินค้าหลักของร้าน"},
      {n:18, t:"เพิ่มสินค้าใน Catalog",          d:"ชื่อ/รายละเอียด/ราคา/รูป/สต็อก",   ai:true},
      {n:19, t:"ใส่ลิงก์สินค้า URL",            d:"เว็บหรือ Line Shop"},
      {n:20, t:"Submit รอ Instagram Approve",    d:"1-3 วันทำการ"},
      {n:21, t:"เปิดใช้งาน Shopping บน Profile", d:"ลูกค้าซื้อได้เลย"},
      {n:22, t:"เพิ่ม Shop Tab บน Profile",     d:"แสดงสินค้าทั้งหมดในโปรไฟล์"},
    ],
  },
  { id:4,  icon:"🖼️", label:"Feed Posts",     name:"สร้างคอนเทนต์ Feed Posts", desc:"AI เขียน Caption + Hashtag",
    steps:[
      {n:23, t:"ถ่ายรูปสินค้าคุณภาพสูง",       d:"แสงดี พื้นหลังสะอาด"},
      {n:24, t:"แก้ไขรูปด้วย Filter / Preset",  d:"Aesthetic สม่ำเสมอทุกโพสต์"},
      {n:25, t:"เขียน Caption + Hook",           d:"บรรทัดแรกดึงใจก่อนกด 'อ่านเพิ่ม'",  ai:true},
      {n:26, t:"ใส่ Hashtag 5–30 อัน",          d:"ผสมใหญ่ กลาง เล็ก ตรงกลุ่มเป้า",    ai:true},
      {n:27, t:"Tag สินค้าจาก IG Shop",         d:"ลูกค้ากดซื้อได้เลยจากรูป"},
      {n:28, t:"Tag Location",                   d:"เพิ่มการมองเห็นในพื้นที่"},
      {n:29, t:"Tag บัญชีที่เกี่ยวข้อง",        d:"ซัพพลายเออร์ / พาร์ทเนอร์"},
      {n:30, t:"ตั้งเวลาโพสต์ที่ดี",            d:"ไทย: 19:00–21:00 น."},
    ],
  },
  { id:5,  icon:"🎬", label:"Reels",           name:"Instagram Reels วิดีโอสั้น", desc:"Reels = Reach สูงสุดบน IG",
    steps:[
      {n:31, t:"ถ่ายวิดีโอแนวตั้ง 9:16",       d:"15–90 วินาที"},
      {n:32, t:"ตัดต่อใน CapCut / Instagram",   d:"subtitle, transition, effect"},
      {n:33, t:"ใส่เสียง Trending",             d:"เลือกจาก Instagram Audio"},
      {n:34, t:"เพิ่ม Text / Sticker / Effect", d:"feature ที่ IG ส่งเสริมอัลกอริทึม"},
      {n:35, t:"เขียน Caption + Hashtag Reels", d:"ต่างจาก Feed ได้",                  ai:true},
      {n:36, t:"Tag สินค้าจาก Shop ใน Reels",  d:"ลูกค้ากดซื้อได้เลย"},
      {n:37, t:"แชร์ Reels ไป Feed + Stories", d:"ขยาย Reach พร้อมกัน"},
    ],
  },
  { id:6,  icon:"⭕", label:"Stories",         name:"Instagram Stories", desc:"โปรโมทสินค้าแบบ 24 ชั่วโมง",
    steps:[
      {n:38, t:"โพสต์ Stories 3–10 ชิ้น/วัน", d:"อายุ 24 ชั่วโมง ลูกค้าเห็นบ่อย"},
      {n:39, t:"ใช้ Poll / Quiz / Question",   d:"ดึง Engagement จากผู้ติดตาม",       ai:true},
      {n:40, t:"เพิ่ม Product Link Sticker",  d:"ลูกค้ากด Link ซื้อสินค้าได้เลย"},
      {n:41, t:"ใช้ Countdown Sticker",       d:"โปรโมชั่นจำกัดเวลา สร้าง FOMO"},
      {n:42, t:"บันทึก Highlights",           d:"สินค้า / รีวิว / โปรฯ / วิธีสั่ง"},
    ],
  },
  { id:7,  icon:"🔴", label:"Live ขายสด",     name:"Instagram Live ขายของสด", desc:"Live = ยอดขายพุ่งไวที่สุด",
    steps:[
      {n:43, t:"กด + → Live → ตั้งชื่อ",      d:"ชื่อบอกสินค้าและโปรโมชั่น",          ai:true},
      {n:44, t:"เพิ่ม Product ใน Live Shopping",d:"เลือกสินค้าที่จะขาย"},
      {n:45, t:"Live อย่างน้อย 30 นาที",       d:"ตอบ Comment ตลอด"},
      {n:46, t:"Pin สินค้าให้คนเห็นตลอด",     d:"กด Pin ทุกครั้งที่นำเสนอ"},
      {n:47, t:"สรุปยอดขายหลังจบ",            d:"ดูใน Insights"},
    ],
  },
  { id:8,  icon:"💬", label:"รับออร์เดอร์",  name:"รับออร์เดอร์และสื่อสาร", desc:"จัดการคำสั่งซื้อทาง DM",
    steps:[
      {n:48, t:"รับ DM คำสั่งซื้อ",            d:"แจ้งเตือนทันทีเมื่อมีออร์เดอร์"},
      {n:49, t:"ตอบคำถามสินค้า / ราคา",        d:"ตอบเร็ว 5 นาที = ปิดการขายสูง",     ai:true},
      {n:50, t:"ส่งรูปสินค้า / วิดีโอรีวิว",   d:"ข้อมูลเพิ่มเติมใน DM"},
      {n:51, t:"ยืนยันออร์เดอร์",              d:"สินค้า / จำนวน / ที่อยู่จัดส่ง"},
      {n:52, t:"แจ้งราคารวม",                  d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:53, t:"ส่ง QR PromptPay / เลขบัญชี", d:"ให้ลูกค้าโอนเงิน"},
      {n:54, t:"รอสลิปโอนเงิน",               d:"ลูกค้าส่งสลิปทาง DM"},
    ],
  },
  { id:9,  icon:"✅", label:"ยืนยันชำระ",    name:"ตรวจสอบและยืนยันชำระเงิน", desc:"เช็คเงินเข้าและยืนยัน",
    steps:[
      {n:55, t:"ตรวจสอบสลิปลูกค้า",           d:"ยอด / วันที่ / ชื่อผู้โอน"},
      {n:56, t:"เช็คยอดเข้าจริง",             d:"เปิด Mobile Banking ยืนยัน"},
      {n:57, t:"แจ้งยืนยันชำระแล้ว",          d:"ส่งข้อความยืนยันทาง DM",             ai:true},
      {n:58, t:"บันทึกออร์เดอร์ลงระบบ",       d:"Excel / Google Sheets"},
      {n:59, t:"ออก Receipt ให้ลูกค้า",       d:"Order Confirmation ทาง DM",          ai:true},
    ],
  },
  { id:10, icon:"📦", label:"จัดส่ง",        name:"แพ็คและจัดส่งสินค้า", desc:"ส่งสินค้าให้ถึงมือลูกค้า",
    steps:[
      {n:60, t:"แพ็คสินค้า + ใบปะหน้า",       d:"เขียนที่อยู่ลูกค้าชัดเจน"},
      {n:61, t:"ส่งพัสดุกับขนส่ง",             d:"Flash / Kerry / J&T / ไปรษณีย์"},
      {n:62, t:"แจ้งเลข Tracking ทาง DM",     d:"ส่ง Tracking Number ให้ลูกค้า",      ai:true},
      {n:63, t:"ลูกค้าติดตามพัสดุ",            d:"แอปขนส่งหรือเว็บไซต์"},
      {n:64, t:"ลูกค้ารับสินค้าแล้ว",          d:"ขอรีวิวและรูปถ่ายทาง DM",            ai:true},
    ],
  },
  { id:11, icon:"📢", label:"IG Ads",        name:"ใช้ Instagram Ads โปรโมท", desc:"ขยายการเข้าถึงด้วยโฆษณา",
    steps:[
      {n:65, t:"Boost Post จากโพสต์ปกติ",      d:"ง่ายสุด สำหรับมือใหม่"},
      {n:66, t:"ตั้งค่า Meta Ads Manager",     d:"Campaign / Ad Set / Ad"},
      {n:67, t:"เลือก Objective",              d:"ยอดขาย / Traffic / Engagement",      ai:true},
      {n:68, t:"ตั้ง Target Audience",         d:"อายุ/เพศ/ความสนใจ/Location",         ai:true},
      {n:69, t:"ตั้งงบ + เผยแพร่โฆษณา",       d:"Daily Budget + ระยะเวลา"},
    ],
  },
  { id:12, icon:"⭐", label:"หลังการขาย",   name:"หลังการขายและ Retention", desc:"รักษาลูกค้าให้กลับมาซื้อ",
    steps:[
      {n:70, t:"ขอรีวิวและรูปถ่าย",            d:"รูปสินค้าจากลูกค้าจริง",              ai:true},
      {n:71, t:"Repost รีวิวใน Stories",       d:"บันทึกใน Highlights 'รีวิว'",         ai:true},
      {n:72, t:"Tag ลูกค้าที่ Repost",         d:"สร้างชุมชนลูกค้า"},
      {n:73, t:"Follow up หลัง 3–5 วัน",      d:"ถามความพอใจ แนะนำเพิ่ม",             ai:true},
      {n:74, t:"สร้าง Close Friends List",     d:"โปรโมชั่น VIP ก่อนใคร"},
      {n:75, t:"วิเคราะห์ Instagram Insights", d:"Reach/Engagement สูง → ทำเพิ่ม",     ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",pink:"#e1306c",
  pinkBg:"rgba(225,48,108,0.11)",pinkBorder:"rgba(225,48,108,0.25)",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function InstagramOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Instagram Roadmap</span>
          </div>
          <span style={{fontSize:12,color:C.pink,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.pink:allDone?"rgba(225,48,108,0.3)":C.border}`,background:i===part?C.pinkBg:allDone?"rgba(225,48,108,0.07)":"transparent",color:i===part?C.pink:allDone?C.pink:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.pinkBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.pink,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.pinkBg,color:C.pink,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(225,48,108,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(225,48,108,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.pink:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.pink:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(225,48,108,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.pink,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:"linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
