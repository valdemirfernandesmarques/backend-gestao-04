// backend/controllers/produtoController.js
const db = require('../models');

exports.criar = async (req, res) => {
  try {
    const { nome, preco, quantidade } = req.body;
    let escolaIdFinal;

    if (req.user.perfil === 'SUPER_ADMIN') {
      const { escolaId } = req.body;
      if (!escolaId) return res.status(400).json({ error: 'SUPER_ADMIN precisa informar o escolaId para criar o produto.' });
      escolaIdFinal = escolaId;
    } else {
      escolaIdFinal = req.user.escolaId;
    }

    if (!escolaIdFinal) return res.status(400).json({ error: 'escolaId é obrigatório.' });
    if (preco === undefined || preco === null) return res.status(400).json({ error: 'O campo preco é obrigatório.' });

    const produto = await db.Produto.create({
      nome,
      preco,
      quantidade: quantidade || 0,
      escolaId: escolaIdFinal,
    });
    res.status(201).json({ message: 'Produto criado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    let where = {};
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      where.escolaId = req.user.escolaId;
    } else if (req.user.perfil === 'SUPER_ADMIN' && req.query.escolaId) {
      where.escolaId = req.query.escolaId;
    }
    const produtos = await db.Produto.findAll({ where });
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos', details: error.message });
  }
};

exports.obter = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter produto', details: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }
    const { nome, preco, quantidade } = req.body;
    await produto.update({
      nome: nome ?? produto.nome,
      preco: preco ?? produto.preco,
      quantidade: quantidade ?? produto.quantidade,
    });
    res.json({ message: 'Produto atualizado com sucesso', produto });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
};

exports.remover = async (req, res) => {
  try {
    const produto = await db.Produto.findByPk(req.params.id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && produto.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a este produto' });
    }
    await produto.destroy();
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto', details: error.message });
  }
};