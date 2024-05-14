'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      TransactionStatus.hasMany(models.Orders, {
        as: "order",
        foreignKey: {
          name: "transactionStatusId",
        },
      });


    }
  }
  TransactionStatus.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TransactionStatus',
  });
  return TransactionStatus;
};