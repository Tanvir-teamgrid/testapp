const express = require("express");
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middleware/authJwt");
const checkRoleAndPermission = require("../middleware/checkRoleAndPermission");
const router = express.Router();

// Create a new employee
router.post(
  "/employees/add",
  authMiddleware(),
  checkRoleAndPermission("create"),
  employeeController.createEmployee
);

// Get all employees
router.get(
  "/employees",
  authMiddleware(),
  checkRoleAndPermission("view"), // Ensure user has read permission
  employeeController.getAllEmployees
);

// Get a single employee by ID
router.get(
  "/employees/:employeeId",
  authMiddleware(),
  checkRoleAndPermission("view"), // Ensure user has read permission
  employeeController.getEmployeeProfile
);

// Update an employee
router.put(
  "/employees/:employeeId",
  authMiddleware(),
  checkRoleAndPermission("update"), // Ensure user has update permission
  employeeController.updateEmployee
);

// Delete an employee
router.delete(
  "/employees/:employeeId",
  authMiddleware(),
  checkRoleAndPermission("delete"), // Ensure user has delete permission
  employeeController.deleteEmployee
);

module.exports = router;
