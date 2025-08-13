const express = require('express');
const Driver = require('../Models/Driver');
const router = express.Router();

const { driverValidationRules, validateDriver } = require('../middleware/validation/driverValidation');

router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', driverValidationRules(), validateDriver, async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', driverValidationRules(), validateDriver, async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!driver) return res.status(404).json({ error: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Driver.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
