const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido ou inválido' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo123');
    } catch (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    // SUPER_ADMIN tem acesso total
    if (user.perfil === 'SUPER_ADMIN') {
      req.user = {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId || null,
        nome: user.nome,
        isIsentoTaxa: false,
      };
      return next();
    }

    // ADMIN_ESCOLA precisa estar vinculado a uma escola
    if (user.perfil === 'ADMIN_ESCOLA') {
      if (!user.escolaId) {
        return res.status(403).json({ error: 'Administrador de escola sem escola vinculada' });
      }

      const isIsentoTaxa = user.email === 'admin@escolateste.com';

      req.user = {
        id: user.id,
        email: user.email,
        perfil: user.perfil,
        escolaId: user.escolaId,
        nome: user.nome,
        isIsentoTaxa,
      };
      return next();
    }

    // Qualquer outro perfil é inválido
    return res.status(403).json({ error: 'Perfil de usuário inválido' });

  } catch (err) {
    console.error('Erro no authMiddleware:', err);
    return res.status(500).json({ error: 'Erro interno na autenticação' });
  }
};

module.exports = authMiddleware;
