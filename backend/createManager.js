require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Manager = require('./Models/Manager');

async function createManager() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const username = 'admin';
  const password = 'yourStrongPassword';

  const existing = await Manager.findOne({ username });
  if (existing) {
    console.log('Manager already exists');
    return mongoose.disconnect();
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const manager = new Manager({ username, passwordHash });
  await manager.save();

  console.log(`Manager user "${username}" created with password "${password}"`);
  mongoose.disconnect();
}

createManager();
