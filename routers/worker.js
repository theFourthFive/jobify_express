const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/worker");
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/worker/${userId}/availability
router.put("/:workerId/availability", WorkerController.setAvailability);
module.exports = router;
