'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      ImageProducts.belongsTo(models.Users, {
        as: 'users', 
        foreignKey: {
          name: 'userId', 
        }
      });

      ImageProducts.belongsTo(models.Products, {
        as: 'product', 
        foreignKey: {
          name: 'productId', 
        }
      });

    }
  }
  ImageProducts.init({
    userId: DataTypes.STRING,
    productId: DataTypes.STRING,
    image: DataTypes.STRING,
    indexValue: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageProducts',
  });
  return ImageProducts;
};