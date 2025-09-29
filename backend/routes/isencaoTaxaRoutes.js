const express = require('express');
const router = express.Router();
const controller = require('../controllers/isencaoTaxaController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar isenção
router.post('/', authMiddleware, controller.criarIsencao);

// Listar isenções (opcional filtro por escola)
router.get('/', authMiddleware, controller.listarIsencoes);

// Atualizar isenção
router.put('/:id', authMiddleware, controller.atualizarIsencao);

// Remover isenção
router.delete('/:id', authMiddleware, controller.removerIsencao);

module.exports = router;
