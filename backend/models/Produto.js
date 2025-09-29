// backend/models/Produto.js
module.exports = (sequelize, DataTypes) => {
  const Produto = sequelize.define("Produto", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantidade: { // Estoque
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageUrl: { // ✅ Campo da imagem
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "produtos", // ⚠️ Garantir que bate com a tabela real
    timestamps: true
  });

  Produto.associate = (models) => {
    // Um produto pertence a uma escola
    Produto.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola'
    });
    // Um produto pode estar em vários itens de venda
    Produto.hasMany(models.VendaItem, {
      foreignKey: 'produtoId',
      as: 'itensVenda'
    });
  };

  return Produto;
};

