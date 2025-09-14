// backend/routes/escolaRoutes.js
const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const auth = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ✅ NOVO: Importa o módulo 'fs' para gerenciar arquivos

// Garante que a pasta de uploads exista antes de iniciar o servidor
const uploadsDir = path.join(__dirname, '..', 'uploads', 'logos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: 'uploads/',
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${req.user.escolaId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Apenas imagens (jpeg, jpg, png) são permitidas!');
  }
});


router.post('/', auth, escolaController.criar);

router.get('/', auth, escolaController.listar);

router.get('/:id', auth, escolaController.obter);

router.put('/:id', auth, escolaController.atualizar);

router.delete('/:id', auth, escolaController.remover);

router.put('/:id/logo', auth, upload.single('logo'), escolaController.uploadLogo);


module.exports = router;