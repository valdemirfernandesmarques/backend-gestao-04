// backend/models/Mensalidade.js
module.exports = (sequelize, DataTypes) => {
  const Mensalidade = sequelize.define('Mensalidade', {
    matriculaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // ✅ CORRIGIDO: Adicionado o campo escolaId
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    dataVencimento: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING, // PENDENTE, PAGA, ATRASADA
      allowNull: false,
      defaultValue: 'PENDENTE',
    }
  });

  Mensalidade.associate = (models) => {
    Mensalidade.belongsTo(models.Matricula, { foreignKey: 'matriculaId', as: 'matricula' });
    Mensalidade.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' }); // ✅ CORRIGIDO: Adicionada a associação
    Mensalidade.hasMany(models.Pagamento, { foreignKey: 'mensalidadeId', as: 'pagamentos' });
  };

  return Mensalidade;
};