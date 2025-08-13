const { body, validationResult } = require('express-validator');

const orderValidationRules = () => {
  return [
    body('order_id')
      .notEmpty()
      .withMessage('Order ID is required'),

    body('value_rs')
      .notEmpty()
      .withMessage('Order value is required')
      .isNumeric()
      .withMessage('Order value must be a number'),

    body('route_id')
      .optional({ nullable: true })
      .isMongoId()
      .withMessage('Route ID must be a valid MongoDB ObjectId'),

    body('delivery_time')
      .notEmpty()
      .withMessage('Delivery time is required')
      .isISO8601()
      .withMessage('Delivery time must be a valid date'),
  ];
};

const validateOrder = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  orderValidationRules,
  validateOrder,
};
