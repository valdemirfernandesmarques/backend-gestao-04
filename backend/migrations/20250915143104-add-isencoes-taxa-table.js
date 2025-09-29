'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('isencoes_taxa', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      escolaId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'escolas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      motivo: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      dataInicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dataFim: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('isencoes_taxa');
  }
};