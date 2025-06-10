const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/openrouter');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// JSON parsing
app.use(bodyParser.json());

// Descriptor route
app.get('/atlassian-connect.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});

// AI chat route
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const reply = await chat(prompt);
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ reply: 'Something went wrong while contacting the AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
