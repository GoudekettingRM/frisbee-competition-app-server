const { Router } = require("express");
const bcrypt = require("bcrypt");
const Player = require("../player/model");
const { toJWT } = require("./jwt");

const router = new Router();

//To enable login for administrators and players through the same endpoint, uncomment all the comments below and remove line 12 (const accountTable = Player;)
router.post("/login" /*/:accountType"*/, async (req, res, next) => {
  // const accountType = req.params.accountType || "normal";
  // const accountTable = accountType === "normal" ? Player : Administrator;
  const accountTable = Player;
  const { password, email } = req.body;
  if (!password || !email) {
    res
      .status(400)
      .send({ message: "Please provide valid credentials to login." })
      .end();
  }

  try {
    const player = await accountTable.findOne({
      where: {
        email
      }
    });
    if (!player) {
      res
        .status(401)
        .send({ message: "Please supply valid credentials" })
        .end();
    } else if (bcrypt.compareSync(password, player.password)) {
      const { password, ...playerData } = player.dataValues;
      res
        .send({
          message: "Login successful.",
          jwt: toJWT({ playerId: player.id }),
          player: { ...playerData }
        })
        .end();
    } else {
      res
        .status(401)
        .send({ message: "Please supply some valid credentials" })
        .end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
