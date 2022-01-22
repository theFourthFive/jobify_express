const { log } = require("console");
var express = require("express");
var router = express.Router();
var {company, accepted_Profile ,event, subscription ,worker ,feedback,sequelize}  = require("../../dbconfig");
const { route } = require("../auth-routes");


router.get("/events/:id" ,async (req, res) => {
    console.log(req.params.id);
    try{
        const events = await event.findAll({where: {companyCompanyId: req.params.id}})
        res.send(events)
    }
    catch(err){
        console.log(err);
    }
});

router.get("/workers/:id" ,async (req , res)=>{
try

{   const eventid = req.params.id
    const workers  = await sequelize.query(`SELECT s.workerId , s.firstName ,s.LastName , s.Email , s.phoneNumber,s.imageUrl ,s.CVUrl ,s.availibility , s.createdAt  FROM workers s , accepted_Profiles acc WHERE s.workerId = acc.workerWorkerId AND acc.eventEventID = ${eventid}`)
    res.send(workers)
}
catch(err)
   {  
       console.log(err);
   }


})

router.get("/subscribers/:id" ,async (req , res)=>{
    try
    
    {   const eventid = req.params.id
        const workers  = await sequelize.query(`SELECT w.firstName , w.workerId , w.firstName , w.LastName , w.Email , w.phoneNumber, w.imageUrl ,w.CVUrl , w.availibility , w.avgRating , w.createdAt FROM workers w , subscriptions s WHERE w.workerId = s.workerWorkerId AND s.eventEventID=${eventid}`)
        res.send(workers)
    }
    catch(err)
       {  
           console.log(err);
       }
    
    
    })

router.post("/rate/:companyId/:workerId" , async (req, res) => {
 const {companyId} = req.params
 const {workerId}=req.params
 const feed = req.body.feedback
 const {rate}=req.body
 data = { companyCompanyId : companyId , workerWorkerId  : workerId , text : feed , rate : rate }
try{
const result = await feedback.create(data)
}catch(err){
console.log(err)
}
})

router.post("/hire/:eventID/:workerId" , async (req, res) => {
const {workerId} = req.params
const {eventID}  = req.params
console.log({workerId , eventID});
 try{
     await subscription.destroy({where : {workerWorkerId :workerId , eventEventID : eventID}})
     await accepted_Profile.create({eventEventID : eventID , workerWorkerId : workerId})
    }
    catch(err)
    {
    console.log(err);
    }
})


router.post("/deny/:eventID/:workerId" , async (req, res) => {
    console.log("hello");
    const {workerId} = req.params
    const {eventID}  = req.params
    console.log({workerId , eventID});
     try{
         await subscription.destroy({where : {workerWorkerId :workerId , eventEventID : eventID}})
        }
        catch(err)
        {
        console.log(err);
        }
    })


module.exports = router;
