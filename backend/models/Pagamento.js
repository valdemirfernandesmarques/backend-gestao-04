// backend/models/Pagamento.js
module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define("Pagamento", {
    // ✅ CORRIGIDO: mensalidadeId não pode ser nulo
    mensalidadeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dataPagamento: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    metodo: {
      type: DataTypes.STRING, // Ex: 'PIX', 'CARTAO', 'BOLETO'
      allowNull: false,
    },
  });

  // ✅ CORRIGIDO: Adicionada a função de associação
  Pagamento.associate = (models) => {
    // Um pagamento pertence a uma mensalidade
    Pagamento.belongsTo(models.Mensalidade, {
      foreignKey: 'mensalidadeId',
      as: 'mensalidade'
    });
    // Um pagamento pode gerar comissões
    Pagamento.hasMany(models.Comissao, {
      foreignKey: 'pagamentoId',
      as: 'comissoes'
    });
  };

  return Pagamento;
};