const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const upload = require("../middleware/fileUploads"); // Assuming you have an upload middleware for handling images
const authAndPermission = require("../middleware/authJwtAndPermission");

// Route for creating a new user profile
router.post(
  "/profiles",
  authAndPermission("create"), // Ensure the user has permission to create a profile
  upload.single("image"), // Handle image upload
  UserProfileController.createProfile
);

// Route for viewing a user profile by employee ID
router.get(
  "/profiles/:employeeId",
  authAndPermission("view"), // Ensure the user has permission to view profiles
  UserProfileController.viewProfile
);

// Route for updating a user profile by employee ID
router.put(
  "/profiles/:employeeId",
  authAndPermission("update"), // Ensure the user has permission to update a profile
  upload.single("image"), // Handle image upload
  UserProfileController.editProfile
);

// Route for deleting a user profile by employee ID
router.delete(
  "/profiles/:employeeId",
  authAndPermission("delete"), // Ensure the user has permission to delete a profile
  UserProfileController.deleteProfile
);

module.exports = router;
