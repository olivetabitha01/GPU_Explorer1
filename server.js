// server.js — GPU Explorer
// Simple Express static file server for Render deployment

const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve all static files from the root
app.use(express.static(path.join(__dirname)));

// Fallback: any unknown route → index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ GPU Explorer running on port ${PORT}`);
});
