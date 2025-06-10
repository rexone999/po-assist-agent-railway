// public/chatbot.js

const OPENROUTER_API_KEY = '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'; // Replace this safely in production

async function sendMessageToLLM(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "[No response]";
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const output = document.getElementById("chat-output");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMsg = input.value;
    output.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
    input.value = "";

    const reply = await sendMessageToLLM(userMsg);
    output.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
    output.scrollTop = output.scrollHeight;
  });
});
