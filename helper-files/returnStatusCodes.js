function return400(res, missingData) {
  return res
    .status(400)
    .send({
      message: `Request does not contain the data needed. Errors: ${missingData}`
    })
    .end();
}

function return401(res) {
  return res
    .status(401)
    .send({
      message: `Please provide valid credentials.`
    })
    .end();
}

function return403(res) {
  return res
    .status(403)
    .send({ message: "You are not allowed to perform this action." })
    .end();
}

function return404(res, message) {
  return res
    .status(404)
    .send({ message })
    .end();
}

function return409(res) {
  return res
    .status(409)
    .send({
      message:
        "Cannot create spirit score, since this spirit score has already been created. If you want to change it, update the spirit score, rather than creating a new one."
    })
    .end();
}

module.exports = { return400, return401, return403, return404, return409 };
