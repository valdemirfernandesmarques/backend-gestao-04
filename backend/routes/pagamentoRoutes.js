// backend/routes/pagamentoRoutes.js
const express = require("express");
const router = express.Router();
const pagamentoController = require("../controllers/pagamentoController");
const authMiddleware = require("../middleware/authMiddleware");

// Registrar pagamento
router.post("/", authMiddleware, pagamentoController.registrarPagamento);

// Listar pagamentos
router.get("/", authMiddleware, pagamentoController.listarPagamentos);

module.exports = router;
