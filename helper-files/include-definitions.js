const Team = require("../team/model");
const User = require("../user/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const SpiritScore = require("../spirit-score/model");
const Game = require("../game/model");

const gameInclude = {
  include: [
    Competition,
    { model: Team, as: "homeTeam", include: [User] },
    { model: Team, as: "awayTeam", include: [User] },
    CompetitionDay,
    { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
    { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
  ]
};

const competitionInclude = {
  include: [
    CompetitionDay,
    { model: Team, include: [Competition, User] },
    {
      model: Game,
      include: [
        { model: Team, as: "homeTeam" },
        { model: Team, as: "awayTeam" },
        CompetitionDay,
        { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
        { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
      ]
    }
  ]
};

const organisationInclude = {
  include: [{ model: Competition, include: [CompetitionDay] }]
};

module.exports = { gameInclude, competitionInclude, organisationInclude };
