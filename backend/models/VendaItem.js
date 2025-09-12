// backend/models/VendaItem.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("VendaItem", {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precoUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    vendaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
