const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../user/model");
const { toJWT } = require("./jwt");

const router = new Router();

router.post("/login", async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    res
      .status(400)
      .send({ message: "Please provide valid credentials to login." })
      .end();
  }

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      res
        .status(401)
        .send({ message: "Please supply valid credentials" })
        .end();
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
