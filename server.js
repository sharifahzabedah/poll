const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, 'pollData.json');

app.use(express.json());
app.use(express.static('public'));

// Get current poll results
app.get('/api/results', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.json(data);
});

// Submit a new vote
app.post('/api/vote', (req, res) => {
  const { answer } = req.body;
  if (!['yes', 'no', 'not_sure'].includes(answer)) {
    return res.status(400).json({ error: 'Invalid answer' });
  }

  const data = JSON.parse(fs.readFileSync(dataFile));
  data[answer]++;
  data.total++;

  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.json(data);
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
