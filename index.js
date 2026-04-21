const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const port = process.env.PORT || 3000;

// Database setup using lowdb (stores data in db.json)
const adapter = new JSONFile('db.json');
const db = new Low(adapter);

async function initDb() {
  await db.read();
  db.data = db.data || { users: [], trades: [] };
  // ensure tables exist (initial data)
  await db.write();
}

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
  await db.read();
  const exists = db.data.users.find(u => u.username === username);
  if (exists) return res.send('Username already exists.');
  const id = (db.data.users.reduce((m, u) => Math.max(m, u.id || 0), 0) || 0) + 1;
  db.data.users.push({ id, username, password: hash });
  await db.write();
  req.session.user = { id, username };
  res.redirect('/');
});
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.send('Invalid login.');
  req.session.user = { id: user.id, username: user.username };
  res.redirect('/');
});
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/'); });

// Search trades
app.get('/search', async (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  await db.read();
  const rows = db.data.trades.filter(t =>
    t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
  );
  res.render('search', { trades: rows });
});

// Start server after DB init
initDb().then(() => {
  app.listen(port, () => console.log(`TradesHelper running at http://localhost:${port}`));
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
