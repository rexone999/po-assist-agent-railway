require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ace = require('atlassian-connect-express');
const { chat } = require('./utils/gemini');

const app = express();
const addon = ace(app);
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(addon.middleware()); // Important for Atlassian Connect
app.use(express.static(path.join(__dirname, 'public')));

// Serve descriptor
app.get('/atlassian-connect.json', (req, res) => {
  res.type('application/json');
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});

// Lifecycle endpoint
app.post('/installed', addon.authenticate(), (req, res) => {
  console.log('✅ App installed:', req.body);
  res.sendStatus(200);
});

// Chatbot route
app.post('/chat', async (req, res) => {
  try {
    const reply = await chat(req.body.prompt);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Error in chatbot:', error.message);
    res.status(500).json({ reply: 'AI Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
