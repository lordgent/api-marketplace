'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    
      OrderItems.belongsTo(models.Orders, {
        as: 'order', 
        foreignKey: {
          name: 'orderId', 
        }
      });


      OrderItems.belongsTo(models.Users, {
        as: 'user', 
        foreignKey: {
          name: 'buyerId', 
        }
      });

      OrderItems.belongsTo(models.Products, {
        as: 'product', 
        foreignKey: {
          name: 'productId', 
        }
      });

      
      OrderItems.belongsTo(models.Merchants, {
        as: 'merchant', 
        foreignKey: {
          name: 'sellerId', 
        }
      });


    }
  }
  OrderItems.init({
    productId: DataTypes.STRING,
    buyerId: DataTypes.STRING,
    sellerId: DataTypes.STRING,
    originalPrice: DataTypes.STRING,
    totalPrice: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    orderId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'OrderItems',
  });
  return OrderItems;
};