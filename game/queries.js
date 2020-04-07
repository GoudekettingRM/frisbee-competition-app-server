const Game = require("../game/model");
const { gameInclude } = require("../helper-files/include-definitions");

const createGame = async gameData => {
  return await Game.create(gameData);
};

const getGame = async gameId => {
  return await Game.findByPk(gameId, gameInclude);
};

const updateGame = async (updateData, gameId) => {
  return await Game.update(updateData, { where: { id: gameId } });
};

module.exports = { getGame, createGame, updateGame };
