// backend/routes/vendaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/vendaController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar venda
router.post('/', authMiddleware, controller.criarVenda);

// Listar todas as vendas
router.get('/', authMiddleware, controller.listarVendas);

// Obter venda por ID
router.get('/:id', authMiddleware, controller.obterVenda);

// ✅ CORRIGIDO: Aponta para a função correta
router.put('/:id', authMiddleware, controller.atualizarVenda);

// ✅ CORRIGIDO: Aponta para a função correta
router.delete('/:id', authMiddleware, controller.deletarVenda);

module.exports = router;