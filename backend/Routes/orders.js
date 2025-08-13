const express = require('express');
const Order = require('../Models/Order');
const { orderValidationRules, validateOrder } = require('../middleware/validation/orderValidation');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('route_id'); 
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', orderValidationRules(), validateOrder, async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', orderValidationRules(), validateOrder, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
