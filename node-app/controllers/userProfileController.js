const UserProfile = require("../models/userProfile");
const Employee = require("../models/employeeSchema");

class UserProfileController {
  // Create a new user profile
  static createProfile = async (req, res) => {
    try {
      const { employeeId, address, dob, gender, maritalStatus } = req.body;
      const image = req.file ? req.file.path : null; // Get image path from multer

      // Check if the employee exists
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Create a new profile
      const profile = new UserProfile({
        employeeId,
        address,
        dob,
        gender,
        maritalStatus,
        image, // Image URL
      });

      const savedProfile = await profile.save();

      res.status(201).json({
        message: "Profile created successfully",
        profile: savedProfile,
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Get user profile by userId
  static viewProfile = async (req, res) => {
    try {
      const { employeeId } = req.params; // The employee ID is passed in the URL

      // Find the profile by employeeId, populating the employee details
      const profile = await UserProfile.findOne({ employeeId }).populate(
        "employeeId"
      );

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Modify the image URL directly in the profile object
      if (profile.image) {
        profile.image = `${req.protocol}://${req.get("host")}/${profile.image}`; // Constructing full image URL
      }

      // Send profile details, including the image URL
      res.status(200).json({
        message: "Profile retrieved successfully",
        profile,
      });
    } catch (error) {
      console.error("Error viewing profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // Update user profile by ID
  static editProfile = async (req, res) => {
    try {
      const { employeeId } = req.params; // Employee ID from the URL
      const { address, dob, gender, maritalStatus, image } = req.body;

      // Find the profile by employeeId
      const profile = await UserProfile.findOne({ employeeId });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Update the profile fields
      profile.address = address || profile.address;
      profile.dob = dob || profile.dob;
      profile.gender = gender || profile.gender;
      profile.maritalStatus = maritalStatus || profile.maritalStatus;
      profile.image = image || profile.image; // Update image if provided

      const updatedProfile = await profile.save();

      res.status(200).json({
        message: "Profile updated successfully",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // Delete user profile by ID
  static deleteProfile = async (req, res) => {
    try {
      const { employeeId } = req.params; // Employee ID from the URL

      // Find and delete the profile by employeeId
      const profile = await UserProfile.findOneAndDelete({ employeeId });

      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json({
        message: "Profile deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

module.exports = UserProfileController;
