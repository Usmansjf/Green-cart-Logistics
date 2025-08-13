// backend/middleware/validation/routeValidation.js
const { body, validationResult } = require('express-validator');

const routeValidationRules = () => {
  return [
    body('startLocation').notEmpty().withMessage('Start location is required'),
    body('endLocation').notEmpty().withMessage('End location is required'),
    body('distance')
      .notEmpty()
      .withMessage('Distance is required')
      .isNumeric()
      .withMessage('Distance must be a number'),
  ];
};

const validateRoute = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  routeValidationRules,
  validateRoute,
};
