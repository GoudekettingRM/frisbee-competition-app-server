const { Router } = require("express");
const bcrypt = require("bcrypt");
const Player = require("./model");

const router = new Router();

router.post("/players", async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newPlayerData = { ...req.body, password: hashedPassword };
    const player = await Player.create(newPlayerData);

    const { password, ...playerInfo } = player.dataValues;

    res.json(playerInfo);
  } catch (err) {
    next(err);
  }
});

router.get("/players", async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      const allPlayers = await Player.findAll();
      if (!allPlayers.length) {
        res
          .status(404)
          .send({ message: "No players found" })
          .end();
      }
      const allPlayersWithoutPassword = allPlayers.map(player => {
        const { password, ...playerWithoutPassword } = player.dataValues;
        return playerWithoutPassword;
      });

      res.json(allPlayersWithoutPassword);
    } else {
      const teamPlayers = await Player.findAll({
        where: { teamId: req.body.teamId }
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
