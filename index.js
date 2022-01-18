/*********************************************** Requires ***********************************************/
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

/******************************************** Helper Function *******************************************/
const { whisp, gossip, yell, ignore } = require("./helpers/whisper");
ignore(gossip);

/******************************************** Server Settings *******************************************/
const { server, database, keys } = require("./config/settings");
const passportSetup = require("./config/passport-setup");
ignore(passportSetup, passport);

/******************************* Database connection & Listening Requests *******************************/
mongoose.Promise = global.Promise;

const Sequelize = require("sequelize");

sequelize = new Sequelize(database.mysql.url, {
  operatorsAlias: false,
  logging: database.logging,
});

// prettier-ignore
mongoose
  .connect(database.mongodb.url)
  .then((result) => {
    ignore(result)
    whisp(`Mongoose is now connected to the remote MongoDB cluster: \n${database.mongodb.url} \n`);
    // app.listen(port, () => whisp(`The server is now listening on http://localhost:${port}/`));
    (async()=>{
      try {
        await sequelize.authenticate();
        whisp(`Sequelize is now connected to the MySQL database: \n${database.mysql.url} \n`);
        app.listen(server.port, () => whisp(`The server is now listening on ${server.url}/`));

      } catch (error) {
        yell('Unable to connect to the database:', error);
      }
    })()
  })
  .catch((error) => yell("Error have been encountered while connecting to database", error));

/********************************************** Middleware **********************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  ignore(req);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-requested-with");
  next(); // Important
});

// setting up the age of the cookie & the key to encrypt the cookie before sending it to the browser
app.use(
  cookieSession({
    // maxAge: 24 * 60 * 60 * 1000, // day in milliseconds
    maxAge: 10 * 1000, // 10 seconds in milliseconds
    keys: [keys.session.cookieKey],
  })
);

/******************************************* Including Routes *******************************************/
const auth = require("./routers/auth-routes");
const workers = require("./routers/workers");
const companies = require("./routers/companies");
const events = require("./routers/events");

// const hire = require('./routers/HiringOffer')

var company = require("./routers/company");
// var worker = require("./routers/worker");
var nodemailer = require("./routers/nodemailer");
const addEvent = require("./routers/addEvent");
/************************************************ Routes ************************************************/
app.get("/", (req, res, next) => {
  res.send("hello from express");
});

app.use("/auth", auth);
app.use("/workers", workers);
app.use("/companies", companies);

// app.use("/hire" , hire)

app.use("/events", events); // good !

app.use("/addEvent", addEvent); // ???

app.use("/nodemailer", nodemailer); // ???
app.use("/company", company); // ???

/****************************** Middleware that Catch the "Wrong Endpoint" ******************************/
// Catch 404 errors and forward them to error handler

// prettier-ignore
app.use("*", require("./middlewares/_404ErrorHandler").wrongEndpoint_And_404Error_Catcher);

/**************************************** Error handler function ****************************************/
app.use(require("./middlewares/_404ErrorHandler").errorHandler);
