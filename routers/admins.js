const express = require("express");
const router = express.Router();

var { company, subscription, worker, sequelize } = require("../dbconfig");
// const { , checkUser } = require("../middleware/auth");

// http://localhost:3000/admins/${userId}/availability
const AdminsController = require("../controllers/admins");

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/admins/
The endpoint of a put request (update): // http://localhost:3000/admins/
The endpoint of a delete request (delete): // http://localhost:3000/admins/
*******************************************************************************************************/
// prettier-ignore
router.route("/")
          .get(AdminsController.findAllAdmin) // this method is only used by company
          .post(AdminsController.createOneAdmin) // for testing purpose
          .delete(AdminsController.deleteAllAdmins) // I want to delete all the admins (to clean the database quickly)

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/admins/workers
endpoint of a put request (update): // http://localhost:3000/admins/workers
endpoint of a delete request (delete): // http://localhost:3000/admins/workers
*******************************************************************************************************/
// prettier-ignore
router.route("/workers")
          .get(AdminsController.getAllWorkers)

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/admins/workers
endpoint of a put request (update): // http://localhost:3000/admins/workers
endpoint of a delete request (delete): // http://localhost:3000/admins/workers
*******************************************************************************************************/
// prettier-ignore
router.route("/workers/:workerId")
          .get(AdminsController.getSpecificWorker)
          .put(AdminsController.updateSpecificWorker)
          .delete(AdminsController.deleteSpecificWorker)

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/admins/companies
endpoint of a put request (update): // http://localhost:3000/admins/companies
endpoint of a delete request (delete): // http://localhost:3000/admins/companies
*******************************************************************************************************/
// prettier-ignore
router.route("/comapnies")
          .get(AdminsController.getAllCompanies)

/*******************************************************************************************************
endpoint of a get request (get): // http://localhost:3000/admins/comapnies
endpoint of a put request (update): // http://localhost:3000/admins/comapnies
endpoint of a delete request (delete): // http://localhost:3000/admins/comapnies
*******************************************************************************************************/
// prettier-ignore
router.route("/comapnies/:companyId")
          .get(AdminsController.getSpecificCompany)
          .put(AdminsController.updateSpecificCompany) // update informations or, to ban a specific company
          .delete(AdminsController.deleteSpecificCompany)

/*******************************************************************************************************
The endpoint of a get request (get): // http://localhost:3000/admins/${adminId}/
The endpoint of a put request (update): // http://localhost:3000/admins/${adminId}/
The endpoint of a delete request (delete): // http://localhost:3000/admins/${adminId}/
*******************************************************************************************************/
// prettier-ignore
router.route("/:adminId")
          .get(AdminsController.getAdminProfile) // load an admin profile
          .put(AdminsController.updateAdminProfile) // update or disable account
          .delete(AdminsController.removeMyAccount) // only admins can remove their own account

module.exports = router;
