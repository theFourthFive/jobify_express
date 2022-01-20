var express = require("express");
var router = express.Router();
var {event , subscription,feedback} = require("../../dbconfig")


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
module.exports = router;
