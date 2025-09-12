// backend/controllers/comissaoController.js
const Comissao = require('../models/Comissao');

exports.listarTodas = async (req, res) => {
  try {
    const comissoes = await Comissao.findAll({ include: ['professor', 'pagamento'] });
    res.json(comissoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar comissões', details: error.message });
  }
};

exports.listarPorProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    const comissoes = await Comissao.findAll({
      where: { professorId },
      include: ['professor', 'pagamento']
    });
    const total = comissoes.reduce((acc, c) => acc + parseFloat(c.valor), 0);

    res.json({ professorId, total, comissoes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar comissões do professor', details: error.message });
  }
};
