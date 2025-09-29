// backend/routes/produtoRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/produtoController');
const authMiddleware = require('../middleware/authMiddleware');

const upload = require('../config/multer');

// Rota para criar produto com upload de foto
// ✅ CORRIGIDO: Adicionado o middleware de upload
router.post('/', authMiddleware, upload.single('foto'), controller.criar);

// Rota para listar todos os produtos
router.get('/', authMiddleware, controller.listar);

// Obter um produto por ID
router.get('/:id', authMiddleware, controller.obter);

// Atualizar um produto por ID
router.put('/:id', authMiddleware, controller.atualizar);

// Remover um produto por ID
router.delete('/:id', authMiddleware, controller.remover);

// A rota PATCH para ajustarEstoque foi removida pois a função foi incorporada em atualizar (PUT)

// Rota para upload de imagem
router.put('/:id/upload-imagem', authMiddleware, upload.single('imagem'), controller.uploadImagem);

module.exports = router;