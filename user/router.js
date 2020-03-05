const { Router } = require("express");
const bcrypt = require("bcrypt");
const { toJWT } = require("../auth/jwt");
const { auth } = require("../auth/authMiddleware");
const User = require("./model");
const Organisation = require("../organisation/model");
const Team = require("../team/model");

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
        where: { teamId },
        include: [Organisation, Team]
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

router.patch("/users", auth, async (req, res, next) => {
  try {
    console.log("req.body test in patch users endpoint", req.body);
    await User.update(req.body, {
      where: { id: req.user.id }
    });
    const updatedUser = await User.findByPk(req.user.id, {
      include: [Organisation, Team]
    });

    res.json({
      message: "User updated successfully",
      updatedUser
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
