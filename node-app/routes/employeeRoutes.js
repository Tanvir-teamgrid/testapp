const express = require("express");
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authJwt");
const checkRoleAndPermission = require("../middleware/checkRoleAndPermission");
const router = express.Router();

router.post(
  "/employees/add",
  authMiddleware(), // Add this middleware to authenticate the user
  checkRoleAndPermission("create"), // Check if the user has the right permission
  employeeController.createEmployee
);

module.exports = router;
