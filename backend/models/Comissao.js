module.exports = (sequelize, DataTypes) => {
  const Comissao = sequelize.define("Comissao", {
    pagamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  Comissao.associate = (models) => {
    Comissao.belongsTo(models.Professor, {
      foreignKey: 'professorId',
      as: 'professor',
    });
    Comissao.belongsTo(models.Pagamento, {
      foreignKey: 'pagamentoId',
      as: 'pagamento',
    });
  };

  return Comissao;
};
