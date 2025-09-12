// backend/controllers/protectedController.js
exports.ping = (req, res) => {
  res.json({
    ok: true,
    message: 'Acesso autorizado com token válido.',
    userFromToken: req.user // id e perfil vindos do JWT
  });
};
