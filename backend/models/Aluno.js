// backend/models/aluno.js
module.exports = (sequelize, DataTypes) => {
    const Aluno = sequelize.define('Aluno', {
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dataNascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        cpf: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endereco: {
            type: DataTypes.TEXT,
            allowNull: true
        },
    }, {
        tableName: 'Alunos'
    });

    Aluno.associate = (models) => {
        Aluno.belongsTo(models.Escola, {
            foreignKey: 'escolaId',
            as: 'escola'
        });
        Aluno.hasMany(models.Matricula, {
            foreignKey: 'alunoId',
            as: 'matriculas'
        });
        // ✅ CORREÇÃO: Adicionando a associação com Venda
        Aluno.hasMany(models.Venda, {
            foreignKey: 'alunoId',
            as: 'vendas'
        });
    };

    return Aluno;
};