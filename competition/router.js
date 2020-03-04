const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Competition = require("./model");
const {
  federation,
  clubBoard,
  teamCaptain,
  spiritCaptain,
  player
} = require("../endpointRoles");

const router = new Router();

router.post("/competitions", auth, async (req, res, next) => {
  try {
    const rolesAllowed = [federation];
    if (rolesAllowed.includes(req.user.roleId)) {
      const newCompetition = await Competition.create(req.body);
      res.json(newCompetition).end();
    } else {
      res
        .status(403)
        .send({
          message: "This can only be done by a federation admin account."
        })
        .end();
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
