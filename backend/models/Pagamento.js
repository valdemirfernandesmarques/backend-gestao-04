// backend/models/Pagamento.js
module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define("Pagamento", {
    matriculaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
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
    // Associações com alias corretos e nome real da tabela de comissão
    Pagamento.belongsTo(models.Matricula, { foreignKey: 'matriculaId', as: 'matricula' });
    Pagamento.belongsTo(models.Mensalidade, { foreignKey: 'mensalidadeId', as: 'mensalidade' });
    Pagamento.belongsTo(models.Venda, { foreignKey: 'vendaId', as: 'venda' });
    
    // Aqui informamos explicitamente a tabela real 'comissaos'
    Pagamento.hasMany(models.Comissao, { 
      foreignKey: 'pagamentoId', 
      as: 'comissoes', 
      sourceKey: 'id', 
      constraints: true, 
      onDelete: 'CASCADE', 
      tableName: 'comissaos' 
    });
    
    Pagamento.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
  };

  return Pagamento;
};
