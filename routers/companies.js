const express = require("express");
const router = express.Router();

const CompaniesController = require("../controllers/companies");

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/worker/
The endpoint of a put request (update): // http://localhost:3000/worker/
The endpoint of a delete request (delete): // http://localhost:3000/worker/
*******************************************************************************************************/
// prettier-ignore
router.route("/")
          .get(CompaniesController.findAll) // this method is only used by company

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/worker/${userId}/
The endpoint of a put request (update): // http://localhost:3000/worker/${userId}/
The endpoint of a delete request (delete): // http://localhost:3000/worker/${userId}/
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/")
          .get(CompaniesController.getProfile) // load a worker profile
          .put(CompaniesController.updateProfile) // update or disable account
          .delete(CompaniesController.removeMyAccount) // only workers can remove their own account

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/worker/${userId}/availability
endpoint of a put request (update): // http://localhost:3000/worker/${userId}/availability
endpoint of a delete request (delete): // http://localhost:3000/worker/${userId}/availability
*******************************************************************************************************/
// prettier-ignore
router.route("/:workerId/availability")
          .get(CompaniesController.getAvailability)
          .put(CompaniesController.setAvailability)
          .delete(CompaniesController.resetAvailability)

module.exports = router;
