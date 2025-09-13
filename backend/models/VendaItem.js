// backend/models/VendaItem.js
module.exports = (sequelize, DataTypes) => {
  const VendaItem = sequelize.define("VendaItem", {
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
    // Chaves estrangeiras são definidas nas associações
    vendaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // ✅ CORRIGIDO: Adicionada a função de associação
  VendaItem.associate = (models) => {
    // Um item de venda pertence a uma venda
    VendaItem.belongsTo(models.Venda, {
      foreignKey: 'vendaId',
      as: 'venda'
    });
    // Um item de venda pertence a um produto
    VendaItem.belongsTo(models.Produto, {
      foreignKey: 'produtoId',
      as: 'produto'
    });
  };

  return VendaItem;
};