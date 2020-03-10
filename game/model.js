const Sequelize = require("sequelize");
const db = require("../db");
const Team = require("../team/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const SpiritScore = require("../spirit-score/model");

const Game = db.define("game", {
  homeTeamScore: Sequelize.INTEGER,
  awayTeamScore: Sequelize.INTEGER,
  location: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  lng: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  startTime: {
    type: Sequelize.TIME,
    allowNull: false
  }
});

Game.belongsTo(SpiritScore, { as: "homeTeamSpiritReceivedScore" });
Game.belongsTo(SpiritScore, { as: "awayTeamSpiritReceivedScore" });
Game.belongsTo(Competition);
Game.belongsTo(CompetitionDay);
Game.belongsTo(Team, { as: "homeTeam" });
Game.belongsTo(Team, { as: "awayTeam" });
Competition.hasMany(Game);
CompetitionDay.hasMany(Game);

module.exports = Game;
