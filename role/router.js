const { Router } = require('express');
const { auth } = require('../auth/authMiddleware');
const { createRole } = require('./queries');
const {
  superAdmin
} = require('../helper-files/role-validations/endpointRoles');
const { return403 } = require('../helper-files/returnStatusCodes');

const router = new Router();

router.post('/roles', auth, async (req, res, next) => {
  try {
    if (req.user.roleId === superAdmin) {
      const newRole = await createRole(req.body);
      return res.json(newRole);
    } else {
      return return403(res);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
