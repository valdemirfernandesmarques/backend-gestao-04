// models/IsencaoTaxa.js
module.exports = (sequelize, DataTypes) => {
  const IsencaoTaxa = sequelize.define("IsencaoTaxa", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'escolas', // Referência corrigida para o nome da tabela
        key: 'id'
      }
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: "isencoes_taxa",
    timestamps: true
  });

  IsencaoTaxa.associate = (models) => {
    IsencaoTaxa.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola'
    });
  };

  return IsencaoTaxa;
};