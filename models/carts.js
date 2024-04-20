'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Carts.belongsTo(models.Users, {
        as: 'users', 
        foreignKey: {
          name: 'userId', 
        }
      });

      Carts.belongsTo(models.Products, {
        as: 'product', 
        foreignKey: {
          name: 'productId', 
        }
      });


    }
  }
  Carts.init({
    userId: DataTypes.STRING,
    productId: DataTypes.STRING,
    qty: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Carts',
  });
  return Carts;
};