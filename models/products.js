'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Products.hasMany(models.Carts, {
        as: 'cart', 
        foreignKey: {
          name: 'productId', 
        }
      });

      Products.hasMany(models.ImageProducts, {
        as: 'imageProduct', 
        foreignKey: {
          name: 'productId', 
        }
      });


      Products.belongsTo(models.Categories, {
        as: 'category', 
        foreignKey: {
          name: 'categoryId', 
        }
      });

      Products.belongsTo(models.Merchants, {
        as: 'merchant', 
        foreignKey: {
          name: 'merchantId', 
        }
      });

      Products.hasMany(models.OrderItems, {
        as: 'orderItems', 
        foreignKey: {
          name: 'productId', 
        }
      });

      Products.hasMany(models.Wishlist, {
        as: 'wishlist', 
        foreignKey: {
          name: 'productId', 
        }
      });


    }
  }
  Products.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    isDelete: DataTypes.INTEGER,
    photo: DataTypes.STRING,
    merchantId: DataTypes.STRING,
    categoryId: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Products',
  });
  return Products;
};