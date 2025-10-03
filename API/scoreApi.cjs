const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ==========================
// Score CSV Setup
// ==========================

const CSV_PATH = path.resolve(__dirname, 'scores.csv');
let scores = [];

// Load scores from CSV on startup
function loadScoresFromCSV() {
  if (!fs.existsSync(CSV_PATH)) {
    console.log('No scores.csv file found, starting fresh.');
    return;
  }
  const data = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = data.trim().split('\n');
  scores = lines.map(line => {
    const [username, score, date] = line.split(',');
    return {
      username,
      score: Number(score),
      date: new Date(date)
    };
  });
  console.log(`Loaded ${scores.length} scores from CSV.`);
}

// Save a new score to CSV
function saveScoreToCSV(scoreObj) {
  const line = `${scoreObj.username},${scoreObj.score},${scoreObj.date.toISOString()}\n`;
  fs.appendFileSync(CSV_PATH, line, 'utf-8');
}

// Load existing scores at startup
loadScoresFromCSV();

// ==========================
// User CSV Setup
// ==========================

const USER_CSV_PATH = path.resolve(__dirname, 'users.csv');
let users = [];

// Load users from CSV
function loadUsersFromCSV() {
  if (!fs.existsSync(USER_CSV_PATH)) {
    console.log('No users.csv file found, starting with empty user list.');
    return;
  }
  const data = fs.readFileSync(USER_CSV_PATH, 'utf-8').trim();
  if (!data) return;

  users = data.split('\n').map(line => {
    const [username, hashedPassword] = line.trim("").split(',');
    return { username, hashedPassword };
  });
}

function saveUserToCSV(user) {
  const line = `${user.username},${user.hashedPassword}\n`;
  fs.appendFileSync(USER_CSV_PATH, line, 'utf-8');
}

// Load users at startup
loadUsersFromCSV();

// ==========================
// Authentication Endpoints
// ==========================

// Signup endpoint
app.post('/signup', (req, res) => {
  const { username, password } = req.body;


  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  const newUser = { username, hashedPassword: password }; // Already hashed
  users.push(newUser);

  try {
    saveUserToCSV(newUser);
    res.json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Failed to save user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/hashedPassword', (req, res) => {
  const username = req.query.username;

  const userExists = users.find(u => u.username === username);
  if (!userExists) {
    return res.status(409).json({ error: 'Username doesnt exist' });
  }
  res.json(userExists.hashedPassword);
});

// ==========================
// Score Endpoints (unchanged)
// ==========================

app.post('/saveScore', (req, res) => {
  const { username, score } = req.body;
  if (!username || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const user = scores.find((element) => element.username == username);
  if (user?.score >= score) {
    res.json({ message: 'better score already exists' });
    return;
  }

  const newScore = { username, score, date: new Date() };
  scores.push(newScore);

  try {
    saveScoreToCSV(newScore);
  } catch (err) {
    console.error('Failed to save score to CSV:', err);
    return res.status(500).json({ error: 'Failed to save score' });
  }

  res.json({ message: 'Score saved' });
});

function sort(data, sortType) {
  switch (Math.abs(sortType)) {
    case 1:
      data = data.sort((a, b) => {
        if (a.username < b.username) return -1;
        if (a.username > b.username) return 1;
        return 0;
      });
      break;
    case 3:
      data = data.sort((a, b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
      });
      break;
    default:
      break;
  }
  if (sortType < 0) {
    data = data.reverse();
  }

  return data;
}

app.get('/scores', (req, res) => {
  const start = parseInt(req.query.start, 10);
  const end = parseInt(req.query.end, 10);
  const sortType = parseInt(req.query.sortType, 10);

  if (!isNaN(start) && !isNaN(end) && !isNaN(sortType)) {
    const filteredData = scores.filter((i) => i.score);
    const orderedDataByScore = filteredData.sort((a, b) => a.score == b.score ? 0 : -a.score + b.score);
    let lastScore = Infinity;
    let lastRank = 0;
    const dataWithRank = orderedDataByScore.map((element, i) => {
      if (sortType == 2 && element.score == lastScore) {
        element.rank = "-";
      } else {
        element.rank = element.score == lastScore ? lastRank : i + 1;
        lastRank = element.rank;
        lastScore = element.score;
      }
      return element;
    });
    res.json(sort(dataWithRank, sortType).slice(start, Math.min(end, scores.length)));
  } else {
    res.json(scores.slice(0, 0));
  }
});

app.get('/scoresFromUsername', (req, res) => {
  const itemsPerPage = parseInt(req.query.itemsPerPage, 10);
  const username = req.query.username;

  if (!isNaN(itemsPerPage) && username?.trim()) {
    const filteredData = scores.filter((i) => i.score);
    const orderedDataByScore = filteredData.sort((a, b) => a.score == b.score ? 0 : -a.score + b.score);
    let lastScore = Infinity;
    const dataWithRank = orderedDataByScore.map((element, i) => {
      if (element.score == lastScore) {
        element.rank = "-";
      } else {
        element.rank = i + 1;
        lastScore = element.score;
      }
      return element;
    });
    const index = dataWithRank.findIndex((i) => i.username == username);
    const page = Math.floor(index / itemsPerPage);
    res.json(page);
  } else {
    res.json({ data: [], page: 0 });
  }
});


app.get('/scoreFromUsername', (req, res) => {
  const username = req.query.username;

  if (username?.trim()) {
    const user = scores.find((element) => element.username == username);
    if (user){
      res.json(user.score);
    }else
      res.json(0);
    }
});


app.get('/entries', (req, res) => {
  res.json(scores.length);
});

// ==========================
// Server Start
// ==========================

app.listen(port, () => {
  console.log(`Score API listening at http://localhost:${port}`);
});
