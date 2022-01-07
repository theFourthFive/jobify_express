var express = require("express");
var router = express.Router()
var event = require("../dbconfig")

router.route("/")
.post((req,res)=>{
 
 
   console.log(req.body)
    event.create(req.body)
        
})
module.exports = router