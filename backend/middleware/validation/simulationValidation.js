const { body, validationResult } = require('express-validator');

const simulationValidationRules = () => [
  body('numDrivers').isInt({ min: 1 }).withMessage('Number of drivers must be a positive integer'),
  body('startTime').matches(/^\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM format'),
  body('maxHoursPerDriver').isFloat({ min: 0 }).withMessage('Max hours must be a non-negative number')
];

const validateSimulation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { simulationValidationRules, validateSimulation };