var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");

// var db = require("../dbconfig.js")
var { worker } = require("../dbconfig.js");
// router.route("/worker")

// localhost:3000/worker/signup/
router.post("/signup", async (req, res) => {
  try {
    const newWorker = req.body;
    newWorker.password = await bcrypt.hash(newWorker.password, 10);

    const verif = await worker.findOne({ where: { Email: req.body.Email } });
    if (verif) {
      res.send("user exists");
    }
    const flag = await worker.create(newWorker);
    res.send("success");
  } catch (err) {}
});
router.post("/login", async (req, res) => {
   
  try {
    const authworker = req.body;
    authworker.Email = authworker.Email.toLowerCase();
    const exist = await worker.findOne({ where: { Email: authworker.Email } });
    if (exist) {
      try {
        const success = await bcrypt.compare(
          authworker.password,
          exist.password
        );
        if (success) {
          res.json({
            id: exist.workerId,
            firstName: exist.firstName,
            lastName: exist.lastName,
          });
        } else {
          res.json("false");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json("false");
    }
  } catch (err) {
    console.log(err);
  }
});

const WorkerController = require("../controllers/worker");
var { company, subscription, worker, sequelize } = require("../dbconfig");
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/worker/${userId}/availability
router.get("/profile/:id", async (req, res) => {
  const profile = await worker.findOne({ where: { workerId: req.params.id } });
  res.send(profile);
});
router.put("/:workerId/availability", WorkerController.setAvailability);

router.get("/", async (req, res) => {
  const workers = await worker.findAll({});
  res.send(workers);
});

module.exports = router;
