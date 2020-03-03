const { Router } = require("express");
const Team = require("./model");

const router = new Router();

router.post("/teams", async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.json(team);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
