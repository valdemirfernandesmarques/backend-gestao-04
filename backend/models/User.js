// backend/models/User.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN_ESCOLA", "USUARIO"),
      defaultValue: "USUARIO",
      // ✅ NOVO: Validação para garantir que o perfil seja um dos valores do ENUM
      validate: {
        isIn: [["SUPER_ADMIN", "ADMIN_ESCOLA", "USUARIO"]],
      },
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  return User;
};