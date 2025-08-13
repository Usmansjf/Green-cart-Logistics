const express = require('express');
const SimulationResult = require('../Models/SimulationResult');
const { runSimulation } = require('../utils/simulationEngine');
const { simulationValidationRules, validateSimulation } = require('../middleware/validation/simulationValidation');

const router = express.Router();

router.post('/', simulationValidationRules(), validateSimulation, async (req, res) => {
  try {
    const { numDrivers, startTime, maxHoursPerDriver } = req.body;

    const result = await runSimulation({ numDrivers, startTime, maxHoursPerDriver });

    // Save result to DB
    const sim = new SimulationResult(result);
    await sim.save();

    res.json(result);
  } catch (err) {
    console.error('Simulation error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const sims = await SimulationResult.find()
      .sort({ createdAt: -1 })
      .lean();


    res.json(sims);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;