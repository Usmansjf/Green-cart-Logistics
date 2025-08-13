const mongoose = require('mongoose');

const SimulationResultSchema = new mongoose.Schema({
  inputs: {
    numDrivers: { type: Number, required: true },
    startTime: { type: String, required: true },
    maxHoursPerDriver: { type: Number, required: true }
  },
  kpis: {
    totalProfit: { type: Number, required: true },
    efficiency: { type: Number, required: true },
    onTime: { type: Number, required: true },
    late: { type: Number, required: true },
    fuelCostTotal: { type: Number, required: true },
    fuelBreakdown: {
      high: { type: Number, required: true },
      normal: { type: Number, required: true }
    }
  },
  allocations: [
    {
      order_id: { type: String, required: true },  
      driver_name: { type: String, required: true },  
      estimatedDeliveryTimeMinutes: { type: Number, required: true },
      onTime: { type: Boolean, required: true },
      profit: { type: Number, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('SimulationResult', SimulationResultSchema);