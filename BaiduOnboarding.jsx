/**
 * BaiduOnboarding.jsx
 * Wizard พา Creator ตั้งค่า Baidu ตั้งแต่สมัครจนรับเงิน
 * 62 ขั้นตอน ใน 10 ส่วน — Search Engine จีน 1,000M+/เดือน
 *
 * วิธีใช้:
 *   import BaiduOnboarding from './BaiduOnboarding'
 *   <BaiduOnboarding onComplete={() => navigate('/generate')} />
 */

import { useState } from "react";

const PARTS = [
  { id:1,  icon:"👤", label:"สมัครบัญชี",
    name:"สมัครบัญชี Baidu", desc:"หนึ่งบัญชีใช้ได้ทุก Baidu Product",
    steps:[
      {n:1, t:"ไปที่ passport.baidu.com",     d:"กด 注册 (Register)"},
      {n:2, t:"ใส่เบอร์จีนหรืออีเมล",        d:"สำหรับสมัครบัญชี"},
      {n:3, t:"ยืนยัน OTP",                  d:"รับรหัสทางเบอร์มือถือ"},
      {n:4, t:"ตั้งชื่อบัญชีและรหัสผ่าน",   d:"用户名 + รหัสผ่าน"},
      {n:5, t:"ยืนยันตัวตน",                 d:"บัตรปชช.จีน (ฟีเจอร์ขั้นสูง)",    warn:true},
      {n:6, t:"ได้รับ Baidu Account",         d:"ใช้ได้ทุก Baidu Product"},
      {n:7, t:"เปิด Notification",            d:"รับแจ้งเตือนระบบ"},
    ],
  },
  { id:2,  icon:"🔧", label:"Webmaster Tools",
    name:"ตั้งค่า Baidu Webmaster Tools", desc:"ให้ Baidu Crawl เว็บไซต์ร้านค้า",
    steps:[
      {n:8,  t:"ไปที่ ziyuan.baidu.com",      d:"สมัครใช้งาน Webmaster"},
      {n:9,  t:"เพิ่มเว็บไซต์ร้านค้า",       d:"ใส่ URL เว็บไซต์"},
      {n:10, t:"ยืนยันความเป็นเจ้าของ",      d:"HTML Tag หรือ DNS"},
      {n:11, t:"Submit Sitemap",              d:"ให้ Baidu Crawl เว็บ"},
      {n:12, t:"ตั้งค่า Crawl Rate",          d:"Preferred Domain"},
      {n:13, t:"ติดตาม Index Status",         d:"Baidu Crawl หน้าเว็บกี่หน้า"},
    ],
  },
  { id:3,  icon:"📈", label:"Baidu SEO",
    name:"ทำ Baidu SEO ติดอันดับฟรี", desc:"AI เขียน Content SEO จีนให้ทุกหน้า",
    steps:[
      {n:14, t:"วิจัย Keyword ภาษาจีน",      d:"คนจีนค้นหาเกี่ยวสินค้าไทย",        ai:true},
      {n:15, t:"เขียน Title + Meta Desc",    d:"ภาษาจีนทุกหน้าสินค้า",             ai:true},
      {n:16, t:"สร้าง Content จีนคุณภาพสูง", d:"บนเว็บไซต์",                       ai:true},
      {n:17, t:"ทำ Internal Linking",        d:"เชื่อมหน้าสินค้าต่างๆ"},
      {n:18, t:"สร้าง Backlink จากเว็บจีน",  d:"Zhihu/Tieba/Douban"},
      {n:19, t:"เว็บโหลดเร็ว + Mobile-OK",  d:""},
      {n:20, t:"ลงทะเบียน Baidu Maps",       d:"ถ้ามีหน้าร้าน"},
      {n:21, t:"ติดตาม Ranking",             d:"Webmaster Tools ทุกสัปดาห์"},
    ],
  },
  { id:4,  icon:"💰", label:"Baidu Ads",
    name:"สมัครและตั้งค่า Baidu Ads", desc:"โฆษณา SEM จ่ายต่อคลิก ผลเร็ว",
    steps:[
      {n:22, t:"ไปที่ e.baidu.com → สมัคร",  d:"Baidu Ads Account"},
      {n:23, t:"ยืนยันตัวตนและธุรกิจ",       d:"ต้องมีทะเบียนจีน หรือ Agent",       warn:true},
      {n:24, t:"ชำระเงินเปิดบัญชี",          d:"ขั้นต่ำ ~5,000 หยวน",              warn:true},
      {n:25, t:"สร้าง Campaign โฆษณาแรก",    d:"ชื่อ/งบประมาณ/วันที่"},
      {n:26, t:"สร้าง Ad Group + Keyword",   d:"เกี่ยวข้องกับสินค้า",               ai:true},
      {n:27, t:"เขียน Ad Copy ภาษาจีน",     d:"Title+Desc ดึงดูดคลิก",            ai:true},
      {n:28, t:"ตั้ง Bid ต่อ Keyword",       d:"ราคาประมูลแต่ละตัว"},
      {n:29, t:"กำหนด Target",               d:"ภูมิภาค/เวลา/อุปกรณ์",             ai:true},
    ],
  },
  { id:5,  icon:"💬", label:"Baidu Tieba",
    name:"ใช้ Baidu Tieba สร้าง Community", desc:"Forum จีนที่ใหญ่ที่สุด",
    steps:[
      {n:30, t:"เข้า tieba.baidu.com",        d:"ค้นหา Tieba เกี่ยวข้องสินค้า"},
      {n:31, t:"เข้าร่วม Tieba มีสมาชิกมาก", d:"มีส่วนร่วมก่อน สร้างความน่าเชื่อถือ"},
      {n:32, t:"โพสต์ข้อมูลสินค้า",          d:"รูป+รายละเอียด+ราคา+วิธีสั่ง",     ai:true},
      {n:33, t:"ตอบ Comment สม่ำเสมอ",       d:"สร้างตัวตนในชุมชน",               ai:true},
      {n:34, t:"สร้าง Tieba ของตัวเอง",      d:"ชื่อแบรนด์หรือสินค้า"},
      {n:35, t:"เชิญสมาชิกเข้า Tieba",       d:""},
      {n:36, t:"ใส่ลิงก์ร้านค้าใน Post",     d:"Taobao/WeChat Shop"},
    ],
  },
  { id:6,  icon:"📖", label:"Baidu Baike",
    name:"ใช้ Baidu Baike สร้าง Brand", desc:"Wikipedia จีน = Brand Authority",
    steps:[
      {n:37, t:"ไปที่ baike.baidu.com",       d:"สร้างหน้า Wiki ของแบรนด์"},
      {n:38, t:"เขียนประวัติแบรนด์/สินค้า",  d:"ที่มา/จุดเด่น ภาษาจีน",            ai:true},
      {n:39, t:"เพิ่มรูปสินค้าและ Logo",     d:""},
      {n:40, t:"ใส่ลิงก์เว็บและร้านค้า",    d:""},
      {n:41, t:"รอ Baidu Baike Approve",     d:"3-14 วัน"},
    ],
  },
  { id:7,  icon:"❓", label:"Baidu Know",
    name:"ใช้ Baidu Know สร้าง Trust", desc:"Q&A จีน = Trust ระยะยาว",
    steps:[
      {n:42, t:"เข้า zhidao.baidu.com",       d:"ค้นหาคำถามเกี่ยวสินค้าไทย"},
      {n:43, t:"ตอบคำถามอย่างละเอียด",       d:"คุณภาพสูง มีประโยชน์",             ai:true},
      {n:44, t:"แนะนำสินค้าในคำตอบ",         d:"อย่างเป็นธรรมชาติ ไม่ Spam",       ai:true},
      {n:45, t:"ใส่ลิงก์ร้านค้า",            d:"ระมัดระวัง ไม่ Spam"},
      {n:46, t:"ตอบ 2–3 คำถาม/วัน",         d:"สร้าง Authority สม่ำเสมอ"},
    ],
  },
  { id:8,  icon:"💬", label:"รับออร์เดอร์",
    name:"รับออร์เดอร์และสื่อสาร", desc:"ลูกค้าจาก Baidu → ร้านค้าภายนอก",
    steps:[
      {n:47, t:"ลูกค้าคลิกจาก Baidu",        d:"→ Taobao/WeChat/เว็บร้านค้า"},
      {n:48, t:"รับออร์เดอร์ผ่านช่องทาง",   d:"Taobao/WeChat/LINE"},
      {n:49, t:"ตอบคำถามสินค้า/ราคา/สั่ง",  d:"ตอบเร็ว = ปิดขายสูง",             ai:true},
      {n:50, t:"ยืนยันออร์เดอร์",            d:"สินค้า/จำนวน/ที่อยู่จัดส่ง"},
      {n:51, t:"แจ้งราคารวม",               d:"ค่าสินค้า + ค่าจัดส่ง"},
      {n:52, t:"ส่ง QR Alipay/WeChat/PromptPay",d:"ให้ลูกค้าชำระ"},
    ],
  },
  { id:9,  icon:"📦", label:"ชำระ+จัดส่ง",
    name:"ตรวจสอบชำระและจัดส่ง", desc:"เช็คเงินเข้าและส่งสินค้า",
    steps:[
      {n:53, t:"ตรวจสอบ Alipay/WeChat/PromptPay",d:"ยอด/วันที่/ชื่อ"},
      {n:54, t:"เช็คยอดเข้าจริง",             d:"Wallet หรือ Mobile Banking"},
      {n:55, t:"แจ้งยืนยันชำระแล้ว",          d:"ข้อความยืนยันทาง Chat",           ai:true},
      {n:56, t:"แพ็คสินค้า + ส่งพัสดุ",       d:"SF Express/ไปรษณีย์ไทย"},
      {n:57, t:"แจ้งเลข Tracking",             d:"ให้ลูกค้าติดตามพัสดุ",           ai:true},
    ],
  },
  { id:10, icon:"📊", label:"วิเคราะห์+ปรับ",
    name:"วิเคราะห์และปรับปรุง", desc:"Data-driven เพิ่ม ROI ต่อเนื่อง",
    steps:[
      {n:58, t:"ติดตาม Baidu Analytics",      d:"Traffic/Keyword/Bounce Rate"},
      {n:59, t:"ติดตาม Baidu Ads Performance", d:"CTR/CPC/ROI Dashboard"},
      {n:60, t:"ปรับ Keyword Bid",            d:"ตาม Conversion Rate",             ai:true},
      {n:61, t:"สร้าง Content ใหม่",          d:"ตาม Keyword ที่คนค้นหาบ่อย",     ai:true},
      {n:62, t:"ทำ A/B Test Ad Copy",         d:"เพิ่ม CTR ต่อเนื่อง",            ai:true},
    ],
  },
];

