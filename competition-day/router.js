const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const CompetitionDay = require("./model");

const router = new Router();

router.post("/competition-days", async (req, res, next) => {
  try {
    const newCompetitionDay = CompetitionDay.create(req.body);
    res.json(newCompetitionDay);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
