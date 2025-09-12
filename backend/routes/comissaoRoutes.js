// backend/routes/comissaoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/comissaoController');
const authMiddleware = require('../middleware/authMiddleware');

// Listar todas as comissões
router.get('/', authMiddleware, controller.listarTodas);

// Listar comissões de um professor
router.get('/professor/:professorId', authMiddleware, controller.listarPorProfessor);

module.exports = router;
