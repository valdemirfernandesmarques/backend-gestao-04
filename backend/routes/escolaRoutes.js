// backend/routes/escolaRoutes.js
const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Cria a pasta de uploads se não existir
const uploadsDir = path.join(__dirname, '..', 'uploads', 'logos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do multer para upload de logotipo
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${req.user.escolaId}-${Date.now()}${path.extname(file.originalname)}`;
      cb(null, uniqueSuffix);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb('Apenas imagens (jpeg, jpg, png) são permitidas!');
  }
});

// Rotas CRUD escola
router.post('/', auth, escolaController.criar);
router.get('/', auth, escolaController.listar);
router.get('/:id', auth, escolaController.obter);
router.put('/:id', auth, escolaController.atualizar);
router.delete('/:id', auth, escolaController.remover);

// Rota para upload do logotipo
router.put('/:id/logo', auth, upload.single('logo'), escolaController.uploadLogo);

module.exports = router;
