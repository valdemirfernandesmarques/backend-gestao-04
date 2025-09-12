// backend/controllers/pagamentoController.js
const db = require('../models');

module.exports = {
  async registrarPagamento(req, res) {
    // ==================================================================
    // ✅ INÍCIO DA DEPURAÇÃO: VAMOS VER O QUE O SERVIDOR ESTÁ RECEBENDO
    // ==================================================================
    console.log("\n--- INICIANDO TENTATIVA DE REGISTRO DE PAGAMENTO ---");
    console.log("1. Corpo completo da requisição (req.body):", req.body);
    const { mensalidadeId, valor, dataPagamento, metodo } = req.body;
    console.log("2. ID da Mensalidade extraído:", mensalidadeId);
    // ==================================================================
    // FIM DA DEPURAÇÃO
    // ==================================================================

    const t = await db.sequelize.transaction();
    try {
      const mensalidade = await db.Mensalidade.findByPk(mensalidadeId);

      if (!mensalidade) {
        // Se chegar aqui, o log nos dirá por que o ID não foi encontrado.
        console.log("3. RESULTADO: Mensalidade NÃO encontrada no banco de dados.");
        console.log("--- FIM DA TENTATIVA ---\n");
        return res.status(404).json({ error: 'Mensalidade não encontrada' });
      }
      
      console.log("3. RESULTADO: Mensalidade encontrada:", mensalidade.toJSON());

      if (req.user.perfil === 'ADMIN_ESCOLA' && mensalidade.escolaId !== req.user.escolaId) {
        return res.status(403).json({ error: 'Acesso negado: não pode registrar pagamento de outra escola' });
      }

      const pagamento = await db.Pagamento.create({
        mensalidadeId, valor, dataPagamento, metodo,
        escolaId: mensalidade.escolaId
      }, { transaction: t });

      const valorComissao = valor * 0.013;
      await db.Comissao.create({
        pagamentoId: pagamento.id,
        valor: valorComissao,
        dataComissao: new Date()
      }, { transaction: t });

      mensalidade.status = 'PAGA';
      await mensalidade.save({ transaction: t });

      await t.commit();
      console.log("4. SUCESSO: Pagamento registrado e comissão gerada.");
      console.log("--- FIM DA TENTATIVA ---\n");
      res.status(201).json({
        message: 'Pagamento registrado e comissão gerada com sucesso!',
        pagamento, mensalidade
      });
    } catch (error) {
      await t.rollback();
      console.error('ERRO GERAL:', error);
      console.log("--- FIM DA TENTATIVA COM ERRO ---\n");
      res.status(500).json({ error: 'Erro ao registrar pagamento', details: error.message });
    }
  },
  
  // O restante do arquivo continua o mesmo...
  async listarPagamentos(req, res) {
    try {
      let where = {};
      if (req.user.perfil === 'ADMIN_ESCOLA') {
        where.escolaId = req.user.escolaId;
      }
      const pagamentos = await db.Pagamento.findAll({
        where,
        include: [{
            model: db.Mensalidade, as: 'mensalidade',
            include: [{ model: db.Escola, as: 'escola', attributes: ['id', 'nome'] }]
        }]
      });
      res.json(pagamentos);
    } catch (error) {
      console.error('Erro ao listar pagamentos:', error);
      res.status(500).json({ error: 'Erro ao listar pagamentos', details: error.message });
    }
  }
};