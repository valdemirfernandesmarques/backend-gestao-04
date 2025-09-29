module.exports = (sequelize, DataTypes) => {
    const ProfessorModalidade = sequelize.define('ProfessorModalidade', {
        // Campos que você possa ter na tabela de junção
        // Por exemplo, uma data de associação, status, etc.
    }, {
        tableName: 'professores_modalidades', // Nome da sua tabela de junção, se for diferente
        timestamps: true // Adiciona createdAt e updatedAt
    });

    ProfessorModalidade.associate = (models) => {
        // Define as associações many-to-many
        // Professor-Modalidade pertence a Professor
        ProfessorModalidade.belongsTo(models.Professor, {
            foreignKey: 'professorId',
            as: 'professor'
        });

        // Professor-Modalidade pertence a Modalidade
        ProfessorModalidade.belongsTo(models.Modalidade, {
            foreignKey: 'modalidadeId',
            as: 'modalidade'
        });
    };

    return ProfessorModalidade;
};