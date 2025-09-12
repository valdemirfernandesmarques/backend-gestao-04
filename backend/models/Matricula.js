// backend/models/Matricula.js
module.exports = (sequelize, DataTypes) => {
  const Matricula = sequelize.define('Matricula', {
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'ATIVA',
    },
    alunoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    turmaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Matricula.associate = (models) => {
    Matricula.belongsTo(models.Aluno, { foreignKey: 'alunoId', as: 'aluno' });
    Matricula.belongsTo(models.Turma, { foreignKey: 'turmaId', as: 'turma' });
    Matricula.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
    
    // ✅ CORRIGIDO: Adicionada a regra de exclusão em cascata
    Matricula.hasMany(models.Mensalidade, {
      foreignKey: 'matriculaId',
      as: 'mensalidades',
      onDelete: 'CASCADE', // Se a matrícula for deletada, delete as mensalidades
      hooks: true // Garante que os hooks do Sequelize sejam acionados
    });
  };

  return Matricula;
};