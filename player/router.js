const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");
const Player = require("./model");

const router = new Router();

router.post("/players", async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newPlayerData = { ...req.body, password: hashedPassword };
    const player = await Player.create(newPlayerData);

    const { password, ...playerInfo } = player.dataValues;
    res.json({
      message: "Sign up successful.",
      jwt: toJWT({ playerId: player.id }),
      player: { ...playerInfo }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/players", async (req, res, next) => {
  try {
    const teamId = req.query.teamId || null;
    if (!teamId) {
      res
        .status(400)
        .send({ message: "Please provide a team ID" })
        .end();
    } else {
      const teamPlayers = await Player.findAll({
        where: { teamId }
      });
      if (!teamPlayers.length) {
        res
          .status(404)
          .send({ message: "No players found" })
          .end();
      }
      const teamPlayersWithoutPassword = teamPlayers.map(player => {
        const { password, ...playerWithoutPassword } = player.dataValues;
        return playerWithoutPassword;
      });

      res.json(teamPlayersWithoutPassword);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
