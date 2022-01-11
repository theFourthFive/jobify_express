// prettier-ignore
module.exports = {
  findAllWorkers: async(req, res, next) => {
    console.log("I (Company) must get (GET REQUEST) all workers ")
  },
  getProfile: async(req, res, next) => {
    console.log("I must get (GET REQUEST) all workers ")
  },
  updateProfile: async(req, res, next) => {
    console.log("I must get (GET REQUEST) all workers ")
  },
  removeMyAccount: async(req, res, next) => {
    console.log("I must get (GET REQUEST) all workers ")
  },
  getAvailability: async (req, res, next) => {
    //
    res.send("I must get (GET REQUEST) the availabilities of worker")
  },
  setAvailability: async (req, res, next) => {
    //
    console.log(req.body)
    res.send("I must update (PUT REQUEST) the availabilities of worker")
  },
  resetAvailability: async (req, res, next) => {
    //
    console.log(req.body)
    res.send("I must reset (DELETE REQUEST) the availabilities of worker")
  }
}
