// backend/models/Modalidade.js
module.exports = (sequelize, DataTypes) => {
  const Modalidade = sequelize.define("Modalidade", {
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: true },
    precoAula: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    escolaId: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: "modalidades",
    timestamps: true,
  });

  Modalidade.associate = (models) => {
    Modalidade.belongsTo(models.Escola, { foreignKey: "escolaId", as: "escola" });

    // ✅ CORRIGIDO: Adicionada a relação Muitos-para-Muitos com Professor
    Modalidade.belongsToMany(models.Professor, {
      through: models.ProfessorModalidade, // A tabela de junção
      foreignKey: 'modalidadeId',
      as: 'professores'
    });
  };

  return Modalidade;
};