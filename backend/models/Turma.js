// backend/models/Turma.js
module.exports = (sequelize, DataTypes) => {
  const Turma = sequelize.define('Turma', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    horarioInicio: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    horarioFim: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    diaDaSemana: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxAlunos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // ✅ CORRIGIDO: Campo 'valor' removido para corresponder ao banco de dados
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    modalidadeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'turmas',
    timestamps: true,
  });

  Turma.associate = (models) => {
    Turma.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
    Turma.belongsTo(models.Modalidade, { foreignKey: 'modalidadeId', as: 'modalidade' });
    Turma.belongsTo(models.Professor, { foreignKey: 'professorId', as: 'professor' });
  };

  return Turma;
};