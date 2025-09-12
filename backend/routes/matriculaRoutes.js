// backend/routes/matriculaRoutes.js
const express = require("express");
const router = express.Router();
const matriculaController = require("../controllers/matriculaController");
const authMiddleware = require("../middleware/authMiddleware");

// Criar matrícula
router.post("/", authMiddleware, matriculaController.criarMatricula);

// Listar matrículas
router.get("/", authMiddleware, matriculaController.listarMatriculas);

// Atualizar matrícula
router.put("/:id", authMiddleware, matriculaController.atualizarMatricula);

// Deletar matrícula
router.delete("/:id", authMiddleware, matriculaController.deletarMatricula);

module.exports = router;
