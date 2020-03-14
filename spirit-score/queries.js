const Game = require("../game/model");
const Team = require("../team/model");
const User = require("../user/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const SpiritScore = require("../spirit-score/model");

const updateSpirit = async (updatedData, spiritScoreId) => {
  await SpiritScore.update(updatedData, {
    where: { id: spiritScoreId }
  });
};

const getGame = async gameId => {
  return await Game.findByPk(gameId, {
    include: [
      Competition,
      { model: Team, as: "homeTeam", include: [User] },
      { model: Team, as: "awayTeam", include: [User] },
      CompetitionDay,
      { model: SpiritScore, as: "homeTeamReceivedSpiritScore" },
      { model: SpiritScore, as: "awayTeamReceivedSpiritScore" }
    ]
  });
};

const createNewSpirit = async spiritData => {
  return await SpiritScore.create(spiritData);
};

const updateGameSpiritId = async (homeOrAway, spiritScoreId, gameId) => {
  const spiritReceiver =
    homeOrAway === "home"
      ? "homeTeamReceivedSpiritScoreId"
      : "awayTeamReceivedSpiritScoreId";

  await Game.update(
    {
      [spiritReceiver]: spiritScoreId
    },
    { where: { id: gameId } }
  );
};

module.exports = {
  getGame,
  updateGameSpiritId,
  createNewSpirit,
  updateSpirit
};
