
const Sequelize = require("sequelize");
var sequelize = require("../dbconfig")

module.exports = sequelize.define("event", {
    eventID: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    eventName : Sequelize.DataTypes.STRING,
    location: Sequelize.DataTypes.STRING,
    date_time: Sequelize.DataTypes.STRING,
    type: Sequelize.DataTypes.STRING,
    duration: Sequelize.DataTypes.INTEGER,
    dailyPay: Sequelize.DataTypes.STRING,
    nbWorkers : Sequelize.DataTypes.STRING,
    imageUri : Sequelize.DataTypes.STRING,
    companyId : Sequelize.DataTypes.STRING
    
  });

 