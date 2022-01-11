const express = require("express");
const router = express.Router();
const WorkerController = require("../controllers/workers");

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/worker/
The endpoint of a put request (update): // http://localhost:3000/worker/
The endpoint of a delete request (delete): // http://localhost:3000/worker/
*******************************************************************************************************/
// prettier-ignore
router.route("/")
          .get(WorkerController.findAllWorkers) // this method is only used by company

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/worker/${userId}/
The endpoint of a put request (update): // http://localhost:3000/worker/${userId}/
The endpoint of a delete request (delete): // http://localhost:3000/worker/${userId}/
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/")
          .get(WorkerController.getProfile) // load a worker profile
          .put(WorkerController.updateProfile) // update or disable account
          .delete(WorkerController.removeMyAccount) // only workers can remove their own account

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/worker/${userId}/availability
endpoint of a put request (update): // http://localhost:3000/worker/${userId}/availability
endpoint of a delete request (delete): // http://localhost:3000/worker/${userId}/availability
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/availability")
          .get(WorkerController.getAvailability)
          .put(WorkerController.setAvailability)
          .delete(WorkerController.resetAvailability)

module.exports = router;
