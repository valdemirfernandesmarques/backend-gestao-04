const db = require('../models');
const PDFDocument = require('pdfkit'); // ✅ NOVA: Importa a biblioteca de PDF

// ... (as funções relatorioFinanceiroEscola e relatorioFinanceiroGeral continuam iguais)
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
      return res.json({ vendas: vendasFiltradas, pagamentos: pagamentosFiltrados });
    }
    res.json({ vendas, pagamentos });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório financeiro geral', details: error.message });
  }
};


// ✅ NOVA FUNÇÃO: Gerar a Nota Fiscal em PDF para um pagamento
exports.gerarNotaFiscalPDF = async (req, res) => {
    try {
        const { pagamentoId } = req.params;
        const pagamento = await db.Pagamento.findByPk(pagamentoId, {
            include: [
                // Inclui todos os dados necessários para a nota
                { model: db.Escola, as: 'escola' },
                {
                    model: db.Mensalidade, as: 'mensalidade',
                    include: [{
                        model: db.Matricula, as: 'matricula',
                        include: [{ model: db.Aluno, as: 'aluno' }]
                    }]
                }
            ]
        });

        if (!pagamento) {
            return res.status(404).json({ error: 'Pagamento não encontrado' });
        }
        
        // Validação de segurança
        if (req.user.perfil === 'ADMIN_ESCOLA' && pagamento.escolaId !== req.user.escolaId) {
            return res.status(403).json({ error: 'Acesso negado a este pagamento.' });
        }

        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Informações do cabeçalho
        const escola = pagamento.escola;
        const aluno = pagamento.mensalidade?.matricula?.aluno;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=nota_fiscal_${pagamento.id}.pdf`);
        doc.pipe(res);

        // Cabeçalho da Nota
        doc.fontSize(20).text(`Nota Fiscal de Serviço`, { align: 'center' });
        doc.moveDown();

        // Dados da Escola (Prestador)
        doc.fontSize(12).text(`Prestador: ${escola.nome || 'Nome da Escola não informado'}`, { align: 'left' });
        doc.text(`CNPJ: ${escola.cnpj || 'CNPJ não informado'}`);
        doc.moveDown();

        // Dados do Aluno (Tomador)
        if (aluno) {
            doc.text(`Tomador: ${aluno.nome || 'Nome do Aluno não informado'}`);
            doc.text(`CPF: ${aluno.cpf || 'CPF não informado'}`);
            doc.moveDown();
        }

        // Detalhes do Pagamento
        doc.fontSize(14).text('Detalhes do Pagamento', { underline: true });
        doc.fontSize(12).text(`ID do Pagamento: ${pagamento.id}`);
        doc.text(`Data do Pagamento: ${new Date(pagamento.dataPagamento).toLocaleDateString('pt-BR')}`);
        doc.text(`Método: ${pagamento.metodo}`);
        doc.moveDown();

        // Descrição do Serviço
        doc.fontSize(14).text('Descrição do Serviço', { underline: true });
        const descricaoServico = pagamento.mensalidade
            ? `Referente à mensalidade da matrícula #${pagamento.mensalidade.matriculaId}`
            : 'Referente a uma venda de produto';
        doc.fontSize(12).text(descricaoServico);
        doc.moveDown(2);

        // Total
        doc.fontSize(16).text(`Valor Total: R$ ${parseFloat(pagamento.valor).toFixed(2)}`, { align: 'right' });

        doc.end();

    } catch (error) {
        console.error("Erro ao gerar PDF da nota fiscal:", error);
        res.status(500).json({ error: 'Erro ao gerar PDF da nota fiscal', details: error.message });
    }
};
