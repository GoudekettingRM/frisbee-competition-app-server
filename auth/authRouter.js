const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("./jwt");
const User = require("../user/model");
const Organisation = require("../organisation/model");
const Team = require("../team/model");
const Competition = require("../competition/model");
const CompetitionDay = require("../competition-day/model");
const { return400, return401 } = require("../returnStatusCodes");

const router = new Router();

router.post("/login", async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return return400(res, "No login data provided.");
  }
  try {
    const user = await User.findOne({
      where: {
        email
      },
      include: [
        {
          model: Organisation,
          include: [{ model: Competition, include: [CompetitionDay] }]
        },
        Team
      ]
    });
    if (!user) {
      return return401(res);
    } else if (bcrypt.compareSync(password, user.password)) {
      const { password, ...userData } = user.dataValues;
      res
        .send({
          message: "Login successful.",
          jwt: toJWT({ userId: user.id }),
          user: { ...userData }
        })
        .end();
    } else {
      return return401(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
