'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Wishlist.belongsTo(models.Users, {
        as: 'user', 
        foreignKey: {
          name: 'userId', 
        }
      });

      Wishlist.belongsTo(models.Products, {
        as: 'product', 
        foreignKey: {
          name: 'productId', 
        }
      });


    }
  }
  Wishlist.init({
    userId: DataTypes.STRING,
    productId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wishlist',
  });
  return Wishlist;
};