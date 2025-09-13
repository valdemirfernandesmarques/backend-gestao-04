// backend/models/ProfessorModalidade.js
module.exports = (sequelize, DataTypes) => {
  const ProfessorModalidade = sequelize.define('ProfessorModalidade', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Professores', // Nome da tabela
        key: 'id'
      }
    },
    modalidadeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Modalidades', // Nome da tabela
        key: 'id'
      }
    }
  }, {
    tableName: 'professores_modalidades',
    timestamps: false // Tabelas de junção geralmente não precisam de timestamps
  });

  return ProfessorModalidade;
};