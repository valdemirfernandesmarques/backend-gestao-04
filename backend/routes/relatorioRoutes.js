// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const authMiddleware = require('../middleware/authMiddleware');

// Relatórios de mensalidades
router.get('/mensalidades', authMiddleware, relatorioController.relatorioMensalidades);

// Relatórios de vendas
router.get('/vendas-por-periodo', authMiddleware, relatorioController.getVendasPorPeriodo);
router.get('/vendas-por-produto', authMiddleware, relatorioController.getVendasPorProduto);

// Relatórios de pagamentos e comissões
router.get('/pagamentos-comissoes', authMiddleware, relatorioController.relatorioPagamentosComissoes);

// Nota fiscal em PDF
router.get('/nota-fiscal-pdf/:vendaId', authMiddleware, relatorioController.getNotaFiscalPdf);

module.exports = router;
