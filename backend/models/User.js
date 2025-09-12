// backend/models/User.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
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
      type: DataTypes.ENUM("SUPER_ADMIN", "ADMIN", "USUARIO"),
      defaultValue: "USUARIO",
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
};
