const express = require("express");
const employeeController = require("../controllers/employeeController");

const authAndPermission = require("../middleware/authJwtAndPermission");
const router = express.Router();

// Create a new employee
router.post(
  "/employees/add",
  authAndPermission("create_employee"),
  employeeController.createEmployee
);
router.post(
  "/employees/add",
  authAndPermission("create"),
  employeeController.createEmployee
);
// Get all employees
router.get(
  "/employees",
  authAndPermission("viewall"), // Ensure user has read permission
  employeeController.getAllEmployees
);

// Get a single employee by ID
router.get(
  "/employees/:employeeId",
  authAndPermission("view"), // Ensure user has read permission
  employeeController.getEmployeeProfile
);

// Update an employee
router.put(
  "/employees/:employeeId",
  authAndPermission("update_employee"), // Ensure user has update permission
  employeeController.updateEmployee
);

// Delete an employee
router.delete(
  "/employees/:employeeId",
  authAndPermission("delete_employee"), // Ensure user has delete permission
  employeeController.deleteEmployee
);

module.exports = router;
