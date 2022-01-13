var express = require("express");

var router = express.Router()
var {event} = require("../dbconfig")
var {subscription}  = require("../dbconfig")
var {company , subscription ,worker , sequelize}  = require("../dbconfig")


//  /events/getall..
router.get("/",async(req,res)=>{
 const events = await event.findAll({})
 res.send(events)      
})

router.get("/worker/:id", async(req,res)=>{
 console.log(req.params);
 var x = subscription.create()
 console.log(subs);
 res.send(subs)
})

.post("/subscribe" , async(req,res)=>{
   event.destroy({where:{eventID : req.body.eventID}})
})
module.exports = router