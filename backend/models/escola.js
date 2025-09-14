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
    // ✅ NOVO: Coluna para armazenar a URL do logotipo
    logoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
    }
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