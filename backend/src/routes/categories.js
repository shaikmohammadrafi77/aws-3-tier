const router = require('express').Router();
const { Category, MenuItem } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { cache } = require('../config/redis');

// GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const cacheKey = 'categories:all';
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(cached);
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC']]
    });
    await cache.set(cacheKey, categories, 600);
    res.json(categories);
  } catch (err) { next(err); }
});

// POST /api/categories — admin only
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    await cache.del('categories:all');
    res.status(201).json(category);
  } catch (err) { next(err); }
});

// PUT /api/categories/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.update(req.body);
    await cache.del('categories:all');
    res.json(category);
  } catch (err) { next(err); }
});

// DELETE /api/categories/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await category.update({ isActive: false });
    await cache.del('categories:all');
    res.json({ message: 'Category deactivated' });
  } catch (err) { next(err); }
});

module.exports = router;
