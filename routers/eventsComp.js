var express = require("express");
var router = express.Router();
var { company, event, sequelize } = require("../dbconfig");

//  /events/getby company id..
router.get("/events/:id", async (req, res) => {
  const events = await event.findAll({where:{companyCompanyId:req.params.id}});
  res.send(events);
});
router.delete("/events/deleted/:id/:event", async (req, res) => {
  console.log("weslet ya aziz");
  try {
    const theEventID = req.params.company;
    const thecompanyId = req.params.event;
    console.log({ theEventID, thecompanyId });
    const flag = await event.destroy({
      where: { theEventID, thecompanyId },
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
