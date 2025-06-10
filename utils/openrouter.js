const axios = require('axios');
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function chat(prompt) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]
  };

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

  return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}

module.exports = { chat };
