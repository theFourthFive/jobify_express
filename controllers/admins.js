const { worker, company, event } = require("../dbconfig.js");
var Admin = require("../models/Admin");
var BannedWorker = require("../models/BannedWorker");
var BannedCompany = require("../models/BannedCompany");
var BannedEvent = require("../models/BannedEvent");
const { unSequelize } = require("../helpers/unSequelize");
const { whisp, yell, ignore } = require("../helpers/whisper");

// prettier-ignore
module.exports = {

  // Note: I (Achraf), need this function to check the list of all admin easily

  // http://localhost:3000/admins/ (GET REQUEST)
  findAllAdmin: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must get (GET REQUEST) all admin (for testing purpose)")

    try {
      // get the list of all Admins
      const foundAdmins = await Admin.find().select("-password")
      res.status(200).json(foundAdmins);
    } catch (error) {
      yell(error)
      res.status(500).json("Don't worry, we are fixing this error right now");
    }
  },

  createOneAdmin: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must get (GET REQUEST) one admin (for testing purpose)")

    try {
      // generate a random fake email
      email = `john.doe.${Math.random()* 10**17 }@google.com`

      // generate a random password
      password = await require("bcrypt").hash(`${Math.random()* 10**17}`, 10);

      // save the email & password into a new admin object
      newRandomAdmin = {email, password}
      // save the admin with a random email & random password
      savedAdmin = await Admin.create(newRandomAdmin)

      // I searched into a database, because maybe admin will have additional data, so I won't copy each attribute except for the password
      foundAdmin = await Admin.findById(savedAdmin._id).select("-password")

      // send the clean & saved admin to the device which requested the creation of the random Admin
      res.status(201).json(foundAdmin)
    } catch (error) {
      console.log(error)
    }
  },


  // http://localhost:3000/admins/ (DELETE REQUEST)
  deleteAllAdmins: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must delete (DELETE REQUEST) all admins (for testing purpose)")

    try {

      // get all Admin without showing their password
      const foundAdmins = await Admin.find().select("-password")

      // if there's admins inside the database
      if(foundAdmins.length){

        // then loop through All admin & remove them one by one
        for(let i = 0; i < foundAdmins.length; i++){

          // remove a specific Admin
          let removedAdmin = await Admin.findByIdAndRemove({_id: foundAdmins[i]._id }).select("-password")

          // log it into the terminal
          whisp(`Admin #${i} removed:`,removedAdmin)
        }

        // log a success message into the terminal
        whisp("All admin have been successfuly removed")

        // send the list of admin that have been successfuly removed from the database
        res.status(201).json(foundAdmins)
      }
      else {
        // here, we are sure there's no admin found inside the database

        // log the error message into the terminal
        yell("No admin found to delete")

        // send to the device which requested the deletion of all admin, that, there's no admin have been found into the database
        res.status(404).json("No admin found to delete")
      }
    } catch (error) {
      yell(error)
      res.status(500).json("Don't worry, we are fixing this error right now");
    }
  },



  // http://localhost:3000/admins/${adminId}/   (GET REQUEST)
  getAdminProfile: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must get / see (GET REQUEST) my profile")
    const { adminId } = req.params

    try {
      const foundAdmin = await Admin.findById({ _id: adminId }).select("-password")

      // if there's admins inside the database
      if(foundAdmin){

        // log a success message into the terminal
        whisp("Found Admin:", foundAdmin)

        // send the list of admin that have been successfuly removed from the database
        res.status(200).json(foundAdmin)
      }
      else {
        // here, we are sure there's no admin with the given ID, found inside the database

        // log the error message into the terminal
        yell("No admin found into the database")

        // send to the device which requested the deletion of all admin, that, there's no admin have been found into the database
        res.status(404).json("No admin found with that ID is found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json("Don't worry, we are fixing this error right now");
    }
  },


  updateAdminProfile: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must update (PUT REQUEST) my profile")
    const { adminId } = req.params
    const { email } = req.body

    // create a new object, containing only the new data to update
    newAdmin = { email }

    // for each nullish attribute
    for(attribute in newAdmin){
      // delete the attribute that contains empty string or falsy value
      if(!newAdmin[attribute]) delete newAdmin[attribute]
    }

    try {
      const updatedAdmin = await Admin
                                    .findByIdAndUpdate({_id: adminId}, newAdmin, { new: true }) // (new: true) implie "return to me the new updates"
                                    .select("-password") // do not select the password

      // send the updated admin to the device
      res.status(201).json(updatedAdmin)

    } catch (error) {
      res.status(500).json("Failed to update data, please try again")
    }
  },


  removeMyAccount: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must update (PUT REQUEST) my profile")
    const { adminId } = req.params

    try {
      // create a new object, containing only the new data to update
      const removedAdmin = await Admin
                                  .findByIdAndRemove({ _id: adminId })
                                  .select("-password")

      whisp("Removed Admin:", removedAdmin)
      // send the updated admin to the device
      res.status(201).json(removedAdmin)

    } catch (error) {
      res.status(500).json("Failed to remove data, please try again")
    }
  },


  // http://localhost:3000/admins/workers
  getAllWorkers: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) all workers")

    try {
      // find all non banned worker from MySQL database
      foundWorkers_MySQL = (await worker.findAll()).sort((a,b)=> a.workerId - b.workerId)

      // if we got a non empty list of users
      if(foundWorkers_MySQL.length){

        // we suppose that all worker are not banned
        All_Workers = unSequelize(foundWorkers_MySQL).map(worker =>{
            worker.status = "Active"
            return worker
          })
        // we must get the list of the banned users from Mongo
        const foundBannedWorkers_Mongo = (await BannedWorker.find()).sort((a,b) =>{
          return JSON.parse(a.accountInfo).workerId - JSON.parse(b.accountInfo).workerId
        })

        // if we got a non empty list of banned user from Mongo
        if(foundBannedWorkers_Mongo.length){
          /*****************************************************************************************************/
          // here I'm going to merge 2 list of worker that I got from 2 different databases:
          // list of all workers (banned & non banned one) from MySQL
          // list of banned workers from Mongo

          // we go through the list of banned workers & we update their status into All_Workers array
          let j= 0
          for(let i = 0; i < foundBannedWorkers_Mongo.length; i++){

            // we need to parse the stringified data from the company data that we got from Mongo's database
            let bannedWorker = JSON.parse(foundBannedWorkers_Mongo[i].accountInfo)

            // we remove the hashed password of the banned Worker, before we send the requested company to the admin
            delete bannedWorker.password

            // we specify the actual status of the user: "Banned"
            bannedWorker.status = "Banned"

            while(All_Workers[j].workerId !== bannedWorker.workerId){ j++ }

            // we update the current banned worker with a non-deleted data from Mongo, but with status = "Banned"
            All_Workers[j] = bannedWorker

          }

          res.status(200).json(All_Workers)
          /*****************************************************************************************************/
        }
        else {
          // we got an empty list of banned workers from Mongo
          // then we send the list of worker that we got from MySQL database
          res.status(200).json(All_Workers)
        }

      }
      else {
        res.status(404).json("There's no found user")
      }
    } catch (error) {
      yell(error);
      res.status(500).json("(500) Internal Server Error")
    }
  },


  // http://localhost:3000/admins/worker/${workerId}   (GET REQUEST)
  getSpecificWorker: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) a specific worker")

    const { workerId } = req.params

    try {
      foundWorker_MySQL = unSequelize(await worker.findOne({ where: { workerId } }))

      // if we found the requested user from our MySQL databse
      if(foundWorker_MySQL){

        // get the email of the worker to search if he's already banned or not
        const email = foundWorker_MySQL.Email // no destructuring because, the attribute is not a class & should be renamed later

        // we check into Mongo database if the worker is banned
        const foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if the requested worker is found inside the "Banned Workers List" (inside the Mongo database)
        if(foundBannedWorker_Mongo){
          const bannedWorker = JSON.parse(foundBannedWorker_Mongo.accountInfo)

          // we remove the hashed password before we send the requested worker to the admin
          delete bannedWorker.password

          // we specify the actual status of the worker: "Banned"
          bannedWorker.status = "Banned"

          // we send the requested data to the admin
          res.status(200).json(bannedWorker)
        }
        else {
          // if the requested worker is not banned:

          // we add status "Active" before we send the response to the Admin
          foundWorker_MySQL.status = "Active"

          // we send to the admin the found worker with his status (banned or active)
        res.status(200).json(foundWorker_MySQL)
        }
      }
      else {
        // if the specified user is not found, tell the admin that the requested user is not found
        res.status(404).json("There's no found user")
      }
    } catch (error) {
      console.log(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },


  // http://localhost:3000/admins/worker/${workerId}    (PUT REQUEST)
  updateSpecificWorker: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must update (PUT REQUEST) a specific worker")

    // get with destructuring, only the workerId, to search the user to update or to unban
    const { workerId } = req.params

    // the unbanWorker constant, should be boolean (until the further order ...)
    const { unbanWorker } = req.body

    // if the concerning request is related to unban user, then we grab data from MongoDB, then we save it into MySQL database
    if(unbanWorker){

      // get the banned user from MySQL database, by ID
      const foundBannedWorker_MYSQL =  await worker.findOne({ where: { workerId }})

      // check if the worker is really inside the MySQL database
      if(foundBannedWorker_MYSQL){

        // we get the email of the banned worker from MySQL, in order to make a search of banned worker, inside the "Banned Workers List", inside Mongo database
        const email = unSequelize(foundBannedWorker_MYSQL).Email

        // get the banned worker from the "Banned Workers List" (from Mongo database)
        const foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if the worker is inside "Banned Workers List" (from Mongo database)
        if(foundBannedWorker_Mongo){

          // we parse his accountInfo, into a constant:
          const unbannedWorker = JSON.parse(foundBannedWorker_Mongo.accountInfo)

          // we update the parsed data, of the unbanned user, into MySQL database
          const savedUnbannedWorker = await worker.update( unbannedWorker, { where: { workerId }})

          // if at least one row have been updated
          if(savedUnbannedWorker[0]){

            // delete the unbanned worker from the "Banned Workers List" (from Mongo database)
            const removedBannedWorker_Mongo = await BannedWorker.findByIdAndRemove({ _id: foundBannedWorker_Mongo._id })

            // if the unbanned worker have been successfully removed from the "Banned Workers List"
            if(removedBannedWorker_Mongo) {

              // since there's no way to get the updated data with my sequelize, we have to do fetch data again
              const foundUnbannedWorker_MYSQL = unSequelize(await worker.findOne({ where: { workerId } }))
              foundUnbannedWorker_MYSQL.status = "Banned"

              // send to the admin the data that have been updated into the MySQL database
              res.status(201).json(foundUnbannedWorker_MYSQL)
            }
            else {
              // if the data has not been successfully removed from the "Banned Workers List " (from the Mongo database)
              res.status(500).json("(500) Internal Server Error")
            }
          }
        }
        else {
          // if the worker is not found inside the "Banned Workers List"
          // we must inform the admin, the operation of unban is failure
          res.status(404).json("Unban operation failed: That worker have not been banned yet")
        }
      }
      else {
        // if the requested worker (to unban), is not inside the database of MySQL

        // that means:
        // 1) he's not registered
        // 2) hard deleted

        // There's no Worker found with the given ID (inside the MySQL database)
        res.status(404).json("The requested worker is not found")
      }
    }
    else {
      // If unbanWorker === undefined or falsy:
      // The admin want to just modify a specific data, or all data of a specific registered worker, with the given workerId

      // the secure way to get a specific data from the body
      const { firstName, LastName, Email, phoneNumber, imageUrl, CVUrl, availibility, avgRating } = req.body

      // we don't want to polluate the content of the constant with the req.body, we only need the following data:
      const newWorker = { firstName, LastName, Email, phoneNumber, imageUrl, CVUrl, availibility, avgRating, updatedAt: Date() }

      try {
        // we must check first, if the user exist in our database & get his email to check if he's banned or not (inside Mongo database)
        const foundWorker_MySQL = unSequelize(await worker.findOne({ where: { workerId } }))

        // we need the email to check if the requested worker, is inside the "Banned Workers List" (inside Mongo database)
        const email = foundWorker_MySQL.Email // no destructuring here, since the attribute name is not a class

        // we check if the worker is inside the the "Banned Workers List" (inside Mongo database)
        const foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if the requested user is found inside the "Banned Workers List" (inside Mongo database)
        if(foundBannedWorker_Mongo){
          // we parse his accountInfo from Mongo, we modify it, then we update it back into Mongo database (Banned Worker List)
          const { _id, accountInfo } = foundBannedWorker_Mongo

          // we parse the accountInfo from
          const bannedWorkerAccountInfo = JSON.parse(accountInfo)

          // for each non-undefined attibute, we update it into our database
          for(attribute in newWorker){

            // if the value of the attibute is defined (empty string, or even zero, are accepted)
            if(newWorker[attribute] !== undefined){

              // we override the newest value that we got from the fron-end into the data that we got from the database
              bannedWorkerAccountInfo[attribute] = newWorker[attribute]
            }
          }

          // we stringify the updated data before we save it into the database
          newData = {accountInfo : JSON.stringify(bannedWorkerAccountInfo)}

          // we only update the account info of the banned worker, directly into our "Banned Workers List" (inside Mongo database)
          const updatedBannedWorker_Mongo = await BannedWorker.findByIdAndUpdate(_id, newData , {new: true})

          // we only parse the updated account info after modification, in order to send it (without the password) to the admin
          const bannedWorker = JSON.parse(updatedBannedWorker_Mongo.accountInfo)

          // we must not include the password into the data that will be sent to the admin
          delete bannedWorker.password

          // we specify the status of the banned worker to : "Banned"
          bannedWorker.status = "Banned"

          res.status(201).json(bannedWorker)
        }
        else {
          // if the requested user is not found inside the "Banned Workers List" (inside Mongo database):
          // we update the data of the non-banned Worker inside the MySQL database
          const updatedWorker_MySQL = await worker.update( newWorker, { where: { workerId }})

          // if there's at least 1 row that have been modified
          if(updatedWorker_MySQL.length){

            // we must get the new
            const foundWorker_MySQL = unSequelize(await worker.findOne({ where: { workerId }}))

            // we specify the worker's status as "Active"
            foundWorker_MySQL.status = "Active"

            // we send back the modified version of the Worker
            res.status(201).json(foundWorker_MySQL)

          }
          else { // this part will never be executed (even in case if we don't provide the new data to update)
            // if there's no updates

            // no need to get the new data from the MySQL database, we only send the data that we already got previously
            // we must inform the admin that, there's no modification that have been done on the actual user
            res.status(200).json("Nothing have been updated")

          }
        }

      } catch (error) {
        yell(error)
        res.status(500).json("(500) Internal Server Error")
      }
    }
  },


  // http://localhost:3000/admin/workers/${workerId}     (DELETE REQUEST)
  deleteSpecificWorker: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must delete (DELETE REQUEST) a specific worker")

    const { workerId } = req.params

    try {
      // find inside the MySQL database, if there's a worker with the given workerId to ban
      foundWorker = await worker.findOne({ where: { workerId }})

      // if the requested worker is inside the database of MySQL, that means he's not banned
      if(foundWorker){

        // we save the worker to ban into the Mongo database, with his email, & accountInfo that contains all the info, including his email too
        const email = foundWorker.dataValues.Email // no destructuring here, becasue the name of the attribute is supposed to be lowercase
        const accountInfo = JSON.stringify(foundWorker.dataValues)

        // we create a new data structure for the Worker to ban
        newBannedWorker = { email, accountInfo }

        // Check if the specific worker is already added to "Banned Workers List", inside the database of Mongo
        foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if there's no banned user inside the database of Mongo, then save it
        if(!foundBannedWorker_Mongo){

          // we save the banned worker into the database
          savedBannedWorker_Mongo = await BannedWorker.create(newBannedWorker)

          // check if the worker has been added to banned list inside the Mongo database
          if(savedBannedWorker_Mongo) {

            // show into the terminal the given message
            whisp("Added the worker to \"banned worker list\"")

            // we create a new data for the banned worker to save into the database of MySQL
            const bannedWorker_MYSQL = {}

            // override every attribute with an emptyString, except for the email & id
            for(attribute in foundWorker.dataValues){

              // if the attribute is not an email or not an Id
              if(!["Email","workerId"].includes(attribute)){

                // Note: we cannot save a string value into a field which accept only number, and vice-versa !!!!!!!!!!!!!!

                // if the type of the field (or the row) is a string
                if(typeof foundWorker.dataValues[attribute] === "string"){

                  // then the new value will be an empty String
                  bannedWorker_MYSQL[attribute] = ""

                }
                else if (typeof foundWorker.dataValues[attribute] === "number"){

                  // if the type of the field (or the row) is a number
                  // then the new value will be 0
                  bannedWorker_MYSQL[attribute] = 0

                }
                else if (foundWorker.dataValues[attribute] === null ){

                  // if the type of the field (or the row) is an object (null or a date / time / DateTime)
                  // then save it, as it is
                  bannedWorker_MYSQL[attribute] = foundWorker.dataValues[attribute]
                }
              }
              else {

                // else, we save his email and his id into the database (we don't need to modify the id)
                bannedWorker_MYSQL[attribute] = foundWorker.dataValues[attribute]
              }
            }

            // after creating new value to overide those of the worker inside the MySQL databse
            // we update the data of the freshly banned worker into the database of MySQL
            const savedBannedWorker_MYSQL = await worker.update( bannedWorker_MYSQL, { where: { workerId }})

            // if at least one row have been updated
            if(savedBannedWorker_MYSQL[0]){

              // show in the terminal the worker that have been deleted with his data before he got the ban
              whisp("Worker Banned successfuly:", foundWorker.dataValues)

              // send to the admin, the new data that have been added to database
              res.status(201).json(savedBannedWorker_Mongo)

            }
            else {
              // that means, there's no update that happened on any rows
              res.status(201).json("Failed to ban that User")
            }
          }
          else {
            // if the Worker has not been saved into the "Banned Workers list" (inside the database of Mongo)
            // we inform the admin that, the operation of adding the worker to the banned list is a failure
            res.status(500).json("Failed to add that worker to the banned list, please try again")
          }
        }
        else {
          // if the Worker is already inside the database of Mongo, which means, he's already banned
          res.status(404).json("That worker is already banned")
        }
      }
      else {
        // if the requested user is not found inside the databse

        // that means:
        // 1) he's not registered yet
        // 2) or he have been hard deleted
        // 3) or the given workerId is wrong

        // in this case, we inform the admin that, the requested user is not found
        res.status(404).json("The requested user is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },


  // http://localhost:3000/admins/companies
  getAllCompanies: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) all companies")

    try {
      // find all non banned company from MySQL database
      foundCompanies_MySQL = (await company.findAll()).sort((a,b)=> a.companyId - b.companyId)

      // if we got a non empty list of users
      if(foundCompanies_MySQL.length){

        // we suppose that all company are not banned
        All_Companies = unSequelize(foundCompanies_MySQL).map(company =>{
            company.status = "Active"
            return company
          })
        // we must get the list of the banned users from Mongo
        const foundBannedCompanies_Mongo = (await BannedCompany.find()).sort((a,b) =>{
          return JSON.parse(a.accountInfo).companyId - JSON.parse(b.accountInfo).companyId
        })

        // if we got a non empty list of banned user from Mongo
        if(foundBannedCompanies_Mongo.length){
          /*****************************************************************************************************/
          // here I'm going to merge 2 list of company that I got from 2 different databases:
          // list of all companies (banned & non banned one) from MySQL
          // list of banned companies from Mongo

          // we go through the list of banned companies & we update their status into All_Companies array
          let j= 0
          for(let i = 0; i < foundBannedCompanies_Mongo.length; i++){

            let bannedCompany = JSON.parse(foundBannedCompanies_Mongo[i].accountInfo)
            delete bannedCompany.password
            bannedCompany["status"] = "Banned"

            while(All_Companies[j].companyId !== bannedCompany.companyId){ j++ }

            // we update the current banned company with a non-deleted data from Mongo, but with status = "Banned"
            All_Companies[j] = bannedCompany

          }

          res.status(200).json(All_Companies)
          /*****************************************************************************************************/
        }
        else {
          // we got an empty list of banned companies from Mongo
          // then we send the list of company that we got from MySQL database
          res.status(200).json(All_Companies)
        }

      }
      else {
        res.status(404).json("There requested companies are not found")
      }
    } catch (error) {
      yell(error);
      res.status(500).json("(500) Internal Server Error")
    }
  },


  getSpecificCompany: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) a specific company")

    const { companyId } = req.params

    try {
      foundCompany_MySQL = unSequelize(await company.findOne({ where: { companyId } }))

      // if we found the requested user from our MySQL databse
      if(foundCompany_MySQL){

        // get the email of the company to search if he's already banned or not
        const email = foundCompany_MySQL.Email // no destructuring because, the attribute is not a class & should be renamed later

        // we check into Mongo database if the company is banned
        const foundBannedCompany_Mongo = await BannedCompany.findOne({ email })

        // if the requested company is found inside the banned companies list (inside the Mongo database)
        if(foundBannedCompany_Mongo){

          // we need to parse the stringified data from the company data that we got from Mongo's database
          const bannedCompany = JSON.parse(foundBannedCompany_Mongo.accountInfo)

          // we remove the hashed password before we send the requested company to the admin
          delete bannedCompany.password

          // we specify the actual status of the company: "Banned"
          bannedCompany.status = "Banned"

          // we send the requested data to the admin
          res.status(200).json(bannedCompany)

        }
        else {
          // if the requested company is not banned:

          // we add status "Active" before we send the response to the Admin
          foundCompany_MySQL.status = "Active"

          // we send to the admin the found company with his status (banned or active)
          res.status(200).json(foundCompany_MySQL)

        }
      }
      else {
        // if the specified user is not found, tell the admin that the requested company is not found
        res.status(404).json("There requested company is not found")
      }
    } catch (error) {
      console.log(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },



  // http://localhost:3000/admins/companies/${companyId}    (PUT REQUEST)
  updateSpecificCompany: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must update (PUT REQUEST) a specific worker")

    // get with destructuring, only the companyId, to search the user to update or to unban
    const { companyId } = req.params

    // the unbanCompany constant, should be boolean (until the further order ...)
    const { unbanCompany } = req.body

    // if the concerning request is related to unban user, then we grab data from MongoDB, then we save it into MySQL database
    if(unbanCompany){

      // get the banned company from MySQL database, by ID
      const foundBannedCompany_MYSQL =  await company.findOne({ where: { companyId }})

      // check if the company is really inside the MySQL database
      if(foundBannedCompany_MYSQL){

        // we get the email of the banned company from MySQL, in order to make a search of banned worker, inside the "Banned Companies List", inside Mongo database
        const email = unSequelize(foundBannedCompany_MYSQL).Email

        // get the banned worker from the "Banned Companies List" (from Mongo database)
        const foundBannedCompany_Mongo = await BannedCompany.findOne({ email })

        // if the worker is inside "Banned Companies List" (from Mongo database)
        if(foundBannedCompany_Mongo){

          // we parse his accountInfo, into a constant:
          const unbannedCompany = JSON.parse(foundBannedCompany_Mongo.accountInfo)

          // we destructure the list of the non-banned-event before the last ban that the company got
          const nonBannedEvents = JSON.parse(foundBannedCompany_Mongo.nonBannedEvents)
          whisp("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS", nonBannedEvents)

          // before we unban the company, we must restore back the list of the non-banned-event
          for(eventToUnban of nonBannedEvents){
            try {

              // destructure the eventID from the event to restore
              const { eventID } = eventToUnban

              // we restore back the deleted event from the MySQL database
              const unbannedEvent = await event.update( eventToUnban, { where: { eventID }})

              // if there's at least 1 row modified after the update, we show in the console, the restored event <<<<<<<<<<<<<<
              if(unbannedEvent[0]) whisp("Event restored successfully", await BannedEvent.findOneAndRemove({eventID}))
            } catch (error) {
              yell(error)
            }
          }

          // we update the parsed data, of the unbanned company, into MySQL database
          const savedUnbannedCompany = await company.update( unbannedCompany, { where: { companyId }})

          // if at least one row have been updated
          if(savedUnbannedCompany[0]){

            // delete the unbanned worker from the "Banned Companies List" (from Mongo database)
            const removedBannedCompany_Mongo = await BannedCompany.findByIdAndRemove({ _id: foundBannedCompany_Mongo._id })

            // if the unbanned worker have been successfully removed from the "Banned Companies List"
            if(removedBannedCompany_Mongo) {

              // since there's no way to get the updated data with my sequelize, we have to do fetch data again
              const foundUnbannedCompany_MYSQL = unSequelize(await company.findOne({ where: { companyId } }))

              // we specify the status of the unbanned company as Active
              foundUnbannedCompany_MYSQL.status = "Active"

              // send to the admin the data that have been updated into the MySQL database
              res.status(201).json(foundUnbannedCompany_MYSQL)
            }
            else {
              // if the data has not been successfully removed from the "Banned Companies List " (from the Mongo database)
              res.status(500).json("(500) Internal Server Error")
            }
          }
        }
        else {
          // if the worker is not found inside the "Banned Companies List"
          // we must inform the admin, the operation of unban is failure
          res.status(404).json("Unban operation failed: That worker have not been banned yet")
        }
      }
      else {
        // if the requested worker (to unban), is not inside the database of MySQL

        // that means:
        // 1) he's not registered
        // 2) hard deleted

        // There's no Company found with the given ID (inside the MySQL database)
        res.status(404).json("The requested worker is not found")
      }
    }
    else {
      // If unbanCompany === undefined or falsy:
      // The admin want to just modify a specific data, or all data of a specific registered worker, with the given companyId

      // the secure way to get a specific data from the body
      const { firstName, LastName, Email, phoneNumber, imageUrl, CVUrl, availibility, avgRating } = req.body

      // we don't want to polluate the content of the constant with the req.body, we only need the following data:
      const newCompany = { firstName, LastName, Email, phoneNumber, imageUrl, CVUrl, availibility, avgRating, updatedAt: Date() }

      try {
        // we must check first, if the user exist in our database & get his email to check if he's banned or not (inside Mongo database)
        const foundCompany_MySQL = unSequelize(await company.findOne({ where: { companyId } }))

        // we need the email to check if the requested worker, is inside the "Banned Companies List" (inside Mongo database)
        const email = foundCompany_MySQL.Email // no destructuring here, since the attribute name is not a class

        // we check if the worker is inside the the "Banned Companies List" (inside Mongo database)
        const foundBannedCompany_Mongo = await BannedCompany.findOne({ email })

        // if the requested user is found inside the "Banned Companies List" (inside Mongo database)
        if(foundBannedCompany_Mongo){
          // we parse his accountInfo from Mongo, we modify it, then we update it back into Mongo database (Banned Company List)
          const { _id, accountInfo } = foundBannedCompany_Mongo

          // we parse the accountInfo from
          const bannedCompanyAccountInfo = JSON.parse(accountInfo)

          // for each non-undefined attibute, we update it into our database
          for(attribute in newCompany){

            // if the value of the attibute is defined (empty string, or even zero, are accepted)
            if(newCompany[attribute] !== undefined){

              // we override the newest value that we got from the fron-end into the data that we got from the database
              bannedCompanyAccountInfo[attribute] = newCompany[attribute]
            }
          }

          // we stringify the updated data before we save it into the database
          newData = {accountInfo : JSON.stringify(bannedCompanyAccountInfo)}

          // we only update the account info of the banned worker, directly into our "Banned Companies List" (inside Mongo database)
          const updatedBannedCompany_Mongo = await BannedCompany.findByIdAndUpdate(_id, newData , {new: true})

          // we only parse the updated account info after modification, in order to send it (without the password) to the admin
          const bannedCompany = JSON.parse(updatedBannedCompany_Mongo.accountInfo)

          // we must not include the password into the data that will be sent to the admin
          delete bannedCompany.password

          // we specify the status of the banned worker to : "Banned"
          bannedCompany.status = "Banned"

          res.status(201).json(bannedCompany)
        }
        else {
          // if the requested user is not found inside the "Banned Companies List" (inside Mongo database):
          // we update the data of the non-banned Company inside the MySQL database
          const updatedCompany_MySQL = await company.update( newCompany, { where: { companyId }})

          // if there's at least 1 row that have been modified
          if(updatedCompany_MySQL.length){

            // we must get the new
            const foundCompany_MySQL = unSequelize(await company.findOne({ where: { companyId }}))

            // we specify the worker's status as "Active"
            foundCompany_MySQL.status = "Active"

            // we send back the modified version of the Company
            res.status(201).json(foundCompany_MySQL)

          }
          else { // this part will never be executed (even in case if we don't provide the new data to update)
            // if there's no updates

            // no need to get the new data from the MySQL database, we only send the data that we already got previously
            // we must inform the admin that, there's no modification that have been done on the actual user
            res.status(200).json("Nothing have been updated")

          }
        }

      } catch (error) {
        yell(error)
        res.status(500).json("(500) Internal Server Error")
      }
    }
  },



  // http://localhost:3000/admin/companies/${companyId}     (DELETE REQUEST)
  deleteSpecificCompany: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must delete (DELETE REQUEST) a specific company")

    const { companyId } = req.params

    try {
      // find inside the MySQL database, if there's a company with the given companyId to ban
      foundCompany = await company.findOne({ where: { companyId }})

      // if the requested company is inside the database of MySQL, that means he's not banned
      if(foundCompany){

        // we save the company to ban into the Mongo database, with his email, & accountInfo that contains all the info, including his email too
        const email = foundCompany.dataValues.Email // no destructuring here, becasue the name of the attribute is supposed to be lowercase

        // simple way to store data from Mysql database to Mongo database
        const accountInfo = JSON.stringify(foundCompany.dataValues)

        // Check if the specific company is already added to "Banned Companies List", inside the database of Mongo
        const foundBannedCompany_Mongo = await BannedCompany.findOne({ email })

        // if there's no banned user inside the database of Mongo, then save it
        if(!foundBannedCompany_Mongo){
          const { hardDelete } = req.body

          // this variable will contains the list of the non-banned-events (only if the hard delete is not requested)
          // after the unban of the company, the non-banned-events will not be restored from this variable
          let nonBannedEvents = []

          // if the hard delete is NOT requested
          if(!hardDelete){

            // look for all it's non-banned & banned-events before it get the actual ban
            companyEvents = (await event.findAll({ where : { companyCompanyId: companyId }})).map(event => event.dataValues)

            for(eachEvent of companyEvents){
              const { eventID } = eachEvent
              if(!await BannedEvent.findOne({eventID})) nonBannedEvents.push(eachEvent)
            }
          }

          // we create a new data structure for the Company to ban (with stringified empty array, if the nonBannedEvents === "")
          const newBannedCompany = { email, accountInfo, nonBannedEvents: JSON.stringify(nonBannedEvents) }

          // we save the banned company into the database
          const savedBannedCompany_Mongo = await BannedCompany.create(newBannedCompany)

          // check if the company has been added to banned list inside the Mongo database
          if(savedBannedCompany_Mongo) {
            // Now, if the company have been added to the "Banned Companies List"
            // We must remove it from MySQL database:

            // show into the terminal the given message
            whisp("Added the company to \"banned company list\"", savedBannedCompany_Mongo)

            // we create a new data for the banned company to save into the database of MySQL
            const bannedCompany_MYSQL = {}

            // override every attribute with an emptyString, except for the email & id
            for(attribute in foundCompany.dataValues){

              // if the attribute is not an email or not an Id
              if(!["Email","companyId"].includes(attribute)){

                // Note: we cannot save a string value into a field which accept only number, and vice-versa !!!!!!!!!!!!!!

                // if the type of the field (or the row) is a string
                if(typeof foundCompany.dataValues[attribute] === "string"){

                  // then the new value will be an empty String
                  bannedCompany_MYSQL[attribute] = ""

                }
                else if (typeof foundCompany.dataValues[attribute] === "number"){

                  // if the type of the field (or the row) is a number
                  // then the new value will be 0
                  bannedCompany_MYSQL[attribute] = 0

                }
                else if (foundCompany.dataValues[attribute] === null ){

                  // if the type of the field (or the row) is an object (null or a date / time / DateTime)
                  // then save it, as it is
                  bannedCompany_MYSQL[attribute] = foundCompany.dataValues[attribute]
                }
              }
              else {

                // else, we save his email and his id into the database (we don't need to modify the id)
                bannedCompany_MYSQL[attribute] = foundCompany.dataValues[attribute]
              }
            }

            // after creating new value to overide those of the company inside the MySQL databse
            // we update the data of the freshly banned company into the database of MySQL
            const savedBannedCompany_MYSQL = await company.update(bannedCompany_MYSQL, { where: { companyId }})

            // if at least one row have been updated
            if(savedBannedCompany_MYSQL[0]){
              // before we send the data, to the admin,
              // we must add the list of non-banned-event (before this actual ban) to the banned list

              // for each eventToBan
              for(eventToBan of nonBannedEvents){

                // we destructure the eventID of each eventToBan
                const { eventID } = eventToBan

                // if the hardDelete is requested, we destroy the event from the MySQL database
                if(hardDelete){

                  // destroying an instance may generate errors that broke our server
                  try {

                    // we delete the event completely from the database
                    let bannedEvent = await event.destroy({ where: { eventID } })
                    whisp("Event deleted successfuly:", bannedEvent)

                  } catch (error) {
                    console.log(error)
                  }

                }
                else {
                  // if the hard delete is not requested

                  // we add the non-banned-event to the "Banned Events List":
                  const editable = "false" // with no possibility to edit it later (except when we unban that event)
                  const eventInfo = JSON.stringify(eventToBan)
                  const savedBannedEvent_Mongo = await BannedEvent.create({ eventID, eventInfo, editable })

                  // if the event is saved successfully into the "Banned Event List"
                  if(savedBannedEvent_Mongo){
                    /******************************************************************************************/
                    // updating an instance may generate errors that broke our server
                    try {

                      // we create a new data for the banned event to save into the database of MySQL
                      const bannedEvent_MYSQL = {}

                      // override every attribute with an emptyString, except for the eventID & companyCompanyId
                      for(attribute in eventToBan){

                        // if the attribute is not an eventID
                        if(!["eventID","companyCompanyId"].includes(attribute)){

                          // Note: we cannot save a string value into a field which accept only number, and vice-versa !!!!!!!!!!!!!!

                          // if the type of the field (or the row) is a string
                          if(typeof eventToBan[attribute] === "string"){

                            // then the new value will be an empty String
                            bannedEvent_MYSQL[attribute] = ""

                          }
                          else if (typeof eventToBan[attribute] === "number"){

                            // if the type of the field (or the row) is a number
                            // then the new value will be 0
                            bannedEvent_MYSQL[attribute] = 0

                          }
                          else if (eventToBan[attribute] === null ){

                            // if the type of the field (or the row) is an object (null or a date / time / DateTime)
                            // then save it, as it is
                            bannedEvent_MYSQL[attribute] = eventToBan[attribute]
                          }
                        }
                        else {

                          // else, we save his eventID and his id into the database (we don't need to modify the id)
                          bannedEvent_MYSQL[attribute] = eventToBan[attribute]
                        }
                      }

                      // after creating new value to overide those of the event inside the MySQL databse
                      // we update the data of the freshly banned event into the database of MySQL
                      const savedBannedEvent_MYSQL = await event.update(bannedEvent_MYSQL, { where: { eventID }})
                      // whisp("EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE", savedBannedEvent_MYSQL)

                      // if at least one row have been updated
                      if(savedBannedEvent_MYSQL[0]){

                        result = unSequelize(await event.findOne({ where :{eventID} }))

                        // show in the terminal the event that have been deleted with his data before he got the ban
                        whisp("Event Banned successfuly:", result)

                        // send to the admin, the new data that have been added to database
                        // res.status(201).json(savedBannedEvent_Mongo)

                      }
                      else {
                        // that means, there's no update that happened on any rows
                        res.status(201).json("Failed to ban that Event")
                      }

                    }
                    catch (error) {
                      yell(error)
                    }
                    /******************************************************************************************/
                  }


                }
              }

              // show in the terminal the company that have been deleted with his data before he got the ban
              whisp("Company Banned successfuly:", foundCompany.dataValues)

              // send to the admin, the new data that have been added to database
              res.status(201).json(savedBannedCompany_Mongo)

            }
            else {
              // that means, there's no update that happened on any rows
              res.status(201).json("Failed to ban that User")
            }
          }
          else {
            // if the Company has not been saved into the "Banned Companies list" (inside the database of Mongo)
            // we inform the admin that, the operation of adding the company to the banned list is a failure
            res.status(500).json("Failed to add that company to the banned list, please try again")
          }
        }
        else {
          // if the Company is already inside the database of Mongo, which means, he's already banned
          res.status(404).json("That company is already banned")
        }
      }
      else {
        // if the requested user is not found inside the databse

        // that means:
        // 1) he's not registered yet
        // 2) or he have been hard deleted
        // 3) or the given companyId is wrong

        // in this case, we inform the admin that, the requested user is not found
        res.status(404).json("The Requested Company is Not Found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },


  // http://localhost:3000/admins/events
  getAllEvents: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) all events")

    try {
      // find all non banned event from MySQL database
      foundEvents_MySQL = (await event.findAll()).sort((a,b)=> a.eventID - b.eventID)

      // if we got a non empty list of users
      if(foundEvents_MySQL.length){

        // we suppose that all event are not banned
        All_Events = unSequelize(foundEvents_MySQL).map(event =>{
            event.status = "Active"
            return event
          })
        // we must get the list of the banned users from Mongo
        const foundBannedEvents_Mongo = (await BannedEvent.find()).sort((a,b) =>{
          return JSON.parse(a.eventInfo).eventID - JSON.parse(b.eventInfo).eventID
        })

        // if we got a non empty list of banned user from Mongo
        if(foundBannedEvents_Mongo.length){
          /*****************************************************************************************************/
          // here I'm going to merge 2 list of event that I got from 2 different databases:
          // list of all events (banned & non banned one) from MySQL
          // list of banned events from Mongo

          // we go through the list of banned events & we update their status into All_Events array
          let j= 0
          for(let i = 0; i < foundBannedEvents_Mongo.length; i++){

            let bannedEvent = JSON.parse(foundBannedEvents_Mongo[i].eventInfo)
            bannedEvent["status"] = "Banned"

            while(All_Events[j].eventID !== bannedEvent.eventID){ j++ }

            // we update the current banned event with a non-deleted data from Mongo, but with status = "Banned"
            All_Events[j] = bannedEvent

          }

          res.status(200).json(All_Events)
          /*****************************************************************************************************/
        }
        else {
          // we got an empty list of banned events from Mongo
          // then we send the list of event that we got from MySQL database
          res.status(200).json(All_Events)
        }

      }
      else {
        res.status(404).json("There requested events are not found")
      }
    } catch (error) {
      yell(error);
      res.status(500).json("(500) Internal Server Error")
    }
  },


  getSpecificEvent: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) a specific event")

    const { eventID } = req.params

    try {
      foundEvent_MySQL = unSequelize(await event.findOne({ where: { eventID } }))

      // if we found the requested event from our MySQL databse
      if(foundEvent_MySQL){

        // we check into Mongo database if the event is banned
        const foundBannedEvent_Mongo = await BannedEvent.findOne({ eventID })

        // if the requested event is found inside the banned events list (inside the Mongo database)
        if(foundBannedEvent_Mongo){

          // we need to parse the stringified data from the event data that we got from Mongo's database
          const bannedEvent = JSON.parse(foundBannedEvent_Mongo.eventInfo)

          // we specify the actual status of the event: "Banned"
          bannedEvent.status = "Banned"

          // we send the requested data to the admin
          res.status(200).json(bannedEvent)

        }
        else {
          // if the requested event is not banned:

          // we add status "Active" before we send the response to the Admin
          foundEvent_MySQL.status = "Active"

          // we send to the admin the found event with his status (banned or active)
          res.status(200).json(foundEvent_MySQL)

        }
      }
      else {
        // if the specified user is not found, tell the admin that the requested event is not found
        res.status(404).json("There requested event is not found")
      }
    } catch (error) {
      console.log(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },



  // http://localhost:3000/admins/events/${eventID}    (PUT REQUEST)
  updateSpecificEvent: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must update (PUT REQUEST) a specific event")

    // get with destructuring, only the eventID, to search the event to update or to unban
    const { eventID } = req.params

    // the unbanEvent constant, should be boolean (until the further order ...)
    const { unbanEvent } = req.body

    // if the concerning request is related to unban event, then we grab data from MongoDB, then we save it into MySQL database
    if(unbanEvent){

      // get the banned event from MySQL database, by ID
      const foundBannedEvent_MYSQL =  await event.findOne({ where: { eventID }})

      // check if the event is really inside the MySQL database
      if(foundBannedEvent_MYSQL){

        // get the banned event from the "Banned Events List" (from Mongo database)
        const foundBannedEvent_Mongo = await BannedEvent.findOne({ eventID })

        // if the event is inside "Banned Events List" (from Mongo database)
        if(foundBannedEvent_Mongo){

          // we parse his eventInfo, into a constant:
          const unbannedEvent = JSON.parse(foundBannedEvent_Mongo.eventInfo)

          // we update the parsed data, of the unbanned event, into MySQL database
          const savedUnbannedEvent = await event.update( unbannedEvent, { where: { eventID }})

          // if at least one row have been updated
          if(savedUnbannedEvent[0]){

            // delete the unbanned event from the "Banned Events List" (from Mongo database)
            const removedBannedEvent_Mongo = await BannedEvent.findByIdAndRemove({ _id: foundBannedEvent_Mongo._id })

            // if the unbanned event have been successfully removed from the "Banned Events List"
            if(removedBannedEvent_Mongo) {

              // since there's no way to get the updated data with my sequelize, we have to do fetch data again
              const foundUnbannedEvent_MYSQL = unSequelize(await event.findOne({ where: { eventID } }))

              // we specify the Unbanned Event as "Active"
              foundUnbannedEvent_MYSQL.status = "Active"

              // send to the admin the data that have been updated into the MySQL database
              res.status(201).json(foundUnbannedEvent_MYSQL)
            }
            else {
              // if the data has not been successfully removed from the "Banned Events List " (from the Mongo database)
              res.status(500).json("(500) Internal Server Error")
            }
          }
        }
        else {
          // if the event is not found inside the "Banned Events List"
          // we must inform the admin, the operation of unban is failure
          res.status(404).json("Unban operation failed: That event have not been banned yet")
        }
      }
      else {
        // if the requested event (to unban), is not inside the database of MySQL

        // that means:
        // 1) he's not registered
        // 2) hard deleted

        // There's no Event found with the given ID (inside the MySQL database)
        res.status(404).json("The requested event is not found")
      }
    }
    else {
      // If unbanEvent === undefined or falsy:
      // The admin want to just modify a specific data, or all data of a specific registered event, with the given eventID

      // the secure way to get a specific data from the body
      const { eventName, location, date_time, nbrWaiter, nbrChef, nbrCleaningWorker, duration, dailyPay, nbWorkers, imageUri, companyId, companyCompanyId } = req.body

      // we don't want to polluate the content of the constant with the req.body, we only need the following data:
      const newEvent = { eventName, location, date_time, nbrWaiter, nbrChef, nbrCleaningWorker, duration, dailyPay, nbWorkers, imageUri, companyId, companyCompanyId, updatedAt: Date() }

      try {
        // we must check first, if the event exists in our database & get its eventID to check if it's banned or not (inside Mongo database)
        const foundEvent_MySQL = unSequelize(await event.findOne({ where: { eventID } }))

        // we must check if the requested event is found inside the MySQL database
        if(foundEvent_MySQL){

          // we check if the event is inside the the "Banned Events List" (inside Mongo database)
          const foundBannedEvent_Mongo = await BannedEvent.findOne({ eventID })

          // if the requested event is found inside the "Banned Events List" (inside Mongo database)
          if(foundBannedEvent_Mongo){

            // we parse his eventInfo from Mongo, we modify it, then we update it back into Mongo database (Banned Event List)
            const { _id, eventInfo } = foundBannedEvent_Mongo

            // we parse the eventInfo from
            const bannedEventAccountInfo = JSON.parse(eventInfo)

            // for each non-undefined attibute, we update it into our database
            for(attribute in newEvent){

              // if the value of the attibute is defined (empty string, or even zero, are accepted)
              if(newEvent[attribute] !== undefined){

                // we override the newest value that we got from the fron-end into the data that we got from the database
                bannedEventAccountInfo[attribute] = newEvent[attribute]
              }
            }

            // we stringify the updated data before we save it into the database
            newData = {eventInfo : JSON.stringify(bannedEventAccountInfo)}

            // we only update the account info of the banned event, directly into our "Banned Events List" (inside Mongo database)
            const updatedBannedEvent_Mongo = await BannedEvent.findByIdAndUpdate(_id, newData , {new: true})

            // we only parse the updated account info after modification, in order to send it (without the password) to the admin
            const bannedEvent = JSON.parse(updatedBannedEvent_Mongo.eventInfo)

            // we must not include the password into the data that will be sent to the admin
            delete bannedEvent.password

            // we specify the status of the banned event to : "Banned"
            bannedEvent.status = "Banned"

            res.status(201).json(bannedEvent)
          }
          else {
            // if the requested event is not found inside the "Banned Events List" (inside Mongo database):
            // we update the data of the non-banned Event inside the MySQL database
            const updatedEvent_MySQL = await event.update( newEvent, { where: { eventID }})

            // if there's at least 1 row that have been modified
            if(updatedEvent_MySQL.length){

              // we must get the new
              const foundEvent_MySQL = unSequelize(await event.findOne({ where: { eventID }}))

              // we specify the event's status as "Active"
              foundEvent_MySQL.status = "Active"

              // we send back the modified version of the Event
              res.status(201).json(foundEvent_MySQL)

            }
            else { // this part will never be executed (even in case if we don't provide the new data to update)
              // if there's no updates

              // no need to get the new data from the MySQL database, we only send the data that we already got previously
              // we must inform the admin that, there's no modification that have been done on the actual event
              res.status(200).json("Nothing have been updated")

            }
          }
        } else {
          // if the requested event is not found inside the database of MySQL
          res.status(404).json("The requested Event is not found")
        }

        // <<<<<<<<<<<<<<<<<<<<<<<

      } catch (error) {
        yell(error)
        res.status(500).json("(500) Internal Server Error")
      }
    }
  },



  // http://localhost:3000/admin/events/${eventID}     (DELETE REQUEST)
  deleteSpecificEvent: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must delete (DELETE REQUEST) a specific event")

    const { eventID } = req.params

    try {
      // find inside the MySQL database, if there's a event with the given eventID to ban
      foundEvent = await event.findOne({ where: { eventID }})

      // if the requested event is inside the database of MySQL, that means he's not banned
      if(foundEvent){

        // we parse the event to update it from the data that we got from the front-end
        const eventInfo = JSON.stringify(foundEvent.dataValues)

        // we create a new data structure for the Event to ban
        newBannedEvent = { eventID, eventInfo }

        // Check if the specific event is already added to "Banned Events List", inside the database of Mongo
        foundBannedEvent_Mongo = await BannedEvent.findOne({ eventID })

        // if there's no banned event inside the database of Mongo, then save it
        if(!foundBannedEvent_Mongo){

          // we save the banned event into the database
          savedBannedEvent_Mongo = await BannedEvent.create(newBannedEvent)

          // check if the event has been added to banned list inside the Mongo database
          if(savedBannedEvent_Mongo) {

            // show into the terminal the given message
            whisp("Added the event to \"banned event list\"")

            // <<<<<<<<<<<<<<
            // we create a new data for the banned event to save into the database of MySQL
            const bannedEvent_MYSQL = {}

            // override every attribute with an emptyString, except for the email & id
            for(attribute in foundEvent.dataValues){

              // if the attribute is not an eventID
              if(!["eventID","companyCompanyId"].includes(attribute)){

                // Note: we cannot save a string value into a field which accept only number, and vice-versa !!!!!!!!!!!!!!

                // if the type of the field (or the row) is a string
                if(typeof foundEvent.dataValues[attribute] === "string"){

                  // then the new value will be an empty String
                  bannedEvent_MYSQL[attribute] = ""

                }
                else if (typeof foundEvent.dataValues[attribute] === "number"){

                  // if the type of the field (or the row) is a number
                  // then the new value will be 0
                  bannedEvent_MYSQL[attribute] = 0

                }
                else if (foundEvent.dataValues[attribute] === null ){

                  // if the type of the field (or the row) is an object (null or a date / time / DateTime)
                  // then save it, as it is
                  bannedEvent_MYSQL[attribute] = foundEvent.dataValues[attribute]
                }
              }
              else {

                // else, we save his eventID and his id into the database (we don't need to modify the id)
                bannedEvent_MYSQL[attribute] = foundEvent.dataValues[attribute]
              }
            }

            // after creating new value to overide those of the event inside the MySQL databse
            // we update the data of the freshly banned event into the database of MySQL
            const savedBannedEvent_MYSQL = await event.update(bannedEvent_MYSQL, { where: { eventID }})

            // if at least one row have been updated
            if(savedBannedEvent_MYSQL[0]){

              // show in the terminal the event that have been deleted with his data before he got the ban
              whisp("Event Banned successfuly:", foundEvent.dataValues)

              // send to the admin, the new data that have been added to database
              res.status(201).json(savedBannedEvent_Mongo)

            }
            else {
              // that means, there's no update that happened on any rows
              res.status(201).json("Failed to ban that User")
            }
          }
          else {
            // if the Event has not been saved into the "Banned Events list" (inside the database of Mongo)
            // we inform the admin that, the operation of adding the event to the banned list is a failure
            res.status(500).json("Failed to add that event to the banned list, please try again")
          }
        }
        else {
          // if the Event is already inside the database of Mongo, which means, he's already banned
          res.status(404).json("That event is already banned")
        }
      }
      else {
        // if the requested event is not found inside the databse

        // that means:
        // 1) he's not registered yet
        // 2) or he have been hard deleted
        // 3) or the given eventID is wrong

        // in this case, we inform the admin that, the requested event is not found
        res.status(404).json("The Requested Event is Not Found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json("(500) Internal Server Error")
    }
  },

}
