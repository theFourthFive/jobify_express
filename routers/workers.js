const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;
// var db = require("../dbconfig.js")
var worker = require("../dbconfig.js");
router.route("/worker");

// localhost:3000/worker/signup/

// prettier-ignore
router.post("/signup",(req,res)=>{
    worker.findOne({ where: {Email: req.body.Email} }).then(result =>{
        if(result){
            res.json('user exists')
            console.log('user exists')
            console.log('..............................',result)
            // console.log(result.length)
        }else{
            console.log("/////////////",req.body)
            bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            worker.create({ firstName:req.body.firstName, LastName:req.body.LastName, Email:req.body.Email, password: hash, phoneNumber:req.body.phoneNumber },(err,data)=>{
                if(err){
                    console.log(err)
                }else{
                    res.send("data sent")
                }
            })
        })}
    })
    
})

// prettier-ignore
router.post("/login", (req, res) => {
  // console.log(req.body)
  worker.findOne({ where: { Email: req.body.Email } }).then((ok) => {
    if (!ok) {
      console.log("useremail wrong");
      console.log(ok);
    } else {
      // console.log(result)
      bcrypt.compare(
        req.body.password,
        ok.dataValues.password,
        function (err, response) {
          console.log(ok.dataValues.password);
          if (err) {
            console.log(err);
            console.log("password is wrong");
          } else {
            // console.log(response)
            console.log("password correct");
            res.send(ok);
          }
        }
      );
    }
  });
});

var { company, subscription, worker, sequelize } = require("../dbconfig");
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/workers/profile/${id}
router.get("/profile/:id", async (req, res) => {
  const profile = await worker.findOne({ where: { workerId: req.params.id } });
  res.send(profile);
});

// http://localhost:3000/workers/${userId}/availability
const WorkersController = require("../controllers/workers");

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/workers/
The endpoint of a put request (update): // http://localhost:3000/workers/
The endpoint of a delete request (delete): // http://localhost:3000/workers/
*******************************************************************************************************/
// prettier-ignore
router.route("/")
          .get(WorkersController.findAllWorkers) // this method is only used by company

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/workers/${userId}/
The endpoint of a put request (update): // http://localhost:3000/workers/${userId}/
The endpoint of a delete request (delete): // http://localhost:3000/workers/${userId}/
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/")
          .get(WorkersController.getProfile) // load a worker profile
          .put(WorkersController.updateProfile) // update or disable account
          .delete(WorkersController.removeMyAccount) // only workers can remove their own account

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/workers/${userId}/availability
endpoint of a put request (update): // http://localhost:3000/workers/${userId}/availability
endpoint of a delete request (delete): // http://localhost:3000/workers/${userId}/availability
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/availability")
          .get(WorkersController.getAvailability)
          .put(WorkersController.updateAvailability)
          .delete(WorkersController.resetAvailability)

module.exports = router;
