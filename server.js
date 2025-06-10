require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ace = require('atlassian-connect-express');
const { chat } = require('./utils/gemini');

const app = express();
const addon = ace(app);         // Initialize Atlassian Connect Express
addon.configure(app);          // ⚠️ Required to configure ACE

const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware from ACE for auth & security
app.use(addon.middleware());

// Serve connect.json descriptor
app.get('/atlassian-connect.json', (req, res) => {
  res.type('application/json');
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});

// Lifecycle callback on install
app.post('/installed', addon.authenticate(), (req, res) => {
  console.log('✅ Installed:', req.body);
  res.sendStatus(204);
});

// Chat AI endpoint (no auth)
app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const reply = await chat(prompt);
    res.json({ reply });
  } catch (err) {
    console.error('❌ Gemini error:', err);
    res.status(500).json({ reply: 'Sorry, could not generate a response.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
