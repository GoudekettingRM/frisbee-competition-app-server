const Sequelize = require("sequelize");
const db = require("../db");
const Team = require("../team/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");

const Game = db.define("game", {
  homeTeamId: {
    type: Sequelize.INTEGER,
    references: {
      model: Team,
      key: "id"
    }
  },
  homeTeamScore: Sequelize.INTEGER,
  homeTeamReceivedSpiritScore: Sequelize.INTEGER,
  awayTeamId: {
    type: Sequelize.INTEGER,
    references: {
      model: Team,
      key: "id"
    }
  },
  awayTeamScore: Sequelize.INTEGER,
  awayTeamReceivedSpiritScore: Sequelize.INTEGER,
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

Game.belongsTo(Competition);
Game.belongsTo(CompetitionDay);
Competition.hasMany(Game);
CompetitionDay.hasMany(Game);

module.exports = Game;
