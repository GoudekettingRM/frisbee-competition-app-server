const express = require("express");
const cors = require("cors");

const playerRouter = require("./player/router");
const teamRouter = require("./team/router");
const roleRouter = require("./role/router");

const app = express();
const port = process.env.PORT || 4000;

// ----------------------------- FUNCTIONS GO HERE --------------------------- //
function onListen() {
  console.log(`Listening on port ${port}!`);
}

// ----------------------------- MIDDLEWARE GOES HERE--------------------------- //
const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

// ----------------------------- ROUTERS GO HERE--------------------------- //
app.use(playerRouter);
app.use(teamRouter);
app.use(roleRouter);

app.listen(port, onListen);
