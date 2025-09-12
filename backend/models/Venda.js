// backend/models/Venda.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Venda", {
    totalBruto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalDescontos: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    totalLiquido: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    metodoPagamento: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "PIX",
    },
    dataVenda: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
