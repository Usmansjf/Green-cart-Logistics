// backend/middleware/validation/driverValidation.js
const { body, validationResult } = require('express-validator');

const driverValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('licenseNumber').notEmpty().withMessage('License Number is required'),
    body('phoneNumber')
      .optional()
      .isMobilePhone()
      .withMessage('Invalid phone number'),
  ];
};

const validateDriver = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  driverValidationRules,
  validateDriver,
};
