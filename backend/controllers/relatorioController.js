// backend/controllers/relatorioController.js
const db = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

// Relatório de Vendas por Período
exports.getVendasPorPeriodo = async (req, res) => {
  try {
    const { dataInicial, dataFinal, escolaId } = req.query;

    if (!dataInicial || !dataFinal) {
      return res.status(400).json({ error: 'As datas inicial e final são obrigatórias.' });
    }

    const vendas = await db.Venda.findAll({
      where: {
        dataVenda: {
          [Op.between]: [new Date(dataInicial), new Date(dataFinal)],
        },
        ...(escolaId && { escolaId })
      },
      include: [
        { model: db.VendaItem, as: 'itens', include: [{ model: db.Produto, as: 'produto' }] },
        { model: db.Escola, as: 'escola' }
      ],
      order: [['dataVenda', 'ASC']]
    });

    res.status(200).json(vendas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório de vendas por período.', details: error.message });
  }
};

// Relatório de Vendas por Produto
exports.getVendasPorProduto = async (req, res) => {
  try {
    const { escolaId } = req.query;

    const vendasPorProduto = await db.VendaItem.findAll({
      attributes: [
        'produtoId',
        [db.sequelize.fn('SUM', db.sequelize.col('VendaItem.quantidade')), 'totalQuantidade'],
        [db.sequelize.fn('SUM', db.sequelize.col('VendaItem.subtotal')), 'totalVendas']
      ],
      group: ['produtoId'],
      include: [
        { model: db.Produto, as: 'produto' },
        { model: db.Venda, as: 'venda', where: { ...(escolaId && { escolaId }) } }
      ],
      order: [['totalVendas', 'DESC']]
    });

    res.status(200).json(vendasPorProduto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório de vendas por produto.', details: error.message });
  }
};

// Relatório de Mensalidades
exports.relatorioMensalidades = async (req, res) => {
  try {
    const { escolaId } = req.query;

    const mensalidades = await db.Mensalidade.findAll({
      where: { ...(escolaId && { escolaId }) },
      include: [
        { model: db.Matricula, as: 'matricula', include: [{ model: db.Aluno, as: 'aluno' }] }
      ],
      order: [['dataVencimento', 'ASC']]
    });

    res.status(200).json(mensalidades);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório de mensalidades.', details: error.message });
  }
};

// Relatório de Pagamentos e Comissões
exports.relatorioPagamentosComissoes = async (req, res) => {
  try {
    const { escolaId } = req.query;

    const pagamentos = await db.Pagamento.findAll({
      where: { ...(escolaId && { escolaId }) },
      include: [
        { model: db.Matricula, as: 'matricula', include: [{ model: db.Aluno, as: 'aluno' }] },
        { model: db.Comissao, as: 'comissoes', include: [{ model: db.Professor, as: 'professor' }] }
      ],
      order: [['dataPagamento', 'ASC']]
    });

    res.status(200).json(pagamentos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o relatório de pagamentos e comissões.', details: error.message });
  }
};

// Função para gerar PDF da nota fiscal
exports.getNotaFiscalPdf = async (req, res) => {
  try {
    const { vendaId } = req.params;

    const venda = await db.Venda.findByPk(vendaId, {
      include: [
        { model: db.VendaItem, as: 'itens', include: [{ model: db.Produto, as: 'produto' }] },
        { model: db.Escola, as: 'escola' }
      ]
    });

    if (!venda) return res.status(404).json({ error: 'Venda não encontrada.' });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=nota_fiscal_${vendaId}.pdf`);
    doc.pipe(res);

    doc.fontSize(25).text('Nota Fiscal', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Venda ID: ${venda.id}`);
    doc.text(`Data: ${venda.dataVenda.toLocaleDateString()}`);
    doc.moveDown();
    doc.text(`Escola: ${venda.escola.nome}`);
    doc.moveDown();

    doc.fontSize(16).text('Itens da Venda', { underline: true });
    doc.moveDown();

    venda.itens.forEach(item => {
      doc.text(`- Produto: ${item.produto.nome} (Qtd: ${item.quantidade}, Preço: R$ ${item.precoUnitario})`);
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total Bruto: R$ ${venda.totalBruto}`);
    doc.text(`Descontos: R$ ${venda.totalDescontos}`);
    doc.text(`Total Líquido: R$ ${venda.totalLiquido}`);
    doc.text(`Método de Pagamento: ${venda.metodoPagamento}`);

    doc.end();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar o PDF da nota fiscal.', details: error.message });
  }
};
