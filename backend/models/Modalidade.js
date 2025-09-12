// backend/models/Modalidade.js
module.exports = (sequelize, DataTypes) => {
  const Modalidade = sequelize.define(
    "Modalidade",
    {
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      precoAula: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      escolaId: {
        type: DataTypes.INTEGER,
        // ✅ CORRIGIDO: Alinhado com a estrutura da sua tabela
        allowNull: true,
      },
    },
    {
      tableName: "modalidades",
      timestamps: true,
    }
  );

  Modalidade.associate = (models) => {
    Modalidade.belongsTo(models.Escola, { foreignKey: "escolaId", as: "escola" });
  };

  return Modalidade;
};