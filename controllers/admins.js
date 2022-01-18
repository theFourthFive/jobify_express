const { worker, company } = require("../dbconfig.js");
var Admin = require("../models/Admin");
var BannedWorker = require("../models/BannedWorker");
const { unSequelize } = require("../helpers/unSequelize");
const { whisp, yell, ignore } = require("../helpers/whisper");

// prettier-ignore
module.exports = {

  // Note: I (Achraf), need this function to check the list of all admin easily

  // http://localhost:3000/admins/ (GET REQUEST)
  findAllAdmin: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must get (GET REQUEST) all workers (for testing purpose)")

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
    whisp("I (Admin) must get (GET REQUEST) all workers (for testing purpose)")

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
      } else {
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
      } else {
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
      foundWorkers = await worker.findAll()
      if(foundWorkers.length){
        res.status(200).json(unSequelize(foundWorkers))
      } else {
        res.status(404).json("There's no found user")
      }
    } catch (error) {
      res.status(500).json("(500) Internal Server Error")
    }
  },


  // http://localhost:3000/admins/worker/${workerId}   (GET REQUEST)
  getSpecificWorker: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Admin) must see (GET REQUEST) a specific worker")

    const { workerId } = req.params

    try {
      foundWorkers = await worker.findOne({ where: { workerId } })
      if(foundWorkers){
        res.status(200).json(unSequelize(foundWorkers))
      } else {
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

    // if the concerning request is related to unban user, then we grab data from mongoDB, then we save it into MySQL database
    if(unbanWorker){

      // get the banned user from MySQL database, by ID
      const foundBannedWorker_MYSQL =  await worker.findOne({ where: { workerId }})


      // check if the worker is really inside the MySQL database
      if(foundBannedWorker_MYSQL){

        // we get the email of the banned worker from MySQL, in order to make a search of banned worker, inside the banned worker list, inside Mongo Database
        const email = unSequelize(foundBannedWorker_MYSQL).Email

        // get the banned user from the mongo database, by email
        const foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if the user is inside the list of banned worker (inside the databse of mongo)
        if(foundBannedWorker_Mongo){

          // we parse his accountInfo, into a constant:
          const unbannedWoker = JSON.parse(foundBannedWorker_Mongo.accountInfo)

          // we update the parsed data, of the unbanned user, into MySQL database
          const savedUnbannedWorker = await worker.update( unbannedWoker, { where: { workerId }})

          // if at least one row have been updated
          if(savedUnbannedWorker[0]){

            // delete the unbanned worker from the "worker banned list" (from mongo database)
            const removedBannedWorker_Mongo = await BannedWorker.findByIdAndRemove({ _id: foundBannedWorker_Mongo._id })

            // if the unbanned worker have been successfully removed from the "worker banned list"
            if(removedBannedWorker_Mongo) {

              // since there's no way to get the updated data with my sequelize, we have to do fetch data again
              const foundUnbannedWorker_MYSQL = await worker.findOne({ where: { workerId } })

              // send to the admin the data that have been updated into the MySQL database
              res.status(201).json(unSequelize(foundUnbannedWorker_MYSQL))
            }
            else {
              // if the data has not been successfully removed from the "worker banned list " (from the mongo database)
              res.status(500).json("(500) Internal Server Error")
            }
          }
        }
        else {
          // if the worker is not found inside the "Workers banned list"
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
      // IF unbanWorker === undefined or falsy:
      // The admin want to just modify a specific data, or all data of a specific registered worker, with the given workerId

      // the secure way to get a specific data from the body
      const { firstName, LastName, phoneNumber, imageUrl, CVUrl, availibility, avgRating } = req.body

      // we don't want to polluate the content of the constant with the req.body, we only need the following data:
      const newWorker = { firstName, LastName, phoneNumber, imageUrl, CVUrl, availibility, avgRating, updatedAt: Date() }

      try {
        const updatedWorker = await worker.update( newWorker, { where: { workerId }})
        foundWorker = await worker.findOne({ where: { workerId }})
        res.status(201).json(unSequelize(foundWorker))
        // if()
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

        // we save the worker to ban into the mongo database, with his email, & accountInfo that contains all the info, including his email too
        const email = foundWorker.dataValues.Email // no destructuring here, becasue the name of the attribute is supposed to be lowercase
        const accountInfo = JSON.stringify(foundWorker.dataValues)

        // we create a new data structure for the Worker to ban
        newBannedWorker = { email, accountInfo }

        // Check if the specific worker is already added to banned workers list, inside the database of mongo
        foundBannedWorker_Mongo = await BannedWorker.findOne({ email })

        // if there's no banned user inside the database of mongo, then save it
        if(!foundBannedWorker_Mongo){

          // we save the banned worker into the database
          savedBannedWorker_Mongo = await BannedWorker.create(newBannedWorker)

          // check if the worker has been added to banned list inside the mongo database
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

                } else if (typeof foundWorker.dataValues[attribute] === "number"){

                  // if the type of the field (or the row) is a number
                  // then the new value will be 0
                  bannedWorker_MYSQL[attribute] = 0

                } else if (foundWorker.dataValues[attribute] === null ){

                  // if the type of the field (or the row) is an object (null or a date / time / DateTime)
                  // then save it, as it is
                  bannedWorker_MYSQL[attribute] = foundWorker.dataValues[attribute]
                }
              } else {

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

            } else {
              // that means, there's no update that happened on any rows
              res.status(201).json("Failed to ban that User")
            }
          }
          else {
            // if the Worker has not been saved into the Banned Worker list (inside the database of mongo)
            // we inform the admin that, the operation of adding the worker to the banned list is a failure
            res.status(500).json("Failed to add that worker to the banned list, please try again")
          }
        }
        else {
          // if the Worker is already inside the database of mongo, which means, he's already banned
          res.status(404).json("That worker is already banned")
        }
      } else {
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


  getAllCompanies: async (req, res, next) => {
    //
  },


  getSpecificCompany: async (req, res, next) => {
    //
  },


  updateSpecificCompany: async (req, res, next) => {
    //
  },


  deleteSpecificCompany: async (req, res, next) => {
    //
  },

}
