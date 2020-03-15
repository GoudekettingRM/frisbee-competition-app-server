const Team = require("../team/model");
const User = require("../user/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const SpiritScore = require("../spirit-score/model");
const Game = require("../game/model");
const Organisation = require("../organisation/model");

const gameInclude = {
  include: [
    Competition,
    {
      model: Team,
      as: "homeTeam",
      include: [{ model: User, attributes: { exclude: ["password"] } }]
    },
    {
      model: Team,
      as: "awayTeam",
      include: [{ model: User, attributes: { exclude: ["password"] } }]
    },
    CompetitionDay,
    { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
    { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
  ]
};

const competitionInclude = {
  include: [
    CompetitionDay,
    {
      model: Team,
      include: [
        Competition,
        { model: User, attributes: { exclude: ["password"] } }
      ]
    },
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

const userInclude = {
  include: [
    {
      model: Organisation,
      include: [{ model: Competition, include: [CompetitionDay] }]
    },
    { model: Team, include: [Competition] }
  ],
  attributes: { exclude: ["password"] }
};

const teamInclude = {
  include: [{ model: User, attributes: { exclude: ["password"] } }]
};

module.exports = {
  gameInclude,
  competitionInclude,
  organisationInclude,
  userInclude,
  teamInclude
};
