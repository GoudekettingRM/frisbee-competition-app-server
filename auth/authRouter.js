const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../user/model");
const { toJWT } = require("./jwt");

const router = new Router();

//To enable login for administrators and users through the same endpoint, uncomment all the comments below and remove line 12 (const accountTable = User;)
router.post("/login" /*/:accountType"*/, async (req, res, next) => {
  // const accountType = req.params.accountType || "normal";
  // const accountTable = accountType === "normal" ? User : Administrator;
  const accountTable = User;
  const { password, email } = req.body;
  if (!password || !email) {
    res
      .status(400)
      .send({ message: "Please provide valid credentials to login." })
      .end();
  }

  try {
    const user = await accountTable.findOne({
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
