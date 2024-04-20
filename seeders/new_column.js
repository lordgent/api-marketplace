'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Categroies', 'icon', {
      type: Sequelize.STRING,
    });
  },

};
