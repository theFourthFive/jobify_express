const Sequelize = require("sequelize");
const { database } = require("./config/settings");

sequelize = new Sequelize(database.mysql.url, {
  dialect: "mysql",
  operatorsAlias: false,
});

var event = sequelize.define("event", {
  eventID: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  eventName: Sequelize.DataTypes.STRING,
  location: Sequelize.DataTypes.STRING,
  date_time: Sequelize.DataTypes.STRING,
  nbrWaiter: Sequelize.DataTypes.STRING,
  nbrChef: Sequelize.DataTypes.STRING,
  nbrCleaningWorker: Sequelize.DataTypes.STRING,
  duration: Sequelize.DataTypes.INTEGER,
  dailyPay: Sequelize.DataTypes.STRING,
  nbWorkers: Sequelize.DataTypes.STRING,
  imageUri: Sequelize.DataTypes.STRING,
  companyId: Sequelize.DataTypes.STRING,
});

var company = sequelize.define("company", {
  companyId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  Bussinessfield: Sequelize.DataTypes.STRING,
  label: Sequelize.DataTypes.STRING,
  Email: Sequelize.DataTypes.STRING,
  phoneNumber: Sequelize.DataTypes.INTEGER,
  imageUrl: Sequelize.DataTypes.STRING,
  password: Sequelize.DataTypes.STRING,
});

var worker = sequelize.define("worker", {
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

var feedback = sequelize.define("feedback", {
  rate: Sequelize.DataTypes.INTEGER,
  text: Sequelize.DataTypes.STRING,
});

var hiringOffer = sequelize.define("hiringOffer", {
  from_day: Sequelize.DataTypes.DATE,
  duration_days: Sequelize.DataTypes.INTEGER,
  dailyPayement: Sequelize.DataTypes.INTEGER,
  validation: Sequelize.DataTypes.INTEGER,
});

var subscription = sequelize.define("subscription", {
  validation: Sequelize.DataTypes.STRING,
});

var accepted_Profile = sequelize.define("accepted_Profile", {
  date: Sequelize.DataTypes.DATE,
});

///////////////////////accpted profiles realation ///////////////////

event.belongsToMany(worker, { through: accepted_Profile });
worker.belongsToMany(event, { through: accepted_Profile });

///////////////////// subscription realation///////////////////////////////////////
subscription.belongsTo(event);
subscription.belongsTo(worker);

///////////////////////// HIRING OFFER REALATION //////////////////////////////////////////
hiringOffer.belongsTo(company);
hiringOffer.belongsTo(worker);
hiringOffer.belongsTo(event);

//////////////// feed BACK REALATION ///////////////////////////
company.belongsToMany(worker, { through: feedback });
worker.belongsToMany(company, { through: feedback });
event.belongsTo(company);

//  sequelize.sync({alter:true})
// worker.create({firstName :"hello " , lastName : "heh" , Email : "sasdasd" , phoneNumber : "222" , imageUrl : "asda" , CVUrl : "asdasd"})

module.exports = sequelize;

// company. create({Bussinessfield : "hotel" , label : "movenpick" , Email : "movenpick@gmail.com" , phoneNumber : 70999000 , imageUrl : "https://bit.ly/3zSqeek"})
// company. create({Bussinessfield : "traiteur" , label : "signature" , Email : "sign@gmail.com" , phoneNumber : 70999000 , imageUrl : "https://bit.ly/3Fn5Ymb"})
// company. create({Bussinessfield : "hotel" , label : "fourseasons" , Email : "fourseasons@gmail.com" , phoneNumber : 70999000 , imageUrl : "https://bit.ly/3FreS26"})

// event.create({
//   eventName: "party",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/33cxLIy",
//   companyCompanyId : 1
// });
// event.create({
//   eventName: "party",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/3HKVDSQ",
//   companyCompanyId : 1
// });
// event.create({
//   eventName: "party",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/3G5Av9b",
//   companyCompanyId : 1
// });

// event.create({
//   eventName: "family dinner",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/3F73qbE",
//   companyCompanyId : 2
// });
// event.create({
//   eventName: "family dinner",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/3F73qbE",
//   companyCompanyId : 2
// });

// event.create({
//   eventName: "party",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/33cxLIy",
//   companyCompanyId : 3
// });
// event.create({
//   eventName: "party",
//   location: "la Marsa",
//   nbrChef: 5,
//   mbrWaiter: 5,
//   mbrCleaningWorker: 5,
//   duration: 5,
//   dailyPay: 50,
//   imageUri: "https://bit.ly/33cxLIy",
//   companyCompanyId : 3
// });

// subscription.create({validation : "pending" , eventEventID : 71 , workerWorkerId : 1})
// subscription.create({validation : "pending" , eventEventID : 72, workerWorkerId : 1})
// subscription.create({validation : "pending" , eventEventID : 73 , workerWorkerId : 1})
// subscription.create({validation : "pending" , eventEventID : 74, workerWorkerId : 1})
// subscription.create({validation : "pending" , eventEventID : 75 , workerWorkerId : 1})

// prettier-ignore
{
  feedback.create({rate : 5 , text : "Good worker we can count on you for futher jobs" , companyCompanyId : 38 , workerWorkerId : 10})
  feedback.create({rate : 2 , text : "we hope that you work on having better communication" , companyCompanyId : 37 , workerWorkerId : 10})
  feedback.create({rate : 3 , text : "you can do it" , companyCompanyId : 36 , workerWorkerId : 10})
  feedback.create({rate : 5 , text : "Good worker we can count on you for futher jobs" , companyCompanyId : 38 , workerWorkerId : 10})
  feedback.create({rate : 3 , text : "Good worker we can count on you for futher jobs" , companyCompanyId : 37 , workerWorkerId : 10})
}
