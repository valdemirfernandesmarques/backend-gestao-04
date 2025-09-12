// backend/models/Escola.js
module.exports = (sequelize, DataTypes) => {
  const Escola = sequelize.define('Escola', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isencaoAtiva: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Escola.associate = (models) => {
    Escola.hasMany(models.Matricula, {
      foreignKey: 'escolaId',
      as: 'matriculas',
    });
    Escola.hasMany(models.User, {
      foreignKey: 'escolaId',
      as: 'usuarios',
    });
  };

  return Escola;
};
