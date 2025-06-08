const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/atlassian-connect.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, 'atlassian-connect.json'));
});
app.post('/installed', (req, res) => {
  console.log('✅ App installed by Jira');
  res.sendStatus(204); // 204 No Content is expected
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
app.get('/', (req, res) => {
  res.send('<h1>🎯 PO Assist Agent is Live!</h1><p>You can start building features now.</p>');
});
