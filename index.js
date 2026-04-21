const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Database setup
const db = new sqlite3.Database('tradeshelper.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    category TEXT,
    description TEXT
  )`);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'tradeshelpersecret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => res.render('index', { user: req.session.user }));
app.get('/signup', (req, res) => res.render('signup'));
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(err) {
    if (err) return res.send('Username already exists.');
    req.session.user = { id: this.lastID, username };
    res.redirect('/');
  });
});
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) return res.send('Invalid login.');
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/');
  });
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

// Search trades
app.get('/search', (req, res) => {
  const q = `%${req.query.q || ''}%`;
  db.all('SELECT * FROM trades WHERE name LIKE ? OR category LIKE ? OR description LIKE ?', [q, q, q], (err, rows) => {
    res.render('search', { trades: rows });
  });
});

// Start server
app.listen(port, () => console.log(`TradesHelper running at http://localhost:${port}`));
