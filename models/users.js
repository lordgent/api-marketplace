'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Users.hasMany(models.Carts, {
        as: 'carts', 
        foreignKey: {
          name: 'userId', 
        }
      });

      Users.hasMany(models.ImageProducts, {
        as: 'imageProduct', 
        foreignKey: {
          name: 'userId', 
        }
      });

      Users.hasMany(models.Merchants, {
        as: 'merchants',
        foreignKey: {
          name: "userId"
        }
      });

      Users.hasMany(models.AccessRoles, {
        as: 'accessRoles',
        foreignKey: {
          name: 'userId'
        }
      });

      Users.hasMany(models.OrderItems, {
        as: 'orderItems', 
        foreignKey: {
          name: 'buyerId', 
        }
      });

      Users.hasMany(models.Orders, {
        as: 'order', 
        foreignKey: {
          name: 'buyerId', 
        }
      });

    
    }
  }
  Users.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    postalCode: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};