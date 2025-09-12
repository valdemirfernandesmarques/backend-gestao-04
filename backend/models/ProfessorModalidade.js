// backend/models/ProfessorModalidade.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Professor = require('./Professor');
const Modalidade = require('./Modalidade');

const ProfessorModalidade = sequelize.define('ProfessorModalidade', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
}, {
  tableName: 'professores_modalidades'
});

// Relação N:N
Professor.belongsToMany(Modalidade, {
  through: ProfessorModalidade,
  as: 'modalidades',
  foreignKey: 'professorId'
});

Modalidade.belongsToMany(Professor, {
  through: ProfessorModalidade,
  as: 'professores',
  foreignKey: 'modalidadeId'
});

module.exports = ProfessorModalidade;
