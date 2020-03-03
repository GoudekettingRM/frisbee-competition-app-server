const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = process.env.PORT || 4000;

// ----------------------------- FUNCTIONS GO HERE --------------------------- //
function onListen() {console.log(`Listening on port ${port}!`);}

// ----------------------------- MIDDLEWARE GOES HERE--------------------------- //
const corsMiddleware = cors();
app.use(corsMiddleware);

const jsonMiddleware = express.json();
app.use(jsonMiddleware);

// ----------------------------- ROUTERS GO HERE--------------------------- //

app.listen(port, onListen);
