const router = require('express').Router();
const { User, Order } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users — admin
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']] });
    res.json(users);
  } catch (err) { next(err); }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// PATCH /api/users/:id/role — admin
router.patch('/:id/role', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.update({ role: req.body.role });
    res.json(user.toSafeJSON());
  } catch (err) { next(err); }
});

module.exports = router;
