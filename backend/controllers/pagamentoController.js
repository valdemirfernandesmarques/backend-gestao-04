// backend/controllers/pagamentoController.js
const db = require('../models'); // ✅ CORRIGIDO: Importa o banco de dados inteiro

module.exports = {
  // ✅ CORRIGIDO: Função reescrita com lógica de negócio, segurança e transações
  async registrarPagamento(req, res) {
    // Uma transação garante que todas as operações funcionem ou nenhuma é salva.
    const t = await db.sequelize.transaction();

    try {
      const { mensalidadeId, valor, dataPagamento, metodo } = req.body;

      // Busca a mensalidade e todos os dados associados necessários para a lógica
      const mensalidade = await db.Mensalidade.findByPk(mensalidadeId, {
        include: [{
          model: db.Matricula, as: 'matricula',
          include: [{
            model: db.Turma, as: 'turma',
            include: [{ model: db.Professor, as: 'professor' }]
          }]
        }]
      });

      if (!mensalidade) {
        return res.status(404).json({ error: 'Mensalidade não encontrada' });
      }

      // Validação de segurança Multi-Tenant
      if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado: não pode registar pagamento de outra escola' });
      }

      // Cria o pagamento dentro da transação
      const pagamento = await db.Pagamento.create({
        mensalidadeId,
        valor,
        dataPagamento,
        metodo,
        escolaId: mensalidade.escolaId
      }, { transaction: t });

      // LÓGICA DE NEGÓCIO 1: Calcula a comissão do professor
      const professor = mensalidade.matricula?.turma?.professor;
      if (professor && professor.vinculo === 'Comissão' && professor.percentualComissao > 0) {
        const valorComissaoProfessor = valor * professor.percentualComissao;
        await db.Comissao.create({
          pagamentoId: pagamento.id,
          professorId: professor.id,
          valor: valorComissaoProfessor,
          dataComissao: new Date()
        }, { transaction: t });
      }

      // LÓGICA DE NEGÓCIO 2: Calcula a comissão da plataforma (1.3%)
      const valorComissaoPlataforma = valor * 0.013;
      await db.Comissao.create({
        pagamentoId: pagamento.id,
        valor: valorComissaoPlataforma,
        dataComissao: new Date(),
      }, { transaction: t });

      // LÓGICA DE NEGÓCIO 3: Atualiza o status da mensalidade para 'PAGA'
      mensalidade.status = 'PAGA';
      await mensalidade.save({ transaction: t });

      // Se tudo deu certo, confirma todas as operações no banco
      await t.commit();

      res.status(201).json({
        message: 'Pagamento registado e comissões geradas com sucesso!',
        pagamento,
        mensalidade
      });
    } catch (error) {
      // Se algo deu errado, desfaz todas as operações
      await t.rollback();
      console.error('Erro ao registar pagamento:', error);
      res.status(500).json({ error: 'Erro ao registar pagamento', details: error.message });
    }
  },

  // ✅ CORRIGIDO: Função reescrita com segurança Multi-Tenant
  async listarPagamentos(req, res) {
    try {
      let where = {};
      if (req.user.perfil === 'ADMIN_ESCOLA') {
        where.escolaId = req.user.escolaId;
      }

      const pagamentos = await db.Pagamento.findAll({
        where,
        include: [
          {
            model: db.Mensalidade,
            as: 'mensalidade',
            include: [{ model: db.Escola, as: 'escola', attributes: ['id', 'nome'] }]
          }
        ]
      });

      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos', details: error.message });
    }
  }
};