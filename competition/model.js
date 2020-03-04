const Sequelize = require("sequelize");
const db = require("../db");
const Team = require("../team/model");

const Competition = db.define("competition", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  startDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  endDate: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  teamRegistrationDeadline: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  seedingDeadline: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  playersListDeadline: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});

Competition.belongsToMany(Team, { through: "teamsInCompetitions" });
Team.belongsToMany(Competition, { through: "teamsInCompetitions" });

module.exports = Competition;
