const express = require('express');
const loadData = require('../loadInitialData');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await loadData();
    res.json({ message: 'CSV data loaded successfully (new entries only).' });
  } catch (err) {
    console.error('Error loading CSV data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

module.exports = router;
