const express = require("express");
const router = express.Router();
const JobController = require("../controllers/job-controller");

const authAndPermission = require("../middleware/authJwtAndPermission");

router.post("/job/post", authAndPermission("create"), JobController.postJob);

router.get("/job/list", authAndPermission("viewall"), JobController.viewJobs);

router.put(
  "/job/update/:id",
  authAndPermission("update"),
  JobController.updateJob
);

router.delete(
  "/job/delete/:id",
  authAndPermission("delete"),
  JobController.deleteJob
);

module.exports = router;
