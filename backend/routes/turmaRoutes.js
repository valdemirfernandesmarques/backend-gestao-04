// backend/routes/turmaRoutes.js
const express = require('express');
const router = express.Router();
const turmaController = require('../controllers/turmaController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas exigem login
router.post('/', authMiddleware, turmaController.createTurma);
router.get('/', authMiddleware, turmaController.getTurmas);
router.get('/:id', authMiddleware, turmaController.getTurmaById);
router.put('/:id', authMiddleware, turmaController.updateTurma);
router.delete('/:id', authMiddleware, turmaController.deleteTurma);

module.exports = router;
