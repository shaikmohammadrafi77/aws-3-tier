const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  imageUrl: { type: DataTypes.STRING },
  categoryId: { type: DataTypes.UUID, allowNull: false },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  isVegetarian: { type: DataTypes.BOOLEAN, defaultValue: false },
  isVegan: { type: DataTypes.BOOLEAN, defaultValue: false },
  spicyLevel: { type: DataTypes.INTEGER, defaultValue: 0, validate: { min: 0, max: 3 } },
  prepTimeMinutes: { type: DataTypes.INTEGER, defaultValue: 15 },
  calories: { type: DataTypes.INTEGER },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  averageRating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'menu_items', timestamps: true });

module.exports = MenuItem;
