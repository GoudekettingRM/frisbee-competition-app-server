const { Router } = require("express");
const { auth } = require("../auth/authMiddleware");
const Organisation = require("./model");

const router = new Router();

router.post("/organisations", async (req, res, next) => {
  try {
    const newOrganisation = await Organisation.create(req.body);
    res.json(newOrganisation);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
