'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'perfil', {
      type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN_ESCOLA', 'USUARIO'),
      defaultValue: 'USUARIO',
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'perfil', {
      type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN', 'USUARIO'),
      defaultValue: 'USUARIO',
      allowNull: false,
    });
  }
};