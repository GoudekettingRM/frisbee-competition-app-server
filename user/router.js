const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");
const User = require("./model");

const router = new Router();

router.post("/users", async (req, res, next) => {
  try {
    const roleId = req.body.roleId || 1;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUserData = { ...req.body, password: hashedPassword, roleId };
    const user = await User.create(newUserData);

    const { password, ...userInfo } = user.dataValues;
    res.json({
      message: "Sign up successful.",
      jwt: toJWT({ userId: user.id }),
      user: { ...userInfo }
    });
  } catch (err) {
    next(err);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const teamId = req.query.teamId || null;
    if (!teamId) {
      res
        .status(400)
        .send({ message: "Please provide a team ID" })
        .end();
    } else {
      const teamUsers = await User.findAll({
        where: { teamId }
      });
      if (!teamUsers.length) {
        res
          .status(404)
          .send({ message: "No users found" })
          .end();
      }
      const teamUsersWithoutPassword = teamUsers.map(user => {
        const { password, ...userWithoutPassword } = user.dataValues;
        return userWithoutPassword;
      });

      res.json(teamUsersWithoutPassword);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
