// backend/controllers/professorController.js
const db = require('../models');

// Criar professor
exports.criarProfessor = async (req, res) => {
    try {
        const { nome, cpf, vinculo, escolaId } = req.body;
        // ... (resto da lógica de criar)
        const professor = await db.Professor.create({ nome, cpf, vinculo, escolaId, ...req.body });
        res.status(201).json({ message: "Professor criado com sucesso!", professor });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar professor', details: error.message });
    }
};

// Listar professores
exports.listarProfessores = async (req, res) => {
    try {
        // ... (lógica de listar)
        const professores = await db.Professor.findAll();
        res.json(professores);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar professores', details: error.message });
    }
};

// Obter professor
exports.obterProfessor = async (req, res) => {
    try {
        const professor = await db.Professor.findByPk(req.params.id);
        if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
        res.json(professor);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter professor', details: error.message });
    }
};

// Atualizar professor
exports.atualizarProfessor = async (req, res) => {
    try {
        const professor = await db.Professor.findByPk(req.params.id);
        if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
        await professor.update(req.body);
        res.json({ message: "Professor atualizado com sucesso!", professor });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar professor', details: error.message });
    }
};

// ✅ CORRIGIDO: Garante que a função de apagar existe
exports.deletarProfessor = async (req, res) => {
    try {
        const professor = await db.Professor.findByPk(req.params.id);
        if (!professor) return res.status(404).json({ error: 'Professor não encontrado' });
        await professor.destroy();
        res.json({ message: 'Professor apagado com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao apagar professor', details: error.message });
    }
};