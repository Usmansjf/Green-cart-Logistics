require('dotenv').config();
const mongoose = require('mongoose');
const Driver = require('./Models/Driver');
const Route = require('./Models/Route');
const Order = require('./Models/Order');
const SimulationResult = require('./Models/SimulationResult');

async function clearAllData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});
	await SimulationResult.deleteMany({});
    console.log('All collections cleared');
  } catch (err) {
    console.error('Error clearing collections:', err);
  } finally {
    await mongoose.disconnect();
  }
}

clearAllData();
