const { Router } = require("express");
const Role = require("./model");
const { blockEndpoint } = require("../auth/authMiddleware");

const router = new Router();

router.post("/roles", blockEndpoint, async (req, res, next) => {
  try {
    const newRole = await Role.create(req.body);
    res.json(newRole);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
