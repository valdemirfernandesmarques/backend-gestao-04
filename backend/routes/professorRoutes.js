// backend/routes/professorRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/professorController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar professor
router.post('/', authMiddleware, controller.criarProfessor);

// Listar todos os professores
router.get('/', authMiddleware, controller.listarProfessores);

// Obter professor por ID
router.get('/:id', authMiddleware, controller.obterProfessor);

// Atualizar professor
router.put('/:id', authMiddleware, controller.atualizarProfessor);

// ✅ CORRIGIDO: Adicionada a rota para apagar um professor
router.delete('/:id', authMiddleware, controller.deletarProfessor);

module.exports = router;