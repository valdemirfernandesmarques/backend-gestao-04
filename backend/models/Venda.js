// backend/models/Venda.js
module.exports = (sequelize, DataTypes) => {
  const Venda = sequelize.define("Venda", {
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
    // Chaves estrangeiras
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Pode ser uma venda para um cliente não cadastrado
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // ✅ CORRIGIDO: Adicionada a função de associação
  Venda.associate = (models) => {
    // Uma venda pertence a uma escola
    Venda.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola'
    });
    // Uma venda é feita por um usuário
    Venda.belongsTo(models.User, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
    // Uma venda tem muitos itens de venda
    Venda.hasMany(models.VendaItem, {
      foreignKey: 'vendaId',
      as: 'itens'
    });
  };

  return Venda;
};