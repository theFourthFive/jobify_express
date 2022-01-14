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

// localhost:3000/worker/signup/
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
  try {
    const profile = await worker.findOne({
      where: { workerId: req.params.id },
    });
    console.log(profile);
    res.json(profile);
  } catch (err) {
    console.log(err);
  }
});


router.get("/", async (req, res) => {
  const workers = await worker.findAll({});
  res.send(workers);
});

router.post("/updateprofile/:id", async (req, res) => {
  // const updateprofile = await worker.findOne({where:{workerId : req.params.id}})
  // res.send()
});

module.exports = router;
