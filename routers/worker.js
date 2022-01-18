var express = require("express");
var router = express.Router();
var { company, subscription, worker, sequelize } = require("../dbconfig");
const bcrypt = require("bcrypt");

var { worker } = require("../dbconfig.js");


router.post("/signup", async (req, res) => {
console.log(req.body);
  try {
    const newWorker = req.body;
    newWorker.password = await bcrypt.hash(newWorker.password, 10);

    const verif = await worker.findOne({ where: { Email: req.body.email } });
    if (verif) {
      res.send("user exists");
    }
    const flag = await worker.create(newWorker);
    res.send("success");
  } catch (err) {
      console.log("SIGN UP ERR" , err);
  }
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




router.get("/profile/:id", async (req, res) => {
  const profile = await worker.findOne({ where: { workerId: req.params.id } });
  res.send(profile);
});


router.get("/", async (req, res) => {
  const workers = await worker.findAll({});
  res.send(workers);
});

module.exports = router;
