const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT      = 3000;
const DATA_FILE = path.join(__dirname, 'cnc-data.json');
const HTML_FILE = path.join(__dirname, 'cnc-decisions.html');

http.createServer((req, res) => {
  const cors = () => {
    res.setHeader('Access-Control-Allow-Origin',  '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };

  cors();

  if (req.method === 'OPTIONS') {
    res.writeHead(204); res.end(); return;
  }

  // Serve the HTML app
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    fs.readFile(HTML_FILE, (err, data) => {
      if (err) { res.writeHead(500); res.end('Error loading app'); return; }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  // Read data
  if (req.method === 'GET' && req.url === '/data') {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
      if (err) { res.writeHead(500); res.end('Error reading data'); return; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
    return;
  }

  // Write data
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        JSON.parse(body); // validate before writing
      } catch {
        res.writeHead(400); res.end('Invalid JSON'); return;
      }
      fs.writeFile(DATA_FILE, body, err => {
        if (err) { res.writeHead(500); res.end('Error saving data'); return; }
        console.log(`[${new Date().toLocaleTimeString()}] data saved`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end('{"ok":true}');
      });
    });
    return;
  }

  res.writeHead(404); res.end('Not found');

}).listen(PORT, () => {
  console.log(`CNC tool → http://localhost:${PORT}`);
});
