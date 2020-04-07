const CompetitionDay = require("./model");

const createCompetitionDay = async (date, competitionId) => {
  return await CompetitionDay.create({ date, competitionId });
};

module.exports = { createCompetitionDay };
