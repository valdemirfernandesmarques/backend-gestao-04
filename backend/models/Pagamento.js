// backend/models/Pagamento.js
module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define("Pagamento", {
    mensalidadeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vendaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Pagamento.associate = (models) => {
    Pagamento.belongsTo(models.Mensalidade, { foreignKey: 'mensalidadeId', as: 'mensalidade' });
    Pagamento.belongsTo(models.Venda, { foreignKey: 'vendaId', as: 'venda' });
    Pagamento.hasMany(models.Comissao, { foreignKey: 'pagamentoId', as: 'comissoes' });
  };

  return Pagamento;
};