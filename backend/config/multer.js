const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/produtos/'); // Salva as imagens na pasta uploads/produtos
  },
  filename: (req, file, cb) => {
    // Cria um nome de arquivo único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limite de 2MB
  },
  fileFilter: (req, file, cb) => {
    // Permite apenas arquivos com extensões .jpg, .jpeg, .png
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Erro: Apenas imagens com as extensões .jpeg, .jpg ou .png são permitidas!');
  },
});

module.exports = upload;