// backend/models/Professor.js
module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('Professor', {
    nome: { type: DataTypes.STRING, allowNull: false },
    cpf: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    telefone: { type: DataTypes.STRING },
    endereco: { type: DataTypes.STRING },
    vinculo: { type: DataTypes.ENUM('CLT', 'Autônomo', 'Comissão'), allowNull: false },
    ativo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    // ✅ CORRIGIDO: Diz ao Sequelize o nome exato da tabela no banco (no singular)
    tableName: 'professor',
    timestamps: true
  });

  Professor.associate = (models) => {
    Professor.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola', allowNull: false });
    
    // A relação Muitos-para-Muitos com Modalidade já está correta
    Professor.belongsToMany(models.Modalidade, {
      through: models.ProfessorModalidade,
      foreignKey: 'professorId',
      as: 'modalidades'
    });
  };

  return Professor;
};