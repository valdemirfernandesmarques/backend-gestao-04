const express = require('express');
const router = express.Router();
const controller = require('../controllers/modalidadeController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar modalidade
router.post('/', authMiddleware, controller.criarModalidade);

// Listar todas as modalidades
router.get('/', authMiddleware, controller.listarModalidades);

// Obter modalidade por ID
router.get('/:id', authMiddleware, controller.obterModalidade);

// Atualizar modalidade
router.put('/:id', authMiddleware, controller.atualizarModalidade);

// Deletar modalidade (nome correto da função)
router.delete('/:id', authMiddleware, controller.removerModalidade);

module.exports = router;
