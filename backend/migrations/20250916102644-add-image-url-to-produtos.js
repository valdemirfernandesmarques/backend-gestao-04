'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('produtos', 'imageUrl', {
      type: Sequelize.STRING,
      allowNull: true, // A imagem é opcional
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('produtos', 'imageUrl');
  }
};