const axios = require('axios');

const OPENROUTER_API_KEY = "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";

async function chat(prompt) {
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
}

module.exports = { chat };
