'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Merchants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Merchants.belongsTo(models.Users, {
        as: 'users', 
        foreignKey: {
          name: 'userId', 
        }
      });

      Merchants.hasMany(models.Products, {
        as: 'products', 
        foreignKey: {
          name: 'merchantId', 
        }
      });


    }
  }
  Merchants.init({
    merchant_name: DataTypes.STRING,
    userId: DataTypes.STRING,
    merchant_description: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    address: DataTypes.STRING,
    icon: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Merchants',
  });
  return Merchants;
};