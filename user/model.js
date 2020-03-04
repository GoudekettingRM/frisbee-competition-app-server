const Sequelize = require("sequelize");
const db = require("../db");
const Role = require("../role/model");
const Team = require("../team/model");
const Organisation = require("../organisation/model");

const User = db.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

User.belongsTo(Role);
Role.hasMany(User);
User.belongsTo(Team);
Team.hasMany(User);
User.belongsTo(Organisation);
Organisation.hasMany(User);

module.exports = User;
