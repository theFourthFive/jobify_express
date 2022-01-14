const { worker } = require("../dbconfig.js");
const { unSequelize } = require("../helpers/unSequelize");
const { whisp, yell, ignore } = require("../helpers/whisper");

// prettier-ignore
module.exports = {
  findAllWorkers: async (req, res, next) => {
    ignore(next, req)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used
    whisp("I (Company) must get (GET REQUEST) all workers ")

    try {
      const foundWorkers = await worker.findAll()
      unSequelize(foundWorkers)
      res.status(200).json(foundWorkers);
      // res.status(200).json(unSequelize(foundWorkers));
    } catch (error) {
      yell(error)
      res.status(500).json("Don't worry, we are fixing this error right now");
    }
  },


  // http://localhost:3000/workers/${userId}/
  getProfile: async (req, res, next) => {
    ignore(next)  // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used

    const { workerId } = req.params

    try {
      const foundWorker = await worker.findOne({ where: { workerId } })

      if(foundWorker){
        whisp(`I (Company) must get (GET REQUEST) a specific worker`)
        whisp(`I (Worker) must get (GET REQUEST) only my profile info`)
        res.status(200).json(unSequelize(foundWorker));
      } else {
        whisp(`Worker not found`)
        res.status(404).json("The requested worker is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json(error);
    }
  },



  updateProfile: async (req, res, next) => {
    whisp("I must get (GET REQUEST) all workers ")
    ignore(next) // in case where we are using a linter that stop the execution of the server, just because a variable is declared but not used

    const { workerId } = req.params

    try {
      const foundWorker = await worker.findOne({ where: { workerId } })

      if(foundWorker){
        whisp(`I (Company) must get (GET REQUEST) a specific worker`)
        whisp(`I (Worker) must get (GET REQUEST) only my profile info`)
        res.status(200).json(unSequelize(foundWorker));
      } else {
        whisp(`Worker not found`)
        res.status(404).json("The requested worker is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json(error);
    }
  },



  removeMyAccount: async (req, res, next) => {
    console.log("I must get (GET REQUEST) all workers ")
  },


  // http://localhost:3000/workers/${userId}/availability  (GET Request)
  getAvailability: async (req, res, next) => {
    ignore(next)

    const { workerId } = req.params

    try {
      const foundWorker = await worker.findOne({ where: { workerId } })

      if(foundWorker){
        // whisp(`I (Company) must get (GET REQUEST) the availabilities of a specific worker`) // nah ... only worker need it
        whisp(`I (Worker) must get (GET REQUEST) only my availabilities info`)

        // ?? => if falsy (undefined or null), then return an empty string ...
        const availibility = unSequelize(foundWorker).availibility ?? ""
        /************************************** Front-end dance-party here ... *******************************************/
        res.status(200).json([
          { text: "Monday", key: 0, available: availibility.includes("Monday") },
          { text: "Tuesday", key: 1, available: availibility.includes("Tuesday") },
          { text: "Wednesday", key: 2, available: availibility.includes("Wednesday") },
          { text: "Thursday", key: 3, available: availibility.includes("Thursday") },
          { text: "Friday", key: 4, available: availibility.includes("Friday") },
          { text: "Saturday", key: 5, available: availibility.includes("Saturday") },
          { text: "Sunday", key: 6, available: availibility.includes("Sunday") },
        ])

        /*****************************************************************************************************************/
        // res.status(200).json(availibility) // commented this, because I did the front-end inside the back-end
      } else {
        whisp(`Worker not found`)
        res.status(404).json("The requested worker is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json(error);
    }

    whisp("I must get (GET REQUEST) the availabilities of worker")
  },


  /*******************************************************************************************************
   * http://192.168.11.188:3001/workers/11/availability   (PUT REQUEST)
    {
      "availibility": "Monday,Tuesday,Wednesday"
    }
  *******************************************************************************************************/
  // http://localhost:3000/workers/${userId}/availability
  updateAvailability: async (req, res, next) => {
    ignore(next)

    const { workerId } = req.params
    const  { availibility }  = req.body

    try {
      const updatedWorker = await worker.update({ availibility }, { where: { workerId }})
      let foundWorker
      if(updatedWorker[0]){
        foundWorker = await worker.findOne({ where: { workerId }})
      }

      if(foundWorker){
        // whisp(`I (Company) must get (GET REQUEST) the availabilities of a specific worker`) // nah ... only worker need it
        whisp(`I (Worker) must get (GET REQUEST) only my availabilities info`)

        // ?? => if falsy (undefined or null), then return an empty string ...
        const availibility = unSequelize(foundWorker).availibility ?? ""
        res.status(200).json(availibility);
      } else {
        whisp(`Worker not found`)
        res.status(404).json("The requested worker is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json(error);
    }
    whisp("I (Worker) must update (PUT REQUEST) the availabilities of worker")
  },



  resetAvailability: async (req, res, next) => {
    ignore(next)

    const { workerId } = req.params

    try {
      const updatedWorker = await worker.update({ availibility: "" }, { where: { workerId }})
      let foundWorker
      // if the operation of modification is not 0, which mean, at least 1 field have been modified
      if(updatedWorker[0]){

        // we request from the database the newest value of the user
        foundWorker = await worker.findOne({ where: { workerId }})
      }

      // if the worker still exist (not deleted yet ...) then we send to found user (without his hashed password) to the front-end
      if(foundWorker){

        // whisp(`I (Company) must get (GET REQUEST) the availabilities of a specific worker`) // nah ... only worker need it
        whisp(`I (Worker) must get (GET REQUEST) only my availabilities info`)

        // ?? => if falsy (undefined or null), then return an empty string ...
        const availibility = unSequelize(foundWorker).availibility ?? ""

        // send only the availabilities per week (example: "monday")
        res.status(200).json(availibility);
      } else {
        yell(`Worker not found`)
        res.status(404).json("The requested worker is not found")
      }
    } catch (error) {
      yell(error)
      res.status(500).json(error);
    }

    whisp(req.body)
    res.send("I must reset (DELETE REQUEST) the availabilities of worker")
  }
}
