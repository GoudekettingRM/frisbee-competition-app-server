const express = require("express");
const cors = require("cors");

const userRouter = require("./user/router");
const teamRouter = require("./team/router");
const roleRouter = require("./role/router");
const authRouter = require("./auth/authRouter");

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
app.use(userRouter);
app.use(teamRouter);
app.use(roleRouter);

app.listen(port, onListen);
