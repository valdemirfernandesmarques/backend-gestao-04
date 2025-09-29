// backend/routes/mensalidadeRoutes.js
const express = require("express");
const router = express.Router();
const mensalidadeController = require("../controllers/mensalidadeController");
const authMiddleware = require("../middleware/authMiddleware");

// ================================
// Rotas de Mensalidade (todas protegidas)
// ================================

// Criar mensalidade
// POST /api/mensalidades
router.post("/", authMiddleware, mensalidadeController.cadastrarMensalidade);

// Listar mensalidades
// GET /api/mensalidades
router.get("/", authMiddleware, mensalidadeController.listarMensalidades);

// Obter mensalidade por ID
// GET /api/mensalidades/:id
router.get("/:id", authMiddleware, mensalidadeController.obterMensalidade);

// Atualizar mensalidade
// PUT /api/mensalidades/:id
router.put("/:id", authMiddleware, mensalidadeController.atualizarMensalidade);

// Deletar mensalidade
// DELETE /api/mensalidades/:id
router.delete("/:id", authMiddleware, mensalidadeController.deletarMensalidade);

module.exports = router;
