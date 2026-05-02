// lib/openthaigpt.js - ตัวเชื่อมต่อ OpenThaiGPT สำหรับ ThaiForge AI

const OpenAI = require('openai');

const thaiAI = new OpenAI({
  baseURL: 'https://api.aieat.or.th/v1',
  apiKey: process.env.OPENTHAIGPT_KEY || 'dummy-key-for-local',
});

module.exports = { thaiAI };

// ฟังก์ชันทดสอบ
async function testConnection() {
  try {
    const response = await thaiAI.chat.completions.create({
      model: "openthaigpt-1.5-72b",
      messages: [{ role: "user", content: "ทดสอบการเชื่อมต่อ OpenThaiGPT" }],
      max_tokens: 20,
    });
    console.log("✅ เชื่อมต่อ OpenThaiGPT สำเร็จ");
    return true;
  } catch (error) {
    console.error("❌ เชื่อมต่อ OpenThaiGPT ล้มเหลว:", error.message);
    return false;
  }
}

module.exports.testConnection = testConnection;