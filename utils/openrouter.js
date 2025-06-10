const axios = require('axios');
require('dotenv').config(); // Load .env variables

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
console.log("Loaded API Key:", process.env.OPENROUTER_API_KEY);

async function chat(prompt) {
  try {
    const resp = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: prompt }],
    }, {
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return resp.data.choices?.[0]?.message?.content || 'No response from model.';
  } catch (err) {
    console.error("❌ OpenRouter API error:", err.response?.data || err.message);
    throw new Error("Failed to fetch from AI API");
  }
}

module.exports = { chat };
