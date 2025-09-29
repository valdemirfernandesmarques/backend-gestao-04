module.exports = (sequelize, DataTypes) => {
    const Matricula = sequelize.define('Matricula', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        dataMatricula: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('ATIVA', 'INATIVA', 'CONCLUIDA'),
            defaultValue: 'ATIVA',
            allowNull: false
        },
        alunoId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Alunos',
                key: 'id'
            }
        },
        turmaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Turmas',
                key: 'id'
            }
        },
        escolaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Escolas',
                key: 'id'
            }
        },
        valorMensalidade: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
    }, {
        tableName: 'Matriculas',
        timestamps: true
    });

    Matricula.associate = (models) => {
        Matricula.belongsTo(models.Aluno, {
            as: 'aluno',
            foreignKey: 'alunoId'
        });
        Matricula.belongsTo(models.Turma, {
            as: 'turma',
            foreignKey: 'turmaId'
        });
        Matricula.belongsTo(models.Escola, {
            as: 'escola',
            foreignKey: 'escolaId'
        });
        Matricula.hasMany(models.Mensalidade, {
            as: 'mensalidades',
            foreignKey: 'matriculaId',
            onDelete: 'CASCADE'
        });
        // Removido: A lógica de criação de mensalidade de teste foi movida.
    };

    return Matricula;
};