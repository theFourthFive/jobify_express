const Sequelize = require("sequelize");
var sequelize = require("../dbconfig");

module.exports = sequelize.define("worker", {
  workerId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: Sequelize.DataTypes.STRING,
  LastName: Sequelize.DataTypes.STRING,
  Email: Sequelize.DataTypes.STRING,
  phoneNumber: Sequelize.DataTypes.INTEGER,
  imageUrl: Sequelize.DataTypes.STRING,
  CVUrl: Sequelize.DataTypes.STRING,
  availibility: Sequelize.DataTypes.STRING,
  password: Sequelize.DataTypes.STRING,
  avgRating: Sequelize.DataTypes.INTEGER,
});
