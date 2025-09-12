const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Corrigido import
const modalidadeController = require('../controllers/modalidadeController');

// Todas as rotas exigem login e validação de perfil dentro do controller
router.post('/', authMiddleware, modalidadeController.createModalidade);
router.get('/', authMiddleware, modalidadeController.getModalidades);
router.get('/:id', authMiddleware, modalidadeController.getModalidadeById);
router.put('/:id', authMiddleware, modalidadeController.updateModalidade);
router.delete('/:id', authMiddleware, modalidadeController.deleteModalidade);

module.exports = router;
