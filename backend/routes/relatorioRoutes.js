// backend/routes/relatorioRoutes.js
const express = require('express');
const router = express.Router();
const relatorioController = require('../controllers/relatorioController');
const auth = require('../middleware/authMiddleware');

// Relatórios financeiros
router.get('/financeiro/escola', auth, relatorioController.relatorioFinanceiroEscola);
router.get('/financeiro/geral', auth, relatorioController.relatorioFinanceiroGeral);

// ✅ NOVO: Rota para gerar a Nota Fiscal em PDF de um pagamento específico
router.get('/nota-fiscal/:pagamentoId', auth, relatorioController.gerarNotaFiscalPDF);

module.exports = router;