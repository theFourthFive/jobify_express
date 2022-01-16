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

const { company, worker } = require("../dbconfig.js");
const { unSequelize } = require("../helpers/unSequelize");

// prettier-ignore
module.exports = {
    // http://localhost:3000/auth/login
    signin: async (req, res, next) => {
      // whisp(req.body)
      const { email, password, email_or_PhoneNumber } = req.body
      console.log("email_or_PhoneNumber: ",email_or_PhoneNumber)
      const filter = loginParser(email_or_PhoneNumber) // this function will return an object

      try {
        /************************************** Login of a Worker **************************************/

        const foundWorker = await worker.findOne({ where: filter });

        // if there's a user who have the given registered email / phone number / username
        if(foundWorker){
          // then proceed to password verification
          const success = await bcrypt.compare(password, foundWorker.dataValues.password);
          if(success){
            // the password is correct
            // send back the information about the user
            // const { workerId } = unSequelize(foundWorker) // this function will remove the password & only return the dataValues attribute
            const worker = unSequelize(foundWorker) // this function will remove the password & only return the dataValues attribute
            res.status(200).json(worker)
          } else {
            // Here the password is wrong
            // send back to the user the error
            res.status(200).json("Wrong login and password combination")
          }
        } else {
          /************************************** Login of a Company *************************************/

          // the process of login should be done only by providing the email of the company
          if("email" in filter) {

            // we check inside the table of company, if there's a registered company with the given email
            const foundCompany = await company.findOne({ where: filter })

            // if we found a registered company with the given email address
            if(foundCompany){

              // then proceed to password verification
              const success = await bcrypt.compare(password, foundCompany.dataValues.password);
              if(success){
                // the password is correct
                // send back the information about the user + his role
                const { companyId } = unSequelize(foundCompany) // this function will remove the password & only return the dataValues attribute
                res.status(200).json({ companyId })
              } else {
                // Here the password is wrong
                // send back to the user the error
                res.status(200).json("Wrong login and password combination")
              }
            } else {
              // if (foundWorker is null) and (foundCompany is null)
              // that means that there's no registered worker and no registered company with the given email

              // no such email registered
              // we don't inform the user that the email is not registered
              // but instead we tell him that the combination of email that he provided and the password are wrong
              res.status(200).json("Wrong login and password combination")
              // res.status(401).json("Wrong login and password combination") // I couldn't this error message to the front ...
            }
          } else {
            // here, either the company tried the login process, by providing their username, or their phone number
            res.status(200).json("If you are a company, please enter your email")
          }
        }
      } catch (error) {
        yell(error)
        res.status(200).json("(500) Internal Server Error");
      }
    },



    // http://localhost:3000/auth/signup (Post Request)
    signup: async (req, res, next) => {
      /*****************************************************
       * Achraf
        Worker
        {
          "firstName": "Mohamed Achraf",
          "lastName": "Karmous",
          "email": "achraf.karmous@gmail.com",
          "password": "User",
          "phoneNumber": "54686858",
          "role":"worker"
        }

        Company
        {
          "bussinessField": "Everyfield",
          "label": "Mohsen",
          "email": "mohsen.tounsi@gmail.com",
          "password": "User",
          "phoneNumber": "99909990",
          "role": "company"
        }


        * Main
        Worker
        {
          "firstName": "Mohamed Achraf",
          "LastName": "Karmous",
          "Email": "achraf.karmous@gmail.com",
          "password": "User",
          "phoneNumber": "54686858",
          "role":"worker"
        }

        Company
        {
          "Bussinessfield": "Everyfield",
          "label": "Mohsen",
          "Email": "mohsen.tounsi@gmail.com",
          "password": "User",
          "phoneNumber": "99909990",
          "role": "company"
        }
      *****************************************************/
      // const { bussinessField, label, firstName, lastName , email, password, phoneNumber, role } = req.body // Achraf
      const { Bussinessfield, label, firstName, LastName , Email, password, phoneNumber, role } = req.body // Main
      /**************************************************************************************************/
      // destructure the params from the front-end (if it's specified in the front)
      const { websiteName, subject, textFormat, htmlFormat, websiteURL } = req.body

      // fullName: "John Doe" (firstName: "John" ... lastName: "Doe" )
      const fullName = firstName + " " + LastName
      console.log(">>>>>>>>>>>>> fullName: ", fullName)

      // because I don't want to change all other variable, because it's not a class
      const email = Email

      // generate a random (non-incremental) string with the length of the hash is 128 characters
      const hash_link = require("crypto").randomBytes(64).toString("hex")

      // we initialize the parameters of NodeMailer
      mailerParams = { websiteName, email, subject, fullName, textFormat, htmlFormat, websiteURL, hash_link }

      // we send an email containing the 6 digits code
      gMailer(mailerParams, "signup")
      /**************************************************************************************************/
      
      
      if(role.toLowerCase() === "company") {
        /************************************** Sign up of a Company **************************************/
        /************************************** Sign up of a Company **************************************/
        /************************************** Sign up of a Company **************************************/

        // const newCompany = { bussinessField, label, email, phoneNumber, password } // Achraf
        const newCompany = { Bussinessfield, label, Email, phoneNumber, password } // Main
        try {
          // Other method to exclude password from selection:
          // const foundCompany = await company.findOne({ attributes: {exclude: 'password'}, where: { Email }})

          // const foundCompany = await company.findOne({ where: { email }}) // Achraf
          const foundCompany = await company.findOne({ where: { Email }}) // Main
          // if the worker already exists
          if (foundCompany !== null) {
            // then send an error message, informing "That email is already registered"
            // res.json(unSequelize(foundCompany));
            res.status(200).json("That email is already registered");
          } else {
            // before we proceed to hashing the password of the company
            // we must be sure that the given email is not used by a worker
            // const foundWorker = await worker.findOne({ where: { email }}) // Achraf
            const foundWorker = await worker.findOne({ where: { Email }}) // Main
            if(foundWorker === null){
              // that means, the email is not registered yet
              // so, we hash the password of the company:
              newCompany.password = await bcrypt.hash(password, 10);

              // we create a new company into the database
              const savedCompany = await company.create(newCompany);

              /****************************************************************************************
               * template : "signup" / "forgotpassword" / "userbanned"

               * params:
               *  websiteName (_HOST_NAME: Super Website) ("From" field)
               *  email       (Either the user or the tester email address) ("To" field)
               *  subject     ("Object" field of the mail)
               *  fullName    ("firstName and/or lastName", to personalize the user)
               *  textFormat  (Content of the mail in TextFormat)
               *  htmlFormat: (Content of the mail with HTML format)
               *
               *  websiteURL  (_DOMAIN_NAME: SuperWebsite.com)
               *  hash_link   (random & very long string)
              ****************************************************************************************/
              // // destructure the params from the front-end (if it's specified in the front)
              // const { websiteName, subject, textFormat, htmlFormat, websiteURL, firstName, LastName } = req.body

              // // fullName: "John Doe" (firstName: "John" ... lastName: "Doe" )
              // const fullName = firstName + " " + LastName

              // // because I don't want to change all other variable, because it's not a class
              // const email = Email

              // // generate a random (non-incremental) string with the length of the hash is 128 characters
              // const hash_link = require("crypto").randomBytes(64).toString("hex")

              // // we initialize the parameters of NodeMailer
              // mailerParams = { websiteName, email, subject, fullName, textFormat, htmlFormat, websiteURL, hash_link }

              // whisp("YEEEEEEEEES")
              // // we send an email containing the 6 digits code
              // gMailer(mailerParams, "signup")
              /************************* Node Mailer finished its work here **************************/

              // we only need to send an object, containing the companyId as attribute
              const { companyId } = unSequelize(savedCompany)

              // and we send the companyId as an object to the Front-end
              res.status(200).json({ companyId });
            } else {
              // the foundWorker !== null
              // which means, the email is registered inside the table of the worker
              // we must inform the user that the email is already registered
              res.status(200).json("That email is already registered")
              /***************************************************************************************
                Note:
                  In case of forgotting a password, and he provide us his email,
                  it will be shamefull for us to ask him if he's a worker or company.

                  In order to make the user experience (UX) better,
                  We must take less information from the user and provide him the best service
              ***************************************************************************************/
            }
          }
        } catch (error) {
          // issue happenned while hashing the password
          // we should only inform the user that there's an issue with a server with error code of 500
          // without specifying the issue itself of hashing the password
          yell(error);
          res.status(200).json("(500) Internal Server Error");
        }


      } else if(role.toLowerCase() === "worker"){
        /************************************** Sign up of a Worker ***************************************/
        /************************************** Sign up of a Worker ***************************************/
        /************************************** Sign up of a Worker ***************************************/

        // const newWorker = { firstName, lastName, email, password, phoneNumber } // Achraf
        const newWorker = { firstName, LastName, Email, password, phoneNumber } // Main
        try {
          // Other method to exclude password from selection:
          // const foundWorker = await worker.findOne({ attributes: {exclude: 'password'}, where: { Email }})

          // const foundWorker = await worker.findOne({ where: { email }}) // Achraf
          const foundWorker = await worker.findOne({ where: { Email }}) // Main
          // if the worker already exists
          if (foundWorker !== null) {
            // then send an error message, informing "That email is already registered"
            // res.json(unSequelize(foundWorker));
            res.json("That email is already registered");
          } else {
            // before we proceed to hashing the password of the worker
            // we must be sure that the given email is not used by a company
            // const foundCompany = await company.findOne({ where: { email }}) // Achraf
            const foundCompany = await company.findOne({ where: { Email }}) // Main
            if(foundCompany === null){
              // that means, the email is not registered yet
              // so, we hash the password of the worker:
              newWorker.password = await bcrypt.hash(password, 10)

              // we create a new worker into the database
              const savedWorker = await worker.create(newWorker)

              // we only need to send an object, containing the workerId as attribute
              const { workerId } = unSequelize(savedWorker)

              // and we send the workerId as an object to the Front-end
              res.status(200).json({ workerId });
            } else {
              // the foundCompany !== null
              // which means, the email is registered inside the table of the Company
              // we must inform the user that the email is already registered
              res.status(200).json("That email is already registered")
              /***************************************************************************************
                Note:
                  In case of forgotting a password, and he provide us his email,
                  it will be shamefull for us to ask him if he's a worker or company.

                  In order to make the user experience (UX) better,
                  We must take less information from the user and provide him the best service
              ***************************************************************************************/
            }
          }
        } catch (error) {
          // issue happenned while hashing the password
          // we should only inform the user that there's an issue with a server with error code of 500
          // without specifying the issue itself of hashing the password
          yell(error);
          res.status(200).json("(500) Internal Server Error");
        }
      }

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
