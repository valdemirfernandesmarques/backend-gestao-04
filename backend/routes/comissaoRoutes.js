// backend/src/routes/comissaoRoutes.js
const express = require('express');
const router = express.Router();
const comissaoController = require('../controllers/comissaoController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar comissão
router.post('/', authMiddleware, comissaoController.criarComissao);

// Listar todas as comissões
router.get('/', authMiddleware, comissaoController.listarTodas);

// Listar comissões de um professor específico
router.get('/professor/:professorId', authMiddleware, comissaoController.listarPorProfessor);

// Atualizar comissão por ID
router.put('/:id', authMiddleware, comissaoController.atualizarComissao);

// Remover comissão por ID
router.delete('/:id', authMiddleware, comissaoController.removerComissao);

module.exports = router;
