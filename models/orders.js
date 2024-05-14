'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     
      Orders.hasMany(models.OrderItems, {
        as: 'orderItems', 
        foreignKey: {
          name: 'orderId', 
        }
      });

      Orders.belongsTo(models.Users, {
        as: 'user', 
        foreignKey: {
          name: 'buyerId', 
        }
      });

      Orders.belongsTo(models.TransactionStatus, {
        as: 'transactionStatus', 
        foreignKey: {
          name: 'transactionStatusId', 
        }
      });
    }
  }
  Orders.init({
    buyerId: DataTypes.STRING,
    code: DataTypes.STRING,
    totalPrice: DataTypes.STRING,
    transactionStatusId: DataTypes.STRING,
    proofPayment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Orders',
  });
  return Orders;
};