// backend/src/controllers/comissaoController.js
const db = require('../models');

// Criar comissão
const criarComissao = async (req, res) => {
  try {
    const { professorId, valor, pagamentoId } = req.body;

    if (!professorId || !valor || !pagamentoId) {
      return res.status(400).json({
        error: 'Os campos professorId, valor e pagamentoId são obrigatórios.'
      });
    }

    const comissao = await db.Comissao.create({
      professorId,
      valor,
      pagamentoId
    });

    res.status(201).json({ message: 'Comissão criada com sucesso!', comissao });
  } catch (error) {
    console.error('Erro ao criar comissão:', error);
    res.status(500).json({ error: 'Erro ao criar comissão', details: error.message });
  }
};

// Listar todas as comissões
const listarTodas = async (req, res) => {
  try {
    const comissoes = await db.Comissao.findAll({
      include: [
        { model: db.Professor, as: 'professor' },
        { model: db.Pagamento, as: 'pagamento' }
      ]
    });
    res.json(comissoes);
  } catch (error) {
    console.error('Erro ao listar comissões:', error);
    res.status(500).json({ error: 'Erro ao listar comissões', details: error.message });
  }
};

// Listar comissões de um professor específico
const listarPorProfessor = async (req, res) => {
  try {
    const { professorId } = req.params;

    const comissoes = await db.Comissao.findAll({
      where: { professorId },
      include: [
        { model: db.Professor, as: 'professor' },
        { model: db.Pagamento, as: 'pagamento' }
      ]
    });

    const total = comissoes.reduce((acc, c) => acc + parseFloat(c.valor), 0);

    res.json({ professorId, total, comissoes });
  } catch (error) {
    console.error('Erro ao listar comissões do professor:', error);
    res.status(500).json({ error: 'Erro ao listar comissões do professor', details: error.message });
  }
};

// Atualizar comissão
const atualizarComissao = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, pagamentoId } = req.body;

    const comissao = await db.Comissao.findByPk(id);
    if (!comissao) return res.status(404).json({ error: 'Comissão não encontrada' });

    await comissao.update({ valor, pagamentoId });
    res.json({ message: 'Comissão atualizada com sucesso!', comissao });
  } catch (error) {
    console.error('Erro ao atualizar comissão:', error);
    res.status(500).json({ error: 'Erro ao atualizar comissão', details: error.message });
  }
};

// Remover comissão
const removerComissao = async (req, res) => {
  try {
    const { id } = req.params;
    const comissao = await db.Comissao.findByPk(id);
    if (!comissao) return res.status(404).json({ error: 'Comissão não encontrada' });

    await comissao.destroy();
    res.json({ message: 'Comissão removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao remover comissão:', error);
    res.status(500).json({ error: 'Erro ao remover comissão', details: error.message });
  }
};

module.exports = {
  criarComissao,
  listarTodas,
  listarPorProfessor,
  atualizarComissao,
  removerComissao
};
