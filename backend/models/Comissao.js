// backend/models/Comissao.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Comissao", {
    pagamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
};
