var express = require("express");
var router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var db = require("../dbconfig.js")
var worker = require('../dbconfig.js')
router.route("/worker")

// localhost:3000/worker/signup/

router.post("/signup",(req,res)=>{
    worker.findOne({ where: {Email: req.body.Email} }).then(result =>{
        if(result){
            res.send('user exists')

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
router.post("/login",(req,res)=>{
    // console.log(req.body)
    worker.findOne({ where: {Email: req.body.Email} }).then(ok =>{
        if(!ok){
            console.log("useremail wrong")
            console.log(ok)
        }else{
            // console.log(result)
            bcrypt.compare(req.body.password, ok.dataValues.password, function(err, response) {
                console.log(ok.dataValues.password)
                if(err){
                    console.log(err)
                    console.log("password is wrong")
                }else{
                    // console.log(response)
                    console.log("password correct")
                    res.send(ok)
                }
              })}
    })
})

const WorkerController = require("../controllers/worker");
var {company , subscription ,worker , sequelize}  = require("../dbconfig")
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/worker/${userId}/availability
router.get("/profile/:id" , async(req,res)=>{
    const profile = await worker.findOne({where:{workerId : req.params.id}}) 
    res.send(profile)
})
router.put("/:workerId/availability", WorkerController.setAvailability);

router.get("/" , async(req,res)=>{

    const workers = await worker.findAll({})
    res.send(workers)

})

module.exports = router



