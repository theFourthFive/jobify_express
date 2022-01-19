var express = require("express");
var router = express.Router();
var {company ,event, subscription ,worker , sequelize}  = require("../../dbconfig")


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

router.get("/workers" , (req , res)=>{

    //SELECT * FROM workers s , accepted_Profiles acc  WHERE s.workerId = acc.workerWorkerId AND acc.eventEventID = 73; 

})
module.exports = router;
