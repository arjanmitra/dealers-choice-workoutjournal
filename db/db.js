const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/dealers-choice-store'
);

const init = async () => {
  try {
    await db.sync({ force: true });
    console.log('connected');
  } catch (error) {
    console.log(error);
  }
};

module.exports = init;
