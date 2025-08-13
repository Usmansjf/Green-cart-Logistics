// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Manager = require('../Models/Manager');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET ||
  'e527aa068eeb3d172f035281e815d6df5b1703b880003f2e928218142ffe5cfeed803d893962f588f822443ee0a9f4509d4022def0389adb78ff709b06fa7fd1';

router.post('/register', async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    username = username.trim().toLowerCase();
    password = password.trim();

    if (username.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await Manager.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const manager = new Manager({ username, passwordHash });
    await manager.save();

    return res.status(201).json({ message: 'Manager created successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    username = username.trim().toLowerCase();
    password = password.trim();

    const manager = await Manager.findOne({ username });
    if (!manager) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, manager.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: manager._id, username: manager.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
