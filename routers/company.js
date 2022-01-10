var express = require("express");
var router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
// var db = require("../dbconfig.js")
var worker = require('../dbconfig.js')
router.route("/company")

// localhost:3000/worker/signup/

router.post("/signup",(req,res)=>{
    worker.findOne({ where: {Email: req.body.Email} }).then(result =>{
        if(result){
            res.json('user exists')
            console.log('user exists')
            console.log('..............................',result)
            // console.log(result.length)
        }else{
            console.log("/////////////",req.body)
            bcrypt.hash(req.body.passWord, saltRounds, function(err, hash) {
            worker.create({ Bussinessfield:req.body.Bussinessfield, label:req.body.label, Email:req.body.Email, passWord: hash, phoneNumber:req.body.phoneNumber },(err,data)=>{
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
            bcrypt.compare(req.body.passWord, ok.dataValues.passWord, function(err, response) {
                console.log(ok.dataValues.passWord)
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


module.exports = router