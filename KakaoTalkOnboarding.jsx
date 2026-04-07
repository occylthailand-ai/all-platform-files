/**
 * KakaoTalkOnboarding.jsx
 * Wizard พา Seller ตั้งค่า KakaoTalk ตั้งแต่สมัครจนรับเงิน
 * 49 ขั้นตอน ใน 9 ส่วน — LINE เกาหลี 47M+ Users สินค้าไทยสู่ตลาดเกาหลี
 *
 * วิธีใช้:
 *   import KakaoTalkOnboarding from './KakaoTalkOnboarding'
 *   <KakaoTalkOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1, icon:"👤", label:"สมัครบัญชี",
    name:"สมัครและตั้งค่าบัญชี KakaoTalk", desc:"เริ่มต้นสร้าง KakaoTalk Account",
    steps:[
      {n:1, t:"โหลดแอป KakaoTalk",              d:"Play Store / App Store"},
      {n:2, t:"กด 'สมัคร' + เบอร์มือถือ",       d:"รองรับเบอร์ต่างประเทศ"},
      {n:3, t:"ยืนยัน OTP",                     d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อ (ภาษาเกาหลี/อังกฤษ)",   d:"ใช้ชื่อแบรนด์",                    ai:true},
      {n:5, t:"ใส่รูปโปรไฟล์แบรนด์",            d:"สื่อถึงสินค้าไทย"},
      {n:6, t:"เปิด Notification",               d:"รับแจ้งเตือนข้อความจากลูกค้า"},
    ],
  },
  { id:2, icon:"📢", label:"KakaoTalk Channel",
    name:"สมัคร KakaoTalk Channel ธุรกิจ", desc:"หน้าธุรกิจสำหรับลูกค้าเกาหลี",
    steps:[
      {n:7,  t:"ไปที่ business.kakao.com",       d:"กด '채널 만들기' สร้าง Channel"},
      {n:8,  t:"ลงทะเบียนด้วย Kakao Account",   d:"หรืออีเมลธุรกิจ"},
      {n:9,  t:"กรอกข้อมูล Channel",            d:"ชื่อ/หมวดธุรกิจ/คำอธิบาย",        ai:true},
      {n:10, t:"อัปโหลด Logo + Cover Image",    d:""},
      {n:11, t:"ยืนยันตัวตนธุรกิจ",            d:"สำหรับ Verified Channel"},
      {n:12, t:"รอ Kakao อนุมัติ 1–3 วัน",     d:""},
      {n:13, t:"ได้รับ KakaoTalk Channel",       d:"พร้อมใช้งาน"},
    ],
  },
  { id:3, icon:"⚙️", label:"ตั้งค่า Channel",
    name:"ตั้งค่า Channel และโปรไฟล์ธุรกิจ", desc:"AI เขียนคำอธิบายภาษาเกาหลี",
    steps:[
      {n:14, t:"ตั้งค่า Channel Profile",        d:"ชื่อ/คำอธิบาย/ลิงก์ร้าน/เบอร์",   ai:true},
      {n:15, t:"เขียน Channel Description เกาหลี",d:"จุดเด่น/สินค้า/วิธีสั่งซื้อ",    ai:true},
      {n:16, t:"ตั้งค่า Welcome Message",        d:"ต้อนรับเมื่อลูกค้า Add Channel",    ai:true},
      {n:17, t:"ตั้งค่า Auto Reply",            d:"ตอบอัตโนมัตินอกเวลาทำการ",         ai:true},
      {n:18, t:"เพิ่มปุ่ม Quick Reply",         d:"ราคา/สั่งซื้อ/ติดต่อ/ดูสินค้า"},
    ],
  },
  { id:4, icon:"🛒", label:"Kakao Shopping",
    name:"สมัคร Kakao Shopping เชื่อมร้านค้า", desc:"เปิดร้านค้าในระบบ Kakao",
    steps:[
      {n:19, t:"ไปที่ shopping.kakao.com",       d:"สมัคร Kakao Shopping Seller"},
      {n:20, t:"เชื่อม Channel กับ Shopping",    d:""},
      {n:21, t:"กรอกข้อมูลธุรกิจ",             d:"ทะเบียนพาณิชย์/ที่อยู่/บัญชี",     warn:true},
      {n:22, t:"เพิ่มสินค้าใน Kakao Shopping",  d:"ชื่อ/รายละเอียด/ราคา/รูป",         ai:true},
      {n:23, t:"ตั้งค่าการจัดส่ง",             d:"ค่าส่ง/เวลาจัดส่ง/ขนส่ง"},
      {n:24, t:"เปิดใช้ KakaoPay",             d:"รับชำระเงินออนไลน์"},
    ],
  },
  { id:5, icon:"📝", label:"สร้าง Content",
    name:"สร้างคอนเทนต์และโพสต์ใน Channel", desc:"AI เขียน Channel Post ภาษาเกาหลี",
    steps:[
      {n:25, t:"สร้างโพสต์สินค้าใน Channel",    d:"รูป + ข้อความภาษาเกาหลี",          ai:true},
      {n:26, t:"โพสต์รูปสินค้า + รายละเอียด",   d:"ราคา + วิธีสั่ง",                  ai:true},
      {n:27, t:"สร้าง Card News (Infographic)", d:"แบบ KakaoTalk Channel Post",        ai:true},
      {n:28, t:"ใช้ Kakao Story",               d:"โพสต์เรื่องราวเบื้องหลังสินค้าไทย"},
      {n:29, t:"ไลฟ์ขาย Kakao Live",           d:"ขายของสดในแอป"},
      {n:30, t:"ส่ง Channel Broadcast",         d:"โปรโมชั่นถึงผู้ติดตามทั้งหมด",     ai:true},
    ],
  },
  { id:6, icon:"💬", label:"สื่อสารลูกค้า",
    name:"รับคำถามและสื่อสารกับลูกค้า", desc:"ตอบเร็ว = ปิดขายได้",
    steps:[
      {n:31, t:"รับข้อความจากลูกค้า",           d:"KakaoTalk Channel Chat"},
      {n:32, t:"ตอบคำถามสินค้า",                d:"รายละเอียด/ราคา/วิธีสั่ง/ค่าส่ง",  ai:true},
      {n:33, t:"ส่งรูปเพิ่มเติมหรือวิดีโอ",    d:"สาธิตใน Chat"},
      {n:34, t:"ยืนยันออร์เดอร์",              d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:35, t:"แจ้งราคารวมและช่องทางชำระ",    d:"KakaoPay / โอนธนาคาร"},
    ],
  },
  { id:7, icon:"✅", label:"ยืนยันชำระ",
    name:"ตรวจสอบการชำระเงิน", desc:"เช็คเงินเข้าก่อนส่งสินค้าเสมอ",
    steps:[
      {n:36, t:"ลูกค้าชำระผ่าน KakaoPay",      d:"หรือโอนธนาคารเกาหลี"},
      {n:37, t:"ตรวจสอบใน KakaoPay Dashboard", d:"หรือ Mobile Banking",               warn:true},
      {n:38, t:"ยืนยันชำระทาง KakaoTalk Chat", d:"",                                  ai:true},
      {n:39, t:"บันทึกออร์เดอร์",              d:"Excel / Google Sheets"},
    ],
  },
  { id:8, icon:"📦", label:"จัดส่งสินค้า",
    name:"จัดส่งสินค้าและแจ้งติดตาม", desc:"ส่งพัสดุระหว่างประเทศ TH→KR",
    steps:[
      {n:40, t:"แพ็คสินค้าให้มิดชิด",          d:"ป้องกันความเสียหาย"},
      {n:41, t:"ส่งพัสดุ EMS/DHL/Korea Post",  d:"หรือขนส่งที่ตกลง"},
      {n:42, t:"แจ้งเลข Tracking ทาง KakaoTalk",d:"",                                 ai:true},
      {n:43, t:"ติดตามสถานะพัสดุ",             d:"จนถึงมือลูกค้า"},
      {n:44, t:"ลูกค้ารับสินค้า → ขอรีวิว",   d:"ใน Kakao Shopping / Channel",       ai:true},
    ],
  },
  { id:9, icon:"⭐", label:"หลังการขาย",
    name:"หลังการขายและขยายฐานลูกค้า", desc:"วิเคราะห์และขยาย Channel",
    steps:[
      {n:45, t:"ตอบรีวิวลูกค้าใน Kakao Shopping",d:"",                               ai:true},
      {n:46, t:"วิเคราะห์ Channel Analytics",  d:"ผู้ติดตาม/Engagement/ยอดขาย"},
      {n:47, t:"ส่ง Broadcast โปรโมชั่นใหม่",  d:"ถึงผู้ติดตาม Channel",              ai:true},
      {n:48, t:"ใช้ Kakao Ads",                d:"โฆษณาเพิ่ม Follower"},
      {n:49, t:"ขยายไปยัง Naver / Coupang",   d:"ตลาดเกาหลีเต็มรูปแบบ"},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",yellow:"#fee900",
  yellowBg:"rgba(254,229,0,0.1)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function KakaoTalkOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× KakaoTalk 카카오</span>
          </div>
          <span style={{fontSize:12,color:C.yellow,fontWeight:600}}>{done}/{total} ขั้นตอน</span>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:999,height:5,marginBottom:5}}>
          <div style={{width:`${pct}%`,height:"100%",background:C.yellow,borderRadius:999,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:11,color:C.muted,textAlign:"right",marginBottom:22}}>{pct}% เสร็จสิ้น</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:18}}>
          {PARTS.map((pt,i)=>{
            const allDone=pt.steps.every(s=>checked[s.n]);
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.yellow:allDone?"rgba(254,229,0,0.3)":C.border}`,background:i===part?C.yellowBg:allDone?"rgba(254,229,0,0.07)":"transparent",color:i===part?C.yellow:allDone?C.yellow:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
          })}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:16,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"16px 20px"}}>
          <div style={{width:48,height:48,borderRadius:13,fontSize:20,background:C.yellowBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.icon}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:10.5,color:C.yellow,fontWeight:600,letterSpacing:1,margin:"0 0 3px"}}>ส่วนที่ {p.id} จาก {PARTS.length}</p>
            <p style={{fontFamily:"'Kanit',sans-serif",fontSize:16,fontWeight:600,color:C.text,margin:"0 0 2px"}}>{p.name}</p>
            <p style={{fontSize:12,color:C.muted,margin:0}}>{p.desc}</p>
          </div>
          <span style={{fontSize:11,fontWeight:600,padding:"3px 11px",borderRadius:999,background:C.yellowBg,color:C.yellow,whiteSpace:"nowrap"}}>{pDone}/{p.steps.length}</span>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:18}}>
          {p.steps.map(s=>(
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(254,229,0,0.04)":C.card,border:`1px solid ${checked[s.n]?"rgba(254,229,0,0.2)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.yellow:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.yellow:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#1a1600",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(254,229,0,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.yellow,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.yellow,color:"#1a1600",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:700}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
