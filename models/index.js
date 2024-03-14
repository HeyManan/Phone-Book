const dbConfig = require("../config/dbConfig.js");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//Tables

db.globalInfos = require("./globalInfoModel.js")(sequelize, DataTypes);
db.users = require("./userModel.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synced successfully!");
});

module.exports = db;
