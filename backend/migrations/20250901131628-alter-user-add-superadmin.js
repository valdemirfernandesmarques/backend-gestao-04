"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "perfil", {
      type: Sequelize.ENUM("SUPER_ADMIN", "ADMIN_ESCOLA", "USER"), // ✅ corrigido
      allowNull: false,
      defaultValue: "USER",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "perfil", {
      type: Sequelize.ENUM("ADMIN_ESCOLA", "USER"), // 🔙 rollback sem SUPER_ADMIN
      allowNull: false,
      defaultValue: "USER",
    });
  },
};
