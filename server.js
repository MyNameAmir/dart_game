const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize SQLite database
const db = new sqlite3.Database('./scores.db', (err) => {
  if (err) {
    console.error('Database error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      playerName TEXT NOT NULL,
      score INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Database table ready');
    }
  });
}

// API Endpoints

// Submit a score
app.post('/api/scores', (req, res) => {
  const { playerName, score } = req.body;

  if (!playerName || score === undefined) {
    return res.status(400).json({ error: 'Missing playerName or score' });
  }

  const stmt = db.prepare(`INSERT INTO scores (playerName, score) VALUES (?, ?)`);
  stmt.run([playerName, score], function(err) {
    if (err) {
      console.error('Error inserting score:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ success: true, id: this.lastID });
    }
  });
});

// Get top 3 scores
app.get('/api/top-scores', (req, res) => {
  db.all(`
    SELECT playerName, score, timestamp FROM scores 
    ORDER BY score DESC 
    LIMIT 3
  `, [], (err, rows) => {
    if (err) {
      console.error('Error fetching scores:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows || []);
    }
  });
});

// Get all scores for a player
app.get('/api/player-scores/:playerName', (req, res) => {
  const { playerName } = req.params;

  db.all(`
    SELECT score, timestamp FROM scores 
    WHERE playerName = ? 
    ORDER BY timestamp DESC
  `, [playerName], (err, rows) => {
    if (err) {
      console.error('Error fetching player scores:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows || []);
    }
  });
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dart Game server running at http://localhost:${PORT}`);
});
