const Sequelize = require("sequelize");
const db = require("../db");
const Role = require("../role/model");
const Team = require("../team/model");

const Organisation = db.define("organisation", {
  organisationName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  organisationEmail: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

Organisation.belongsTo(Role);
Role.hasMany(Organisation);
Team.belongsTo(Organisation);
Organisation.hasMany(Team);

module.exports = Organisation;
