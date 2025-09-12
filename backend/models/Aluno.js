// backend/models/Aluno.js
module.exports = (sequelize, DataTypes) => {
  const Aluno = sequelize.define('Aluno', {
    // Corrigido para 'nome' e adicionados os outros campos da tabela
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dataNascimento: {
      type: DataTypes.DATEONLY,
    },
    genero: {
      type: DataTypes.STRING,
    },
    cpf: {
      type: DataTypes.STRING,
      unique: true,
    },
    rg: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });

  Aluno.associate = (models) => {
    Aluno.hasMany(models.Matricula, {
      foreignKey: 'alunoId',
      as: 'matriculas',
    });
    // Se quiser associar a uma escola:
    // Aluno.belongsTo(models.Escola, { foreignKey: 'escolaId', as: 'escola' });
  };

  return Aluno;
};