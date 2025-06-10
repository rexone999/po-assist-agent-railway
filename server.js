require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/gemini');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your chatbot UI)
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(bodyParser.json());

// Atlassian Connect descriptor
app.get('/atlassian-connect.json', (req, res) => {
  const descriptorPath = path.join(__dirname, 'atlassian-connect.json');
  res.type('application/json').sendFile(descriptorPath, err => {
    if (err) {
      console.error('❌ Error sending descriptor:', err.message);
      res.status(500).send({ error: 'Descriptor not available' });
    }
  });
});

// Lifecycle endpoint required by Jira
app.post('/installed', (req, res) => {
  console.log('🚀 App installed by Jira:', req.body);
  res.sendStatus(200);
});

// Chatbot endpoint
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const reply = await chat(prompt);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({ reply: 'Something went wrong while contacting the AI.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
