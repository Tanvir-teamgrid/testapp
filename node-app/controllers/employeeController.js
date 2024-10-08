const Employee = require("../models/employeeSchema");
const User = require("../models/user-model");
const Organization = require("../models/organizationSchema");

class EmployeeController {
  static createEmployee = async (req, res) => {
    try {
      const { department, position, salary, hireDate, status } = req.body;

      // Validate request
      if (!department || !position || !salary || !hireDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify that the user creating the employee belongs to an organization
      const adminUser = await User.findById(req.user.id); // Ensure you are using req.user.id

      // Check if adminUser is found and has an organizationId
      if (!adminUser || !adminUser.organizationId) {
        return res
          .status(403)
          .json({ message: "Not authorized to create employees" });
      }

      // Ensure the organization exists
      const organization = await Organization.findById(
        adminUser.organizationId
      );
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      // Create the employee
      const employee = new Employee({
        userId: req.user.id,
        organizationId: adminUser.organizationId, // Set the organizationId
        department,
        position,
        salary,
        hireDate,
        status: status || "active", // Default to 'active' if status is not provided
        createdBy: adminUser._id,
      });

      const savedEmployee = await employee.save();

      res.status(201).json({
        message: "Employee created successfully",
        employee: savedEmployee,
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  static getAllEmployees = async (req, res) => {
    try {
      // Retrieve the admin user and populate their organization
      const adminUser = await User.findById(req.user.id).populate(
        "organizationId"
      );

      if (!adminUser || !adminUser.organizationId) {
        return res
          .status(403)
          .json({ message: "Not authorized to view employees" });
      }

      // Retrieve employees linked to the admin's organization
      const employees = await Employee.find({
        organizationId: adminUser.organizationId._id, // Make sure to add organizationId in Employee schema
      })
        .populate({
          path: "userId", // Populate user details
          select: "firstName lastName email phone",
        })
        .populate({
          path: "createdBy", // Populate creator details
          select: "firstName lastName",
        })
        .exec();

      if (employees.length === 0) {
        return res.status(200).json({
          message: "No employees found in this organization",
          employees: [],
        });
      }

      res.status(200).json({
        message:
          employees.length === 1
            ? "1 employee fetched successfully"
            : "Employees fetched successfully",
        employees,
      });
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get an employee profile by their ID
  static getEmployeeProfile = async (req, res) => {
    try {
      const { employeeId } = req.params;

      const employee = await Employee.findById(employeeId)
        .populate("userId", "firstName lastName email phone") // Populate user details
        .populate("createdBy", "firstName lastName") // Populate creator details
        .exec();

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        message: "Employee profile fetched successfully",
        employee,
      });
    } catch (error) {
      console.error("Error fetching employee profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update an employee profile by ID
  static updateEmployee = async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { department, position, salary, hireDate, status } = req.body;

      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Update the fields
      employee.department = department || employee.department;
      employee.position = position || employee.position;
      employee.salary = salary || employee.salary;
      employee.hireDate = hireDate || employee.hireDate;
      employee.status = status || employee.status;

      const updatedEmployee = await employee.save();

      res.status(200).json({
        message: "Employee updated successfully",
        employee: updatedEmployee,
      });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Delete an employee by ID
  static deleteEmployee = async (req, res) => {
    try {
      const { employeeId } = req.params;

      const employee = await Employee.findByIdAndDelete(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json({
        message: "Employee deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = EmployeeController;
