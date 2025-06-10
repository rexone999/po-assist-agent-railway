require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/openrouter');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/chat', async (req, res) => {
  const prompt = req.body.prompt;
  try {
    const response = await chat(prompt);
    res.json({ reply: response });
  } catch (err) {
    res.status(500).json({ reply: "AI error." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
