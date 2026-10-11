const router = require('express').Router();
const { Review, User, MenuItem } = require('../models');
const { authenticate } = require('../middleware/auth');

// GET /api/reviews/:menuItemId
router.get('/:menuItemId', async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { menuItemId: req.params.menuItemId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) { next(err); }
});

// POST /api/reviews
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { menuItemId, rating, comment } = req.body;
    const existing = await Review.findOne({ where: { userId: req.user.id, menuItemId } });
    if (existing) return res.status(409).json({ error: 'Already reviewed this item' });
    const review = await Review.create({ userId: req.user.id, menuItemId, rating, comment });
    // Update average rating
    const allReviews = await Review.findAll({ where: { menuItemId } });
    const avg = allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length;
    await MenuItem.update({ averageRating: avg.toFixed(2), reviewCount: allReviews.length }, { where: { id: menuItemId } });
    res.status(201).json(review);
  } catch (err) { next(err); }
});

module.exports = router;
