const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false },
  menuItemId: { type: DataTypes.UUID, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  customizations: { type: DataTypes.JSONB, defaultValue: {} },
  notes: { type: DataTypes.TEXT }
}, { tableName: 'order_items', timestamps: true });

module.exports = OrderItem;
