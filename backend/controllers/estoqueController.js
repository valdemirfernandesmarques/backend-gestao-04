// backend/controllers/estoqueController.js
const db = require("../models");
const Produto = db.Produto;

/**
 * Criar um novo produto no estoque
 */
exports.criarProduto = async (req, res) => {
  try {
    const { nome, descricao, preco, quantidade } = req.body;

    const novoProduto = await Produto.create({
      nome,
      descricao,
      preco,
      quantidade,
    });

    res.status(201).json(novoProduto);
  } catch (err) {
    console.error("❌ Erro ao criar produto:", err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

/**
 * Listar todos os produtos
 */
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (err) {
    console.error("❌ Erro ao listar produtos:", err);
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};

/**
 * Buscar produto por ID
 */
exports.getProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json(produto);
  } catch (err) {
    console.error("❌ Erro ao buscar produto:", err);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

/**
 * Atualizar produto
 */
exports.atualizarProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await produto.update({ nome, descricao, preco, quantidade });
    res.json(produto);
  } catch (err) {
    console.error("❌ Erro ao atualizar produto:", err);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
};

/**
 * Excluir produto
 */
exports.excluirProduto = async (req, res) => {
  try {
    const { id } = req.params;
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    await produto.destroy();
    res.json({ message: "Produto excluído com sucesso" });
  } catch (err) {
    console.error("❌ Erro ao excluir produto:", err);
    res.status(500).json({ error: "Erro ao excluir produto" });
  }
};
