module.exports = (sequelize, DataTypes) => {
  const Funcionario = sequelize.define('Funcionario', {
    // Campos baseados na sua tabela
    nomeCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nomeSocial: {
      type: DataTypes.STRING,
      allowNull: true, // Permite nulo, como na sua tabela
    },
    // Chave estrangeira
    escolaId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Permite nulo, como na sua tabela
    }
  }, {
    tableName: 'funcionarios', // Garante que o nome da tabela é o correto
    timestamps: true,
  });

  Funcionario.associate = (models) => {
    // Define a relação: um funcionário pertence a uma escola
    Funcionario.belongsTo(models.Escola, {
      foreignKey: 'escolaId',
      as: 'escola'
    });
  };

  return Funcionario;
};
