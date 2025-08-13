const mongoose = require('mongoose');

const ManagerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const Manager = mongoose.models.Manager || mongoose.model('Manager', ManagerSchema);

module.exports = Manager;
