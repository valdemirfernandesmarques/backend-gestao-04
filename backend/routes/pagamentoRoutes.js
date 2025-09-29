// backend/routes/pagamentoRoutes.js
const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ CORRIGIDO: Importa o middleware de segurança

// ✅ CORRIGIDO: Rota para registrar um novo pagamento, agora protegida e a chamar a função correta
router.post('/', authMiddleware, pagamentoController.registrarPagamento);

// ✅ CORRIGIDO: Rota para listar pagamentos, agora protegida e a chamar a função correta
router.get('/', authMiddleware, pagamentoController.listarPagamentos);

// As rotas GET by ID, PUT e DELETE foram removidas para seguir a lógica de negócio,
// onde um pagamento, uma vez registado, não é modificado ou apagado diretamente.
// Essas ações exigiriam uma lógica de estorno mais complexa.

module.exports = router;