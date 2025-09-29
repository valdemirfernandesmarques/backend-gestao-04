// backend/routes/professorModalidadeRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/professorModalidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar vínculo
router.post('/', authMiddleware, controller.vincular);

// Atualizar vínculo (PUT)
router.put('/:professorId/:modalidadeId', authMiddleware, controller.atualizarVinculo);

// Remover/Desvincular um professor de uma modalidade
router.delete('/', authMiddleware, controller.desvincular);

// Rota adicionada para listar TODAS as associações
router.get('/', authMiddleware, controller.listAll);

// Listar modalidades de um professor
router.get('/professor/:professorId', authMiddleware, controller.listarModalidadesDoProfessor);

// Listar professores de uma modalidade
router.get('/modalidade/:modalidadeId', authMiddleware, controller.listarProfessoresDaModalidade);

module.exports = router;
