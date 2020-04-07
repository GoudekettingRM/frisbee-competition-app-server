const Sequelize = require("sequelize");
const db = require("../db");

const Role = db.define("role", {
  name: Sequelize.STRING,
  createCompetitions: Sequelize.BOOLEAN,
  addGame: Sequelize.BOOLEAN,
  signUpTeam: Sequelize.BOOLEAN,
  assignTeamCaptain: Sequelize.BOOLEAN,
  assignSpiritCaptain: Sequelize.BOOLEAN,
  addAndRemovePlayers: Sequelize.BOOLEAN,
  addGameScore: Sequelize.BOOLEAN,
  addSpiritScore: Sequelize.BOOLEAN,
  readData: Sequelize.BOOLEAN,
  joinTeam: Sequelize.BOOLEAN
});

module.exports = Role;
