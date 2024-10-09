const User = require("../models/user-model"); // Adjust path as needed
const Employee = require("../models/employeeSchema");
const Organization = require("../models/organizationSchema");

class EmployeeController {
  // Create employee
  static createEmployee = async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        department,
        position,
        salary,
        hireDate,
        status,
      } = req.body;

      // Validate required fields
      if (
        !username ||
        !email ||
        !password ||
        !department ||
        !position ||
        !salary ||
        !hireDate
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Verify if the user creating the employee belongs to an organization
      const adminUser = await User.findById(req.user.id);
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

      // Create the new user for the employee
      const newUser = new User({
        username,
        email,
        password, // You should hash the password before saving it
        organizationId: adminUser.organizationId,
      });

      const savedUser = await newUser.save();

      // Create the employee profile
      const employee = new Employee({
        userId: savedUser._id,
        organizationId: adminUser.organizationId,
        department,
        position,
        salary,
        hireDate,
        status: status || "active",
        createdBy: adminUser._id,
      });

      const savedEmployee = await employee.save();

      res.status(201).json({
        message: "Employee and user created successfully",
        employee: savedEmployee,
        user: savedUser,
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // View own profile
  static viewMyProfile = async (req, res) => {
    try {
      const employeeId = req.user.id;

      const employee = await Employee.findOne({ userId: employeeId }).populate(
        "userId"
      );
      if (!employee) {
        return res.status(404).json({ message: "Employee profile not found" });
      }

      res.status(200).json({
        message: "Employee profile retrieved successfully",
        profile: {
          username: employee.userId.username,
          email: employee.userId.email,
          profileImage: employee.userId.profileImage,
          department: employee.department,
          position: employee.position,
          salary: employee.salary,
          hireDate: employee.hireDate,
          status: employee.status,
        },
      });
    } catch (error) {
      console.error("Error retrieving employee profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get list of employees
  static listEmployees = async (req, res) => {
    try {
      const adminUser = await User.findById(req.user.id);
      const employees = await Employee.find({
        organizationId: adminUser.organizationId,
      }).populate("userId");

      res.status(200).json({
        message: "Employees retrieved successfully",
        employees,
      });
    } catch (error) {
      console.error("Error retrieving employees:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // Update employee
  static updateEmployee = async (req, res) => {
    try {
      const employeeId = req.params.id; // Employee ID from the request parameters
      const {
        username,
        email,
        department,
        position,
        salary,
        hireDate,
        status,
      } = req.body;

      // Find the employee
      const employee = await Employee.findById(employeeId).populate("userId");

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Verify if the user updating the employee belongs to the same organization
      const adminUser = await User.findById(req.user.id);
      if (
        !adminUser ||
        adminUser.organizationId.toString() !==
          employee.organizationId.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this employee" });
      }

      // Update employee details
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

  // Delete employee
  static deleteEmployee = async (req, res) => {
    try {
      const employeeId = req.params.id; // Employee ID from the request parameters

      // Find the employee
      const employee = await Employee.findById(employeeId).populate("userId");
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Verify if the user deleting the employee belongs to the same organization
      const adminUser = await User.findById(req.user.id);
      if (
        !adminUser ||
        adminUser.organizationId.toString() !==
          employee.organizationId.toString()
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this employee" });
      }

      // Delete the employee
      await Employee.deleteOne({ _id: employeeId });
      await User.deleteOne({ _id: employee.userId._id }); // Optionally delete the associated user

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
