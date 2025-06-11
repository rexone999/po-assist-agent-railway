const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const ace = require('atlassian-connect-express');

const app = express();
const addon = ace(app, {
  config: {
    store: {
      adapter: 'memory'
    }
  }
});


const PORT = process.env.PORT || 3000;

app.set('port', PORT);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(addon.middleware());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Lifecycle route: Installed
app.post('/installed', addon.authenticate(), (req, res) => {
  console.log('App installed by:', req.body.clientKey);
  res.sendStatus(204);
});

// Basic route
app.get('/', (req, res) => {
  res.send('PO Assist Agent running');
});

// Start server
http.createServer(app).listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
