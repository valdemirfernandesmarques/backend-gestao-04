// backend/routes/professorRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/professorController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar professor
router.post('/', authMiddleware, controller.criarProfessor);

// Listar todos
router.get('/', authMiddleware, controller.listarProfessores);

// Obter por ID
router.get('/:id', authMiddleware, controller.obterProfessor);

// Atualizar
router.put('/:id', authMiddleware, controller.atualizarProfessor);

// Deletar
router.delete('/:id', authMiddleware, controller.deletarProfessor);

module.exports = router;
