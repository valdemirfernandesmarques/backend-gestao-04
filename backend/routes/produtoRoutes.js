// backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ CORRIGIDO: As rotas agora chamam as funções corretas do novo controller

// Criar produto
router.post('/', authMiddleware, controller.criar);

// Listar todos os produtos
router.get('/', authMiddleware, controller.listar);

// Obter um produto por ID
router.get('/:id', authMiddleware, controller.obter);

// Atualizar um produto por ID
router.put('/:id', authMiddleware, controller.atualizar);

// Remover um produto por ID
router.delete('/:id', authMiddleware, controller.remover);

// A rota PATCH para ajustarEstoque foi removida pois a função foi incorporada em atualizar (PUT)

module.exports = router;