const express = require("express");
const cors = require("cors");

const authRouter = require("./auth/authRouter");
const roleRouter = require("./role/router");
const userRouter = require("./user/router");
const teamRouter = require("./team/router");
const competitionRouter = require("./competition/router");

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
app.use(authRouter);
app.use(roleRouter);
app.use(userRouter);
app.use(teamRouter);
app.use(competitionRouter);

app.listen(port, onListen);
