const { Router } = require("express");
const bcrypt = require("bcrypt");
const Player = require("./model");

const router = new Router();

router.post("/players", async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newPlayerData = { ...req.body, password: hashedPassword };
    const player = await Player.create(newPlayerData);
    console.log("player test", player.dataValues);

    const { password, ...playerInfo } = player.dataValues;
    res.json(playerInfo);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
