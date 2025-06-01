const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../models/data');

const router = express.Router();

const JWT_SECRET = 'supersecretkey'; // In production, use env variable

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, passwordHash };
  users.push(user);
  res.status(201).json({ message: 'User registered successfully.' });
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router; 