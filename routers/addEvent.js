var express = require("express");
var router = express.Router();
var {event} = require("../dbconfig");

router.route("/").post((req, res) => {
  console.log(" wsel lel server");
  event.create(req.body);
});
module.exports = router;
