const axios = require('axios');
require('dotenv').config(); // Loads .env variables

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in .env");
}

async function chat(prompt) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      body,
      {
        headers: {
          "Content-Type": "application/json"
        },
        params: {
          key: GEMINI_API_KEY
        }
      }
    );

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return result || "No response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.response?.data || error.message);
    return "AI request failed.";
  }
}

module.exports = { chat };
