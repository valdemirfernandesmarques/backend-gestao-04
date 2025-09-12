// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'gestao_danca',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Testa a conexão ao iniciar
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com MySQL estabelecida com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error);
  }
})();

module.exports = sequelize;
