var express = require("express");

var router = express.Router()
var {event , subscription} = require("../dbconfig")

var {company,hiringOffer,accepted_Profile ,event, subscription ,worker , sequelize}  = require("../dbconfig")


//  /events/getall..
router.get("/", async (req, res) => {
  const events = await event.findAll({});
  res.send(events);
});
console.log("hahahahahahahhahah");
router
  .get("/worker/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const notSubscribedEvents =
        await sequelize.query(`SELECT * from events e , companies c WHERE c.companyId=e.companyCompanyId AND e.eventID NOT in (SELECT e.eventID   
   FROM workers  w , events e , subscriptions s
   WHERE w.workerId = s.workerWorkerId AND s.eventEventID = e.eventID AND w.workerId = ${id} );`)
 res.send(notSubscribedEvents); 

}
catch (err){

}
})


router
  .get("/offers/:id", async (req, res) => {
    const id = req.params.id;
  
    try {
    const result = await sequelize.query(`SELECT * FROM hiringOffers h , events e , companies c WHERE h.companyCompanyId = c.companyId AND h.eventEventID = e.eventID AND h.workerWorkerId = ${id} `)
      console.log(result);
    res.send(result);
}
catch (err){

}
})

router
  .post("/offers/accept/:user/:event/:company", async(req, res) => {
 const {company , event , user} = req.params;   

try {
  await hiringOffer.destroy({where:{companyCompanyId : company , workerWorkerId : user , eventEventID : event}}) 
  await accepted_Profile.create({eventEventID : event , workerWorkerId : user})  
}
catch (err){

}
})

router
  .post("/offers/deny/:user/:event/:company", async(req, res) => {
 const {company , event , user} = req.params;   

try {
  await hiringOffer.destroy({where:{companyCompanyId : company , workerWorkerId : user , eventEventID : event}}) 
}
catch (err){

}
})


router.get("/worker/history/:id", async(req,res)=>{

  const id = req.params.id;
 try {
sequelize.query(`SELECT e.eventID,e.eventName,e.location , e.imageUri ,e.createdAt ,e.dailyPay ,c.label,c.Bussinessfield,c.phoneNumber AS cphonenumber , c.imageUrl FROM events e , companies c WHERE (e.companyCompanyId = c.companyId AND e.eventID IN ( SELECT s.eventEventID FROM subscriptions s WHERE s.workerWorkerId = ${id} ));`)
.then((subscribedEvents)=>{res.send(subscribedEvents);}).catch (err=>console.log(err))

 }
 catch (err){
  console.log(err,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
 }
 })


.post("/subscribe" , async(req,res)=>{
try{
 const {workerId , eventID} = req.body ; 
 const queryRes =  await  subscription.create({workerWorkerId : workerId , eventEventID : eventID , validation : "pending"})
}
catch (err)
{
  console.log(err)
}
})


.delete("/unsubscribe/:user/:event" , async(req,res)=>{
  try{const eventEventID = req.params.user
  const workerWorkerId = req.params.event
  console.log({eventEventID,workerWorkerId})
  const flag = await subscription.destroy({where : {eventEventID,workerWorkerId}})}catch(err){console.log(err)}
})
module.exports = router
