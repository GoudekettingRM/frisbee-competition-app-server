const Sequelize = require("sequelize");

const databaseUrl =
  process.env.DATABASE_URL ||
  "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

async function syncDB() {
  try {
    await db.sync({ force: false });
    console.log("Database connected");
  } catch (error) {
    console.error("error synching database", error);
  }
}
syncDB();

module.exports = db;
