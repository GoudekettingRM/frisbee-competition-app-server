const Competition = require("./model");
const { competitionInclude } = require("../helper-files/include-definitions");

const getAllCompetitions = async () => {
  return await Competition.findAll(competitionInclude);
};
const getOneCompetition = async competitionId => {
  return await Competition.findByPk(competitionId, competitionInclude);
};

const createCompetition = async competitionData => {
  return await Competition.create(competitionData);
};

module.exports = { getAllCompetitions, getOneCompetition, createCompetition };
