// backend/controllers/mensalidadeController.js
const db = require('../models');

// Função interna para criar mensalidade
const criarMensalidade = async (dados, transaction) => {
    return db.Mensalidade.create(dados, { transaction });
};

// Endpoint POST: Cadastrar mensalidade
const cadastrarMensalidade = async (req, res) => {
    try {
        const { alunoId, turmaId, valor, dataVencimento } = req.body;

        // Validação dos campos
        if (!alunoId || !turmaId || !valor || !dataVencimento) {
            return res.status(400).json({
                error: 'Todos os campos (alunoId, turmaId, valor, dataVencimento) são obrigatórios.'
            });
        }

        // Verificar se a matrícula já existe
        let matricula = await db.Matricula.findOne({
            where: { alunoId, turmaId }
        });

        // Se não existir, criar a matrícula
        if (!matricula) {
            // Buscar escolaId da turma
            const turma = await db.Turma.findByPk(turmaId);
            if (!turma) {
                return res.status(404).json({ error: 'Turma não encontrada.' });
            }

            matricula = await db.Matricula.create({
                dataMatricula: new Date(),
                status: 'ATIVA',
                alunoId,
                turmaId,
                escolaId: turma.escolaId,
                valorMensalidade: valor
            });
        }

        // Criar mensalidade
        const mensalidade = await db.Mensalidade.create({
            matriculaId: matricula.id,
            escolaId: matricula.escolaId,
            valor,
            dataVencimento,
            status: 'PENDENTE'
        });

        res.status(201).json({
            message: 'Mensalidade criada com sucesso!',
            mensalidade
        });
    } catch (error) {
        console.error('Erro ao cadastrar mensalidade:', error);
        res.status(500).json({
            error: 'Erro ao cadastrar mensalidade',
            details: error.message
        });
    }
};

// Listar todas as mensalidades
const listarMensalidades = async (req, res) => {
    try {
        const whereClause = req.user.perfil === 'ADMIN_ESCOLA'
            ? { escolaId: req.user.escolaId }
            : {};

        const mensalidades = await db.Mensalidade.findAll({
            where: whereClause,
            include: [
                {
                    model: db.Matricula,
                    as: 'matricula',
                    include: [
                        { model: db.Aluno, as: 'aluno' },
                        { model: db.Turma, as: 'turma' }
                    ]
                }
            ]
        });

        res.json(mensalidades);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao listar mensalidades',
            details: error.message
        });
    }
};

// Obter mensalidade por ID
const obterMensalidade = async (req, res) => {
    try {
        const mensalidade = await db.Mensalidade.findByPk(req.params.id, {
            include: [
                {
                    model: db.Matricula,
                    as: 'matricula',
                    include: [
                        { model: db.Aluno, as: 'aluno' },
                        { model: db.Turma, as: 'turma' }
                    ]
                }
            ]
        });

        if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });
        if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
        }

        res.json(mensalidade);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar mensalidade',
            details: error.message
        });
    }
};

// Atualizar mensalidade
const atualizarMensalidade = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const mensalidade = await db.Mensalidade.findByPk(req.params.id, { transaction: t });
        if (!mensalidade) {
            await t.rollback();
            return res.status(404).json({ error: 'Mensalidade não encontrada' });
        }

        if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
            await t.rollback();
            return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
        }

        const { dataVencimento, status, valor } = req.body;
        await mensalidade.update({ dataVencimento, status, valor }, { transaction: t });

        await t.commit();
        res.json({ message: 'Mensalidade atualizada com sucesso!', mensalidade });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Erro ao atualizar mensalidade', details: error.message });
    }
};

// Deletar mensalidade
const deletarMensalidade = async (req, res) => {
    try {
        const mensalidade = await db.Mensalidade.findByPk(req.params.id);
        if (!mensalidade) return res.status(404).json({ error: 'Mensalidade não encontrada' });

        if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado a esta mensalidade.' });
        }

        await mensalidade.destroy();
        res.json({ message: 'Mensalidade deletada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar mensalidade', details: error.message });
    }
};

module.exports = {
    criarMensalidade,
    cadastrarMensalidade,
    listarMensalidades,
    obterMensalidade,
    atualizarMensalidade,
    deletarMensalidade,
};
