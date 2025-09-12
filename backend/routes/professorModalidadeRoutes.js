// backend/routes/professorModalidadeRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/professorModalidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar vínculo
router.post('/', authMiddleware, controller.vincular);

// Listar modalidades de um professor
router.get('/professor/:professorId', authMiddleware, controller.listarModalidadesDoProfessor);

// Listar professores de uma modalidade
router.get('/modalidade/:modalidadeId', authMiddleware, controller.listarProfessoresDaModalidade);

module.exports = router;
