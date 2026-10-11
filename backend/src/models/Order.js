const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING(20), unique: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  type: { type: DataTypes.ENUM('dine_in', 'takeaway', 'delivery'), defaultValue: 'dine_in' },
  subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  tax: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  deliveryFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  deliveryAddress: { type: DataTypes.TEXT },
  tableNumber: { type: DataTypes.STRING(10) },
  specialInstructions: { type: DataTypes.TEXT },
  estimatedTime: { type: DataTypes.INTEGER },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), defaultValue: 'pending' },
  paymentMethod: { type: DataTypes.STRING(50) },
  stripePaymentIntentId: { type: DataTypes.STRING }
}, {
  tableName: 'orders',
  timestamps: true,
  hooks: {
    beforeCreate: (order) => {
      const ts = Date.now().toString(36).toUpperCase();
      order.orderNumber = `ORD-${ts}`;
    }
  }
});

module.exports = Order;
