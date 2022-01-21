const { log } = require("console");
var express = require("express");
var router = express.Router();
var {company, accepted_Profile ,event, subscription ,worker,feedback,sequelize}  = require("../../dbconfig");
const { route } = require("../auth-routes");
const bcrypt = require("bcrypt");

router.post("/signup", async (req,res)=>{
  console.log(req.body , "==========>");
   let {firstName} = req.body
   let {lastName}=req.body
   let {email}=req.body
   let {password}=req.body
   let {phoneNumber}=req.body
   const newCompany = {label : firstName , Bussinessfield : lastName , phoneNumber : phoneNumber , Email : email , password : password}
   console.log(newCompany);
   
  try {

    newCompany.password = await bcrypt.hash(newCompany.password, 10);
    console.log(newCompany)
    const verif = await company.findOne({ where: { Email: newCompany.Email } });
    if (verif) {
      res.send("user exists");
    }
    const flag = await company.create(newCompany);
    console.log(flag, "<=========================");
    res.send("success");
  } catch (err) {
      console.log("SIGN UP ERR" , err);
  }

})


router.post("/login", async (req, res) => {

  try {
    const authCompanie = req.body;
    authCompanie.email_or_PhoneNumber = authCompanie.email_or_PhoneNumber.toLowerCase();
  
    const exist = await company.findOne({ where: { Email: authCompanie.email_or_PhoneNumber } });
    if (exist) {
      try {
        const success = await bcrypt.compare(
      
          authCompanie.password,
          exist.password
        );
   
        if (success) {
          res.json({
            id: exist.companyId,
            firstName: exist.Bussinessfield,
            lastName: exist.label
          });
        } else {
          res.json("false");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json("false");
    }
  } catch (err) {
    console.log(err);
  }
});


module.exports = router;
