// backend/routes/alunoRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../models');

// Rota para CRIAR um novo aluno (POST)
router.post('/', async (req, res) => {
  try {
    // Corrigido para usar 'nome' e os outros campos do model
    const { nome, dataNascimento, genero, cpf, rg, email, telefone, escolaId } = req.body;

    if (!nome || !cpf || !email) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, cpf e email.' });
    }

    const novoAluno = await db.Aluno.create({
      nome, // Corrigido
      dataNascimento,
      genero,
      cpf,
      rg,
      email,
      telefone,
      ativo: true,
      escolaId: escolaId || null
    });

    res.status(201).json({ message: "Aluno criado com sucesso!", aluno: novoAluno });
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    res.status(500).json({ error: 'Ocorreu um erro no servidor.', details: error.message });
  }
});

// Listar todos os alunos
router.get('/', async (req, res) => {
  try {
    const alunos = await db.Aluno.findAll();
    res.json(alunos);
  } catch (error) {
    console.error("Erro ao listar alunos:", error);
    res.status(500).json({ error: 'Erro ao listar alunos', details: error.message });
  }
});

// Buscar aluno por ID
router.get('/:id', async (req, res) => {
  try {
    const aluno = await db.Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aluno', details: error.message });
  }
});

// Atualizar aluno
router.put('/:id', async (req, res) => {
  try {
    const aluno = await db.Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    await aluno.update(req.body);
    res.json({ message: "Aluno atualizado com sucesso!", aluno });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno', details: error.message });
  }
});

// Deletar aluno
router.delete('/:id', async (req, res) => {
  try {
    const aluno = await db.Aluno.findByPk(req.params.id);
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado" });
    await aluno.destroy();
    res.json({ message: "Aluno deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar aluno', details: error.message });
  }
});

module.exports = router;