/********************* Requires *********************/
var express = require("express");
var app = express();
var cors = require("cors");
// const { fromCallback } = require('bluebird');

const passport = require("passport");

const cookieSession = require("cookie-session");
const mongoose = require("mongoose");

/****************** Helper Functions *****************/
const { whisp, gossip, yell, ignore } = require("./helpers/whisper");
ignore(gossip);

/****************** Server Settings ******************/
const { port, database, keys } = require("./config/settings");
const passportSetup = require("./config/passport-setup");
ignore(passportSetup, passport);

/***************** Including Routes *****************/


/***** Database connection & Listening Requests *****/
mongoose.Promise = global.Promise;

const Sequelize = require("sequelize");

// sequelize = new Sequelize("jobify", "Amine", "Amine@2022", {
  sequelize = new Sequelize(database.mysql.url, {
  operatorsAlias: false,
  logging: database.logging
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
        whisp(`sequelize is now connected to the remote MySQL database: \n${database.mysql.url} \n`);
        app.listen(port, () => whisp(`The server is now listening on http://localhost:${port}/`));
        
      } catch (error) {
        yell('Unable to connect to the database:', error);
      }
    })()
  })
  .catch((error) => yell("Error have been encountered while connecting to database", error));





 
 

/******************** Middleware ********************/

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


/********************** Routes **********************/
app.get('/', (req, res, next) => {
  res.send("hello from express")
})
// app.use("/auth", auth);
// app.use("/tools", tools);
// app.use("/users", users);

/**** Middleware that Catch the "Wrong Endpoint" ****/
// Catch 404 errors and forward them to error handler
app.use((req, res, next) => {
  ignore(req, res);

  const wrongEndpoint = new Error("Not found");
  wrongEndpoint.status = 404;
  next(wrongEndpoint);
});

/************** Error handler function **************/
// Error handler function
app.use((wrongEndpoint, req, res, next) => {
  ignore(req, next);

  const error = app.get("env") === "development" ? wrongEndpoint : {};
  const status = wrongEndpoint.status || 500;

  // respond to client
  res.status(status).json({
    error: {
      message: error.message,
    },
  });
  // Respond to ourselves
  yell(err);
});
