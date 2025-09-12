// backend/controllers/relatorioController.js
const db = require('../models');

// Relatório financeiro por escola
exports.relatorioFinanceiroEscola = async (req, res) => {
  try {
    const escolaId = req.user.perfil === 'SUPER_ADMIN'
      ? req.query.escolaId
      : req.user?.escolaId;

    if (!escolaId) {
      return res.status(400).json({ error: 'escolaId é obrigatório (na query ou pelo usuário autenticado)' });
    }

    const totalVendas = await db.Venda.sum('totalLiquido', { where: { escolaId } });
    const totalPagamentos = await db.Pagamento.sum('valor', { where: { escolaId } });

    res.json({
      escolaId,
      totalVendas: totalVendas || 0,
      totalPagamentos: totalPagamentos || 0,
      receitaTotal: (totalVendas || 0) + (totalPagamentos || 0),
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro da escola', details: error.message });
  }
};

// Relatório financeiro geral (todas escolas)
exports.relatorioFinanceiroGeral = async (req, res) => {
  try {
    const vendas = await db.Venda.findAll({
      attributes: ['escolaId', [db.sequelize.fn('SUM', db.sequelize.col('totalLiquido')), 'totalVendas']],
      group: ['escolaId'],
    });

    const pagamentos = await db.Pagamento.findAll({
      attributes: ['escolaId', [db.sequelize.fn('SUM', db.sequelize.col('valor')), 'totalPagamentos']],
      group: ['escolaId'],
    });
    
    if (req.user.perfil === 'ADMIN_ESCOLA') {
      const escolaId = req.user.escolaId;
      const vendasFiltradas = vendas.filter(v => v.escolaId === escolaId);
      const pagamentosFiltrados = pagamentos.filter(p => p.escolaId === escolaId);

      return res.json({
        vendas: vendasFiltradas,
        pagamentos: pagamentosFiltrados,
      });
    }

    res.json({
      vendas,
      pagamentos,
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro geral', details: error.message });
  }
};