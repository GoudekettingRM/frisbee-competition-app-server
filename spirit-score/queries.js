const Game = require("../game/model");
const SpiritScore = require("../spirit-score/model");

const updateSpirit = async (updatedData, spiritScoreId) => {
  await SpiritScore.update(updatedData, {
    where: { id: spiritScoreId }
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
  updateGameSpiritId,
  createNewSpirit,
  updateSpirit
};
