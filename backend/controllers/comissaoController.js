const db = require('../models');

exports.listarTodas = async (req, res) => {
  try {
    // ✅ CORRIGIDO: A inclusão agora usa o modelo e o alias corretos
    const comissoes = await db.Comissao.findAll({ include: [{ model: db.Professor, as: 'professor' }, { model: db.Pagamento, as: 'pagamento' }] });
    res.json(comissoes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar comissões', details: error.message });
  }
};

exports.listarPorProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;
    // ✅ CORRIGIDO: A inclusão agora usa o modelo e o alias corretos
    const comissoes = await db.Comissao.findAll({
      where: { professorId },
      include: [{ model: db.Professor, as: 'professor' }, { model: db.Pagamento, as: 'pagamento' }]
    });
    const total = comissoes.reduce((acc, c) => acc + parseFloat(c.valor), 0);

    res.json({ professorId, total, comissoes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar comissões do professor', details: error.message });
  }
};
