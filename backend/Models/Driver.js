const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, default: 0 },
  past_week_hours: {
    type: [String],
    validate: {
      validator: arr => arr.length <= 7,
      message: 'past_week_hours array can have at most 7 entries'
    },
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.models.Driver || mongoose.model('Driver', DriverSchema);
