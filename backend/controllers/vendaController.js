// backend/controllers/vendaController.js
const db = require('../models');
const sequelize = db.sequelize;

// Criar venda
exports.criarVenda = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { itens, descontos = 0, metodoPagamento = 'PIX', escolaId: escolaIdBody, usuarioId } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Informe os itens da venda.' });
    }

    const escolaIdFinal = req.user.perfil === 'SUPER_ADMIN' ? escolaIdBody : req.user?.escolaId;

    if (!escolaIdFinal) {
      await t.rollback();
      return res.status(400).json({ error: 'escolaId é obrigatório.' });
    }

    const produtosIds = itens.map(i => i.produtoId);
    const produtos = await db.Produto.findAll({ where: { id: produtosIds }, transaction: t });

    if (produtos.length !== itens.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Um ou mais produtos não foram encontrados.' });
    }

    let totalBruto = 0;
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.preco);

      if (item.quantidade <= 0) throw new Error(`Quantidade inválida para o produto ${produto.nome}`);
      if (produto.quantidade < item.quantidade) throw new Error(`Stock insuficiente para o produto ${produto.nome}`);
      
      totalBruto += precoUnitario * item.quantidade;
    }

    const totalDescontos = Number(descontos) || 0;
    const totalLiquido = Number((totalBruto - totalDescontos).toFixed(2));

    if (totalLiquido < 0) throw new Error('Total líquido não pode ser negativo.');

    const venda = await db.Venda.create({
      escolaId: escolaIdFinal,
      usuarioId: usuarioId || req.user?.id || null,
      totalBruto, totalDescontos, totalLiquido, metodoPagamento,
      dataVenda: new Date(),
    }, { transaction: t });

    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.preco);
      const subtotal = Number((precoUnitario * item.quantidade).toFixed(2));

      await db.VendaItem.create({
        vendaId: venda.id, produtoId: produto.id,
        quantidade: item.quantidade, precoUnitario, subtotal,
      }, { transaction: t });

      produto.quantidade -= item.quantidade;
      await produto.save({ transaction: t });
    }
    
    await db.Pagamento.create({
      vendaId: venda.id,
      escolaId: escolaIdFinal,
      valor: totalLiquido,
      dataPagamento: new Date(),
      metodo: metodoPagamento,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: 'Venda registada com sucesso',
      vendaId: venda.id, totalLiquido
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erro ao registar venda', details: error.message });
  }
};

// Listar vendas
exports.listarVendas = async (req, res) => {
  try {
    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? req.query.escolaId : req.user?.escolaId;
    const where = {};
    if (escolaId) where.escolaId = escolaId;

    const vendas = await db.Venda.findAll({
      where,
      include: [
        { model: db.VendaItem, as: 'itens', include: [{ model: db.Produto, as: 'produto' }] },
        { model: db.User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: db.Escola, as: 'escola', attributes: ['id', 'nome'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(vendas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar vendas', details: error.message });
  }
};

// Obter venda por ID
exports.obterVenda = async (req, res) => {
  try {
    const venda = await db.Venda.findByPk(req.params.id, {
      include: [
        { model: db.VendaItem, as: 'itens', include: [{ model: db.Produto, as: 'produto' }] },
        { model: db.User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: db.Escola, as: 'escola', attributes: ['id', 'nome'] },
      ],
    });
    if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
    if (req.user.perfil === 'ADMIN_ESCOLA' && venda.escolaId !== req.user.escolaId) {
      return res.status(403).json({ error: 'Acesso negado a esta venda' });
    }
    res.json(venda);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter venda', details: error.message });
  }
};

// ✅ FUNÇÃO QUE FALTAVA: Atualizar/Cancelar uma venda
exports.atualizarVenda = async (req, res) => {
    try {
        const { status } = req.body;
        const venda = await db.Venda.findByPk(req.params.id);
        if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
        if (req.user.perfil === 'ADMIN_ESCOLA' && venda.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado a esta venda.' });
        }
        await venda.update({ status });
        res.json({ message: 'Status da venda atualizado com sucesso!', venda });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar venda', details: error.message });
    }
};

// ✅ FUNÇÃO QUE FALTAVA: Apagar uma venda e devolver o stock
exports.deletarVenda = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const venda = await db.Venda.findByPk(req.params.id, {
            include: [{ model: db.VendaItem, as: 'itens' }],
            transaction: t
        });
        if (!venda) return res.status(404).json({ error: 'Venda não encontrada' });
        if (req.user.perfil === 'ADMIN_ESCOLA' && venda.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado a esta venda.' });
        }
        for (const item of venda.itens) {
            const produto = await db.Produto.findByPk(item.produtoId, { transaction: t });
            if (produto) {
                produto.quantidade += item.quantidade;
                await produto.save({ transaction: t });
            }
        }
        await venda.destroy({ transaction: t });
        await t.commit();
        res.json({ message: 'Venda apagada com sucesso e stock devolvido!' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ error: 'Erro ao apagar venda', details: error.message });
    }
};