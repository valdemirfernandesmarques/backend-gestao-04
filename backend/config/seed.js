// backend/config/seed.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Escola = require('../models/Escola');

async function seed() {
  try {
    // Verifica se já existe uma escola
    let escola = await Escola.findOne({ where: { email: 'contato@dancaexemplo.com' } });

    if (!escola) {
      escola = await Escola.create({
        nome: 'Escola de Dança Exemplo',
        cnpj: '12345678000199',
        email: 'contato@dancaexemplo.com',
        endereco: 'Rua da Dança, 123 - Centro',
        inicioPeriodoTeste: new Date()
      });

      console.log('🏫 Escola criada:', escola.nome);
    }

    // Verifica se já existe um SUPER_ADMIN
    let user = await User.findOne({ where: { email: 'admin@dancaexemplo.com' } });

    if (!user) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      user = await User.create({
        nome: 'Administrador Exemplo',
        email: 'admin@dancaexemplo.com',
        senha: hashedPassword,
        perfil: 'SUPER_ADMIN',
        escolaId: escola.id
      });

      console.log('👤 Usuário SUPER_ADMIN criado:', user.email);
    }

  } catch (err) {
    console.error('Erro no seed:', err);
  }
}

module.exports = seed;
