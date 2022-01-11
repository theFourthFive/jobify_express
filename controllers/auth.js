// path inside the require should not be "User" (1st letter capitalize)
// or we will have the following error:
// MongooseError [OverwriteModelError]: Cannot overwrite `User` model once compiled.
// const User = require("../models/user"); // it will provoke an error
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { maxAge, secret } = require("../config/settings");
const { testerEmail } = require("../config/settings").email;

const { simplifyError } = require("../helpers/errorParser");
const { loginParser } = require("../helpers/loginParser");
const { gMailer } = require("../helpers/nodeMailer");
const { whisp, yell } = require("../helpers/whisper");
const { ping } = require("../helpers/authorizer");

const createToken = (id) => {
  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  });
};

// prettier-ignore
module.exports = {
    signin: async (req, res, next) => {
      
    },

    signup: async (req, res, next) => {
      
    },

    logout: async (req, res, next) => {
        // setting the content of the cookie called "jwt" to an empty string & setting its maxAge to 1 milliseconds
        res.cookie("jwt", "", { maxAge: 1 })
        res.status(201).json("disconnected")
    },

    forgotPassword: async (req, res) => {
      
    },

    getResetPassword_UI: async (req, res) => {
      const { hash_link } = req.params;
      res.status(200).send(hash_link);
    },

    executeResetPassword: async (req, res) => {
      
    },

    changePassword: async (req, res) => {
      
    }
};
