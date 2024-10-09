const express = require("express");
const EmployeeController = require("../controllers/EmployeeController"); // Adjust the path as needed
const authAndPermission = require("../middleware/authJwtAndPermission"); // Adjust the path as needed

const router = express.Router();

// Create an employee (requires permission, e.g., 'create_employee')
router.post(
  "/employees",
  authAndPermission("create_employee"),
  EmployeeController.createEmployee
);

// View own profile (no specific permission required)
router.get(
  "/employees/me",
  authAndPermission("view_own_profile"),
  EmployeeController.viewMyProfile
);

// List all employees in the organization (requires permission, e.g., 'list_employees')
router.get(
  "/employees",
  authAndPermission("list_employees"),
  EmployeeController.listEmployees
);

// Update an employee (requires permission, e.g., 'update_employee')
router.put(
  "/employees/:id",
  authAndPermission("update_employee"),
  EmployeeController.updateEmployee
);

// Delete an employee (requires permission, e.g., 'delete_employee')
router.delete(
  "/employees/:id",
  authAndPermission("delete_employee"),
  EmployeeController.deleteEmployee
);

// Archive an employee (requires permission, e.g., 'archive_employee')
// router.patch('/employees/:id/archive', authAndPermission('archive_employee'), EmployeeController.archiveEmployee);

module.exports = router;
