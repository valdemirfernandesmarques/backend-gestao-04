module.exports = (sequelize, DataTypes) => {
    const Mensalidade = sequelize.define('Mensalidade', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        matriculaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Matriculas',
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
        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        dataVencimento: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO'),
            defaultValue: 'PENDENTE',
            allowNull: false
        },
    }, {
        tableName: 'Mensalidades',
        timestamps: true,
    });

    Mensalidade.associate = (models) => {
        Mensalidade.belongsTo(models.Matricula, {
            as: 'matricula',
            foreignKey: 'matriculaId'
        });
        Mensalidade.belongsTo(models.Escola, {
            as: 'escola',
            foreignKey: 'escolaId'
        });
        Mensalidade.hasMany(models.Pagamento, {
            as: 'pagamentos',
            foreignKey: 'mensalidadeId'
        });
    };

    return Mensalidade;
};