const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Game = require("./model");

const router = new Router();

router.post("/games", async (req, res, next) => {
  try {
    const newGame = Game.create(req.body);
    res.json(newGame);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
