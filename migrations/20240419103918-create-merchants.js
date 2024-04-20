'use strict';
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Merchants', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.STRING,
      },
      merchant_name: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      merchant_description: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      icon: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Merchants');
  }
};