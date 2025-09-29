const db = require('../models');

// Criar nova isenção de taxa
exports.criarIsencao = async (req, res) => {
    try {
        const { escolaId, motivo, dataInicio, dataFim } = req.body;

        if (!escolaId || !motivo || !dataInicio || !dataFim) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
        }

        // Apenas SUPER_ADMIN pode criar isenção
        if (req.user.perfil !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas SUPER_ADMIN pode criar isenção.' });
        }

        const isencao = await db.IsencaoTaxa.create({
            escolaId,
            motivo,
            dataInicio,
            dataFim
        });

        res.status(201).json({ message: 'Isenção criada com sucesso', isencao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar isenção de taxa', details: error.message });
    }
};

// Listar isenções (filtro opcional por escola)
exports.listarIsencoes = async (req, res) => {
    try {
        const { escolaId } = req.query;

        const whereClause = {};
        if (escolaId) whereClause.escolaId = escolaId;

        const isencoes = await db.IsencaoTaxa.findAll({
            where: whereClause,
            include: [{ model: db.Escola, as: 'escola' }],
            order: [['dataInicio', 'ASC']]
        });

        res.status(200).json(isencoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar isenções', details: error.message });
    }
};

// Atualizar isenção
exports.atualizarIsencao = async (req, res) => {
    try {
        const { id } = req.params;
        const { motivo, dataInicio, dataFim } = req.body;

        if (req.user.perfil !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas SUPER_ADMIN pode atualizar isenção.' });
        }

        const isencao = await db.IsencaoTaxa.findByPk(id);
        if (!isencao) return res.status(404).json({ error: 'Isenção não encontrada.' });

        await isencao.update({ motivo, dataInicio, dataFim });
        res.status(200).json({ message: 'Isenção atualizada com sucesso', isencao });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar isenção', details: error.message });
    }
};

// Remover isenção
exports.removerIsencao = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.user.perfil !== 'SUPER_ADMIN') {
            return res.status(403).json({ error: 'Acesso negado. Apenas SUPER_ADMIN pode remover isenção.' });
        }

        const isencao = await db.IsencaoTaxa.findByPk(id);
        if (!isencao) return res.status(404).json({ error: 'Isenção não encontrada.' });

        await isencao.destroy();
        res.status(200).json({ message: 'Isenção removida com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao remover isenção', details: error.message });
    }
};
