const sequelize = require('../models').sequelize;
const { Venda, VendaItem, Produto, Pagamento, User, Escola } = require('../models');

// Criar venda
exports.criarVenda = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { itens, descontos = 0, metodoPagamento = 'PIX', escolaId: escolaIdBody } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Informe itens da venda' });
    }

    // SUPER_ADMIN pode escolher escolaId; ADMIN_ESCOLA usa a própria
    const escolaIdFinal =
      req.user.perfil === 'SUPER_ADMIN' ? escolaIdBody : req.user?.escolaId;

    if (!escolaIdFinal) {
      await t.rollback();
      return res.status(400).json({ error: 'escolaId é obrigatório' });
    }

    // Buscar produtos
    const produtosIds = itens.map(i => i.produtoId);
    const produtos = await Produto.findAll({ where: { id: produtosIds } });

    if (produtos.length !== itens.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Um ou mais produtos não foram encontrados' });
    }

    // Calcular total
    let totalBruto = 0;
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.preco);

      if (item.quantidade <= 0) {
        await t.rollback();
        return res.status(400).json({ error: `Quantidade inválida para o produto ${produto.nome}` });
      }
      if (produto.quantidade < item.quantidade) {
        await t.rollback();
        return res.status(400).json({ error: `Estoque insuficiente para o produto ${produto.nome}` });
      }

      totalBruto += precoUnitario * item.quantidade;
    }

    const totalDescontos = Number(descontos) || 0;
    const totalLiquido = Number((totalBruto - totalDescontos).toFixed(2));

    if (totalLiquido < 0) {
      await t.rollback();
      return res.status(400).json({ error: 'Total líquido não pode ser negativo' });
    }

    // Criar venda
    const venda = await Venda.create({
      escolaId: escolaIdFinal,
      usuarioId: req.user?.id || null,
      totalBruto,
      totalDescontos,
      totalLiquido,
      metodoPagamento,
      dataVenda: new Date(),
    }, { transaction: t });

    // Criar itens e atualizar estoque
    const itensCriados = [];
    for (const item of itens) {
      const produto = produtos.find(p => p.id === item.produtoId);
      const precoUnitario = item.precoUnitario ?? Number(produto.preco);
      const subtotal = Number((precoUnitario * item.quantidade).toFixed(2));

      const itemCriado = await VendaItem.create({
        vendaId: venda.id,
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario,
        subtotal,
      }, { transaction: t });

      itensCriados.push(itemCriado);

      // Atualizar estoque
      produto.quantidade -= item.quantidade;
      await produto.save({ transaction: t });
    }

    // Criar pagamento
    await Pagamento.create({
      vendaId: venda.id,
      mensalidadeId: null,
      escolaId: escolaIdFinal,
      valor: totalLiquido,
      dataPagamento: new Date(),
      metodo: metodoPagamento,
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
      message: 'Venda registrada com sucesso',
      vendaId: venda.id,
      totalLiquido,
      itens: itensCriados
    });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: 'Erro ao registrar venda', details: error.message });
  }
};

// Listar vendas
exports.listarVendas = async (req, res) => {
  try {
    const escolaId = req.user.perfil === 'SUPER_ADMIN' ? req.query.escolaId : req.user?.escolaId;
    const where = {};
    if (escolaId) where.escolaId = escolaId;

    const vendas = await Venda.findAll({
      where,
      include: [
        { model: VendaItem, as: 'itens', include: [{ model: Produto, as: 'produto' }] },
        { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Escola, attributes: ['id', 'nome'] },
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
    const venda = await Venda.findByPk(req.params.id, {
      include: [
        { model: VendaItem, as: 'itens', include: [{ model: Produto, as: 'produto' }] },
        { model: User, as: 'usuario', attributes: ['id', 'nome', 'email'] },
        { model: Escola, attributes: ['id', 'nome'] },
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
