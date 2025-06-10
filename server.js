const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/openrouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// POST /chat - receives prompt, sends response
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const reply = await chat(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ reply: 'Something went wrong!' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
