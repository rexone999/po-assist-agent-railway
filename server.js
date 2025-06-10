const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/gemini');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming JSON requests
app.use(bodyParser.json());

// 🔹 Serve the Atlassian Connect descriptor
app.get('/atlassian-connect.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});


// 🔹 Endpoint to handle chat prompt from frontend
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
