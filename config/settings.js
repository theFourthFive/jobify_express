const path = require("path");
const dotenv = require("dotenv");
const util = require("util");

let environment;
if (process.env.NODE_ENV) {
  environment = process.env.NODE_ENV; // this variable will be exported into the whiper.js to disable the console.log in production
  dotenv.config({
    path: path.resolve(`.env.${environment}`), // either .env.production or .env.development
  });
} else {
  dotenv.config(); // will load all environment variable from the .env file, and put it inside the process.env variable
}

let logger;
if (environment !== "production") {
  if (process.env.SEQUELIZE_LOG_ENABLED === "true") {
    // Development mode enabled but logging mode is ACTIVATED for sequelize
    logger = () => {
      args = ["✔️  ", ...arguments];
      process.stdout.write(util.format.apply(this, args) + "\n");
    };
  } else {
    // Development mode enabled but logging mode is disabled for sequelize
    logger = false;
  }
} else {
  // Production mode enabled ... so logging mode is set to false to sequelize
  logger = false;
}

const mongo_url =
  (process.env.MONGO_PROTOCOL ? process.env.MONGO_PROTOCOL : "mongodb://") +
  (process.env.MONGO_USERNAME ? `${process.env.MONGO_USERNAME}:` : "") +
  (process.env.MONGO_PASSWORD ? `${process.env.MONGO_PASSWORD}` : "") +
  (process.env.MONGO_DOMAIN_NAME
    ? `${process.env.MONGO_DOMAIN_NAME}/`
    : "localhost/") +
  (process.env.MONGO_DATABASE_NAME ? process.env.MONGO_DATABASE_NAME : "test");

const mysql_url =
  (process.env.MYSQL_PROTOCOL ? process.env.MYSQL_PROTOCOL : "mysql://") +
  (process.env.MYSQL_USERNAME ? `${process.env.MYSQL_USERNAME}:` : "") +
  (process.env.MYSQL_PASSWORD ? `${process.env.MYSQL_PASSWORD}` : "") +
  (process.env.MYSQL_DOMAIN_NAME
    ? `${process.env.MYSQL_DOMAIN_NAME}/`
    : "localhost/") +
  (process.env.MYSQL_DATABASE_NAME ? process.env.MYSQL_DATABASE_NAME : "test");

const serverProtocol = process.env._SERVER_PROTOCOL_ || "http://";
const hostname_ip = require("./ipAddress") || "localhost";
const serverPort = process.env._SERVER_PORT_NUMBER_ || process.env.PORT || 3000;

// prettier-ignore
const server_url = `${serverProtocol}${hostname_ip}${serverPort ? ":" : ""}${serverPort}`;

module.exports = {
  server: {
    protocol: serverProtocol,
    hostname_ip: hostname_ip,
    port: serverPort,
    environment,
    url: server_url,
  },
  database: {
    mongodb: {
      url: mongo_url,
    },
    mysql: {
      url: mysql_url,
    },
    // if we are in development mode, then check inside the .env if loggin is set to true or Not
    // if it is set on true, then enable loggin
    // else, if we are not in development mode, then disable logging
    logging:
      environment === "development"
        ? process.env.SEQUELIZE_ENABLED === "true"
          ? logging
          : false
        : false,
  },
  keys: {
    google: {
      clientID: process.env.GOOGLE_PLUS_CLIENT_ID,
      clientSecret: process.env.GOOGLE_PLUS_SECRET,
    },
    session: {
      cookieKey: process.env.COOKIE_KEY,
    },
    vonage: {
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    },
    jwt: {
      accesTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    },
  },
  email: {
    serverEmail: process.env.MAIL_LOGIN,
    serverPassword: process.env.MAIL_PASSWORD,
    testerEmail: process.env.MY_TESTING_EMAIL,
    hostName: process.env.HOST_NAME,
    domainName: process.env.DOMAIN_NAME,
    realURL: process.env.REAL_URL,
  },
};
