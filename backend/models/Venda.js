// backend/models/Venda.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Venda = sequelize.define(
    "Venda",
    {
      totalBruto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      totalDescontos: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      totalLiquido: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      metodoPagamento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataVenda: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Pendente", "Concluida", "Cancelada"),
        defaultValue: "Pendente",
        allowNull: false,
      },
      escolaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      alunoId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "vendas", // ✅ Corrigido para bater com o banco
    }
  );

  Venda.associate = (models) => {
    // Uma venda tem vários itens
    Venda.hasMany(models.VendaItem, {
      foreignKey: "vendaId",
      as: "itens",
    });

    // Uma venda pode ter vários pagamentos
    Venda.hasMany(models.Pagamento, {
      foreignKey: "vendaId",
      as: "pagamentos",
    });

    // Uma venda pertence a um usuário (quem registrou)
    Venda.belongsTo(models.User, {
      foreignKey: "usuarioId",
      as: "usuario",
    });

    // Uma venda pertence a uma escola
    Venda.belongsTo(models.Escola, {
      foreignKey: "escolaId",
      as: "escola",
    });

    // Uma venda pode estar vinculada a um aluno
    Venda.belongsTo(models.Aluno, {
      foreignKey: "alunoId",
      as: "aluno",
    });
  };

  return Venda;
};
