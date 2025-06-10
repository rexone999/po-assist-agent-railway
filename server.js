require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ace = require('atlassian-connect-express');
const { chat } = require('./utils/gemini');

const app = express();
const addon = ace(app); // init Atlassian Connect

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(addon.middleware()); // Atlassian middleware
app.use(express.static(path.join(__dirname, 'public'))); // UI

// Atlassian descriptor
app.get('/atlassian-connect.json', (req, res) => {
  res.type('application/json');
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});

// Jira lifecycle event
app.post('/installed', addon.authenticate(), (req, res) => {
  console.log('✅ App installed by Jira:', req.body);
  res.sendStatus(200);
});

// Chatbot route
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const reply = await chat(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('❌ Chat error:', err.message);
    res.status(500).json({ reply: 'AI error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 App running on http://localhost:${PORT}`);
});
