require('dotenv').config(); // ✅ Load env vars

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { chat } = require('./utils/openrouter');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('/atlassian-connect.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const reply = await chat(req.body.prompt);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: 'Error in AI service' });
  }
});

// existing endpoints…
app.post('/installed', (req, res) => res.sendStatus(204));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
