require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');



const authRoutes = require('./Routes/auth');
const authenticateToken = require('./middleware/authMiddleware');
const loadData = require('./loadInitialData');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api', authenticateToken);

app.use('/api/drivers', require('./Routes/drivers'));
app.use('/api/routes', require('./Routes/routes'));
app.use('/api/orders', require('./Routes/orders'));
app.use('/api/simulate', require('./Routes/simulate'));
app.use('/api/load-data', require('./Routes/loadData'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await loadData();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
