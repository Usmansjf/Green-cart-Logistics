const { body, validationResult } = require('express-validator');

const loginValidationRules = () => {
  return [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

const validateLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  loginValidationRules,
  validateLogin,
};
