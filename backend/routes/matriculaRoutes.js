const express = require('express');
const router = express.Router();
const controller = require('../controllers/matriculaController');
const authMiddleware = require('../middleware/authMiddleware');

// Criar matrícula
router.post('/', authMiddleware, controller.criarMatricula);

// Listar todas as matrículas
router.get('/', authMiddleware, controller.listarMatriculas);

// ✅ NOVO: Rota para obter matrícula por ID
router.get('/:id', authMiddleware, controller.obterMatricula);

// Atualizar matrícula
router.put('/:id', authMiddleware, controller.atualizarMatricula);

// Deletar matrícula
router.delete('/:id', authMiddleware, controller.deletarMatricula);

module.exports = router;
