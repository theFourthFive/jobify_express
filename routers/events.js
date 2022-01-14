var express = require("express");

var router = express.Router();
var { event } = require("../dbconfig");
var { subscription } = require("../dbconfig");
var { company, subscription, worker, sequelize } = require("../dbconfig");

//  /events/getall..
router.get("/", async (req, res) => {
  const events = await event.findAll({});
  res.send(events);
});

router
  .get("/worker/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const notSubscribedEvents =
        await sequelize.query(`SELECT * from events e , companies c WHERE c.companyId=e.companyCompanyId AND e.eventID NOT in (SELECT e.eventID   
   FROM workers  w , events e , subscriptions s
   WHERE w.workerId = s.workerWorkerId AND s.eventEventID = e.eventID AND w.workerId = ${id} );`);
      res.send(notSubscribedEvents);
    } catch (err) {}
  })

  .post("/subscribe", async (req, res) => {
    console.log("helloo");
  });
module.exports = router;
