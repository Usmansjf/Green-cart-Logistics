const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: String, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { 
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Route',
    required: false 
  },
  delivery_time: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
