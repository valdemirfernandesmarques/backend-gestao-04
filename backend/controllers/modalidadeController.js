const db = require('../models');

// Criar modalidade
const criarModalidade = async (req, res) => {
    try {
        const { nome, valorMensalidade, precoAula } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !valorMensalidade || precoAula === undefined || precoAula === null) {
            return res.status(400).json({
                error: 'Todos os campos (nome, valorMensalidade, precoAula) são obrigatórios.'
            });
        }

        // Criação da modalidade
        const modalidade = await db.Modalidade.create({
            nome,
            valorMensalidade,
            precoAula
        });

        res.status(201).json({
            message: 'Modalidade criada com sucesso!',
            modalidade
        });
    } catch (error) {
        console.error('Erro ao criar modalidade:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erro de validação ao criar modalidade',
                details: error.errors.map(e => e.message)
            });
        }

        res.status(500).json({
            error: 'Erro ao criar modalidade',
            details: error.message
        });
    }
};

// Listar todas as modalidades
const listarModalidades = async (req, res) => {
    try {
        const modalidades = await db.Modalidade.findAll();
        res.json(modalidades);
    } catch (error) {
        console.error('Erro ao listar modalidades:', error);
        res.status(500).json({
            error: 'Erro ao listar modalidades',
            details: error.message
        });
    }
};

// Obter modalidade por ID
const obterModalidade = async (req, res) => {
    try {
        const modalidade = await db.Modalidade.findByPk(req.params.id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }
        res.json(modalidade);
    } catch (error) {
        console.error('Erro ao obter modalidade:', error);
        res.status(500).json({ error: 'Erro ao obter modalidade', details: error.message });
    }
};

// Atualizar modalidade
const atualizarModalidade = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, valorMensalidade, precoAula } = req.body;

        const modalidade = await db.Modalidade.findByPk(id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }

        await modalidade.update({ nome, valorMensalidade, precoAula });

        res.json({
            message: 'Modalidade atualizada com sucesso!',
            modalidade
        });
    } catch (error) {
        console.error('Erro ao atualizar modalidade:', error);
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erro de validação ao atualizar modalidade',
                details: error.errors.map(e => e.message)
            });
        }
        res.status(500).json({
            error: 'Erro ao atualizar modalidade',
            details: error.message
        });
    }
};

// Remover modalidade
const removerModalidade = async (req, res) => {
    try {
        const { id } = req.params;

        const modalidade = await db.Modalidade.findByPk(id);
        if (!modalidade) {
            return res.status(404).json({ error: 'Modalidade não encontrada.' });
        }

        await modalidade.destroy();

        res.json({ message: 'Modalidade removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover modalidade:', error);
        res.status(500).json({
            error: 'Erro ao remover modalidade',
            details: error.message
        });
    }
};

module.exports = {
    criarModalidade,
    listarModalidades,
    obterModalidade,
    atualizarModalidade,
    removerModalidade
};
