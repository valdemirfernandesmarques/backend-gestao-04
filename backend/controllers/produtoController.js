// backend/controllers/produtoController.js
const { Produto } = require('../models');

exports.criar = async (req, res) => {
    try {
        const { nome, preco, quantidade, descricao } = req.body; // Adicionado 'descricao'

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

        // ✅ NOVO: Lógica para tratar o upload da foto
        let fotoPath = null;
        if (req.file) {
            fotoPath = req.file.path;
        }

        const produto = await Produto.create({
            nome,
            descricao, // Adicionado 'descricao' ao objeto
            preco,
            quantidade: quantidade || 0,
            escolaId: escolaIdFinal,
            foto: fotoPath, // ✅ NOVO: Salva o caminho da foto no campo 'foto'
        });
        res.status(201).json({ message: 'Produto criado com sucesso', produto });
    } catch (error) {
        console.error('Erro ao criar produto:', error);
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
        const produtos = await Produto.findAll({ where });
        res.json(produtos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar produtos', details: error.message });
    }
};

exports.obter = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id);
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
        const produto = await Produto.findByPk(req.params.id);
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
        const produto = await Produto.findByPk(req.params.id);
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

// Função para fazer upload de imagem do produto
exports.uploadImagem = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo de imagem enviado.' });
        }

        const produto = await Produto.findByPk(req.params.id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        // Atualiza a URL da imagem no banco de dados
        produto.imageUrl = req.file.path;
        await produto.save();

        res.json({
            message: 'Imagem do produto atualizada com sucesso!',
            imageUrl: produto.imageUrl
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao fazer upload da imagem', details: err.message });
    }
};