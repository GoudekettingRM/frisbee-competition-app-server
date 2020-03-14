const Team = require("./model");
const { teamInclude } = require("../helper-files/include-definitions");

const createTeam = async teamData => {
  return await Team.create(teamData);
};

const getOneTeam = async teamId => {
  return await Team.findByPk(teamId, teamInclude);
};

const getAllTeams = async () => {
  return await Team.findAll();
};

module.exports = { createTeam, getAllTeams };
