'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AccessRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      AccessRoles.belongsTo(models.Roles, {
        as: "roles",
        foreignKey: {
          name: "roleId",
        },
      });

      AccessRoles.belongsTo(models.Users, {
        as: "user",
        foreignKey: {
          name: "userId",
        },
      });
      
    }
  }
  AccessRoles.init({
    userId: DataTypes.STRING,
    roleId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AccessRoles',
  });
  return AccessRoles;
};