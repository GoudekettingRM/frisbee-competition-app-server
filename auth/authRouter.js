const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("./jwt");
const { return400, return401 } = require("../helper-files/returnStatusCodes");
const { getOneUser } = require("../user/queries");

const router = new Router();

router.post("/login", async (req, res, next) => {
  const { password, email } = req.body;
  if (!password || !email) {
    return return400(res, "No login data provided.");
  }
  try {
    const user = await getOneUser({ where: { email } });
    console.log("User test,", user);

    if (!user) {
      return return401(res);
    } else if (bcrypt.compareSync(password, user.password)) {
      return res.json({
        message: "Login successful.",
        jwt: toJWT({ userId: user.id }),
        user
      });
    } else {
      return return401(res);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
