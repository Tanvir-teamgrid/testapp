const Role = require("../models/role");
const User = require("../models/user-model");
const UserProfile = require("../models/userProfile");
const bcrypt = require("bcrypt");
const userController = require("./user-controller"); // Import userController

class employeeController {
  static addEmployee = async (req, res) => {
    try {
      const {
        username,
        email,
        phone,
        roleId,
        firstName,
        lastName,
        dob,
        contactNumber,
        password,
      } = req.body;

      // Check for missing required fields
      if (
        !username ||
        !email ||
        !phone ||
        !roleId ||
        !firstName ||
        !lastName ||
        !password
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Check if the role exists
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // If no password provided, assign a default password
      const defaultPassword = password || "employee@123";

      // Hash the default or provided password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

      // Create and save the new user
      const newUser = new User({
        email,
        phone,
        username,
        password: hashedPassword,
        roleId,
      });
      const savedUser = await newUser.save();

      // Create and save the user profile
      const newUserProfile = new UserProfile({
        firstName,
        lastName,
        dob,
        contactNumber,
        userId: savedUser._id,
      });
      await newUserProfile.save();

      // Respond with success
      return res.status(201).json({
        message: "Employee created successfully",
        user: savedUser,
        profile: newUserProfile,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error adding employee", error: error.message });
    }
  };

  // Call the login function from the userController when needed
  static loginEmployee = async (req, res) => {
    return userController.loginUser(req, res); // Reuse login logic from userController
  };

  static viewEmployee = async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }
      const userProfile = await UserProfile.findOne({ userId: user._id });
      res.status(200).json({ user, userProfile });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error viewing employee", error: error.message });
    }
  };

  static viewAllEmployees = async (req, res) => {
    try {
      const users = await User.find().populate("roleId", "roleName");
      const userProfiles = await UserProfile.find();

      // Combine users with their profiles
      const allEmployees = users.map((user) => {
        const profile = userProfiles.find(
          (profile) => profile.userId.toString() === user._id.toString()
        );
        return {
          user,
          userProfile: profile || null,
        };
      });

      res.status(200).json(allEmployees);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error viewing all employees", error: error.message });
    }
  };

  static deleteEmployee = async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Employee not found" });
      }

      await UserProfile.deleteOne({ userId: user._id });

      // Delete the user
      await User.deleteOne({ _id: userId });

      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting employee", error: error.message });
    }
  };
}

module.exports = employeeController;

// employeeController.js
// const Employee = require("../models/employeeSchema"); // Adjust the path as needed

// // Create a new employee
// const createEmployee = async (req, res) => {
//   const { userId, profileId, department, position, hireDate, salary, status } =
//     req.body;

//   // Validate required fields
//   if (
//     !userId ||
//     !profileId ||
//     !department ||
//     !position ||
//     !hireDate ||
//     !salary
//   ) {
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields are required." });
//   }

//   try {
//     const employeeData = {
//       userId,
//       profileId,
//       department,
//       position,
//       hireDate,
//       salary,
//       status: status || "active", // Default to "active" if not provided
//     };

//     const employee = await Employee.create(employeeData);
//     res.status(201).json({ success: true, employee });
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Error creating employee" });
//   }
// };

// // Export controller functions
// module.exports = {
//   createEmployee,
// };
