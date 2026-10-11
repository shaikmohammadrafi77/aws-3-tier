const router = require('express').Router();
const { Order, OrderItem, MenuItem } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/orders — create order
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { items, type, deliveryAddress, tableNumber, specialInstructions } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ error: 'Order must have items' });

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem || !menuItem.isAvailable) {
        return res.status(400).json({ error: `Item ${item.menuItemId} unavailable` });
      }
      const totalPrice = parseFloat(menuItem.price) * item.quantity;
      subtotal += totalPrice;
      orderItems.push({ menuItemId: item.menuItemId, quantity: item.quantity, unitPrice: menuItem.price, totalPrice, notes: item.notes });
    }

    const TAX_RATE = 0.08;
    const DELIVERY_FEE = type === 'delivery' ? 3.99 : 0;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + tax + DELIVERY_FEE).toFixed(2));

    const order = await Order.create({
      userId: req.user.id, type, subtotal, tax, deliveryFee: DELIVERY_FEE, total,
      deliveryAddress, tableNumber, specialInstructions, estimatedTime: 25
    });

    for (const oi of orderItems) {
      await OrderItem.create({ ...oi, orderId: order.id });
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] }]
    });

    res.status(201).json(fullOrder);
  } catch (err) { next(err); }
});

// GET /api/orders — user orders
router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'customer' ? { userId: req.user.id } : {};
    const orders = await Order.findAll({
      where,
      include: [{ model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem', attributes: ['name', 'imageUrl'] }] }],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(orders);
  } catch (err) { next(err); }
});

// GET /api/orders/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items', include: [{ model: MenuItem, as: 'menuItem' }] }]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(order);
  } catch (err) { next(err); }
});

// PATCH /api/orders/:id/status — staff/admin
router.patch('/:id/status', authenticate, authorize('admin', 'staff'), async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await order.update({ status });
    res.json(order);
  } catch (err) { next(err); }
});

// DELETE /api/orders/:id — cancel
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role === 'customer' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }
    await order.update({ status: 'cancelled' });
    res.json({ message: 'Order cancelled' });
  } catch (err) { next(err); }
});

module.exports = router;
