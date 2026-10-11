const { sequelize } = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Review = require('./Review');

// Associations
Category.hasMany(MenuItem, { foreignKey: 'categoryId', as: 'items' });
MenuItem.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menuItemId' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
MenuItem.hasMany(Review, { foreignKey: 'menuItemId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(MenuItem, { foreignKey: 'menuItemId', as: 'menuItem' });

module.exports = { sequelize, User, Category, MenuItem, Order, OrderItem, Review };