const C={
  bg:"#080810",card:"rgba(255,255,255,0.04)",border:"rgba(255,255,255,0.08)",
  green:"#1D9E75",blue:"#2c6bfe",
  blueBg:"rgba(44,107,254,0.11)",blueBorder:"rgba(44,107,254,0.25)",
  amber:"rgba(245,166,35,0.12)",amberText:"#f5a623",
  text:"#ffffff",muted:"rgba(255,255,255,0.44)",
};

export default function BaiduOnboarding({ onComplete }) {
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
            <span style={{fontSize:12,color:C.muted}}>× Baidu 百度</span>
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
            return <button key={i} onClick={()=>setPart(i)} style={{padding:"5px 11px",borderRadius:999,fontSize:11,fontWeight:600,fontFamily:"'Sarabun',sans-serif",cursor:"pointer",border:`1px solid ${i===part?C.blue:allDone?"rgba(44,107,254,0.3)":C.border}`,background:i===part?C.blueBg:allDone?"rgba(44,107,254,0.07)":"transparent",color:i===part?C.blue:allDone?C.blue:C.muted}}>{allDone?"✓ ":""}{pt.label}</button>;
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
            <div key={s.n} onClick={()=>toggle(s.n)} style={{display:"flex",alignItems:"flex-start",gap:11,padding:"13px 15px",borderRadius:13,cursor:"pointer",background:checked[s.n]?"rgba(44,107,254,0.05)":C.card,border:`1px solid ${checked[s.n]?"rgba(44,107,254,0.22)":C.border}`,transition:"all 0.2s"}}>
              <div style={{width:21,height:21,borderRadius:6,flexShrink:0,marginTop:1,border:`1.5px solid ${checked[s.n]?C.blue:"rgba(255,255,255,0.18)"}`,background:checked[s.n]?C.blue:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s"}}>
                {checked[s.n]&&<span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
              </div>
              <div style={{width:25,height:25,borderRadius:6,flexShrink:0,background:"rgba(44,107,254,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:700,color:C.blue,fontFamily:"'Kanit',sans-serif"}}>{s.n}</div>
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
          <button onClick={()=>{if(isLast)onComplete?.();else setPart(i=>i+1);}} style={{flex:2,padding:13,borderRadius:12,cursor:"pointer",border:"none",background:C.blue,color:"#fff",fontFamily:"'Kanit',sans-serif",fontSize:15,fontWeight:600}}>
            {isLast?"🎉 เริ่มขายของกับ OpenThai AI!":`ถัดไป: ${PARTS[part+1].label} →`}
          </button>
        </div>
      </div>
    </div>
  );
}
