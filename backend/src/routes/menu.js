const router = require('express').Router();
const { Op } = require('sequelize');
const { MenuItem, Category } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { cache } = require('../config/redis');

// GET /api/menu?category=&search=&page=&limit=
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 20, vegetarian, vegan } = req.query;
    const offset = (page - 1) * limit;
    const where = { isAvailable: true };
    if (category) where.categoryId = category;
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (vegetarian === 'true') where.isVegetarian = true;
    if (vegan === 'true') where.isVegan = true;

    const cacheKey = `menu:${JSON.stringify({ category, search, page, limit, vegetarian, vegan })}`;
    const cached = await cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { count, rows } = await MenuItem.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const result = { items: rows, total: count, page: parseInt(page), pages: Math.ceil(count / limit) };
    await cache.set(cacheKey, result, 300);
    res.json(result);
  } catch (err) { next(err); }
});

// GET /api/menu/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }]
    });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// POST /api/menu — admin
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    await cache.flush('menu:*');
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// PUT /api/menu/:id — admin
router.put('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.update(req.body);
    await cache.flush('menu:*');
    res.json(item);
  } catch (err) { next(err); }
});

// DELETE /api/menu/:id — admin
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.update({ isAvailable: false });
    await cache.flush('menu:*');
    res.json({ message: 'Item hidden from menu' });
  } catch (err) { next(err); }
});

module.exports = router;
