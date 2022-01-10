const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/worker");
var {company , subscription ,worker , sequelize}  = require("../dbconfig")
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/worker/${userId}/availability
router.get("/profile/:id" , async(req,res)=>{
    const profile = await worker.findOne({where:{workerId : req.params.id}}) 
    res.send(profile)
})
router.put("/:workerId/availability", WorkerController.setAvailability);
module.exports = router;
