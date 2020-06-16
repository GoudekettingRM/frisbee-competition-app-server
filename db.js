const Sequelize = require('sequelize');
const roles = require('./role/seedData');
const standardUsers = require('./user/seedData');

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres';
const db = new Sequelize(databaseUrl);

async function syncDB() {
  try {
    await db.sync({ force: false });
    console.log('Database connected');
  } catch (error) {
    console.error('error synching database', error);
  }
}
syncDB().then(async () => {
  try {
    const Role = require('./role/model');
    const User = require('./user/model');
    const playerRole = await Role.findByPk(1);
    const admin = await User.findByPk(1);

    if (!playerRole) {
      await Role.bulkCreate(roles);
    }
    if (!admin) {
      await User.bulkCreate(standardUsers);
    }
  } catch (error) {
    console.log('Error in bulk create async', error);
  }
});

module.exports = db;
