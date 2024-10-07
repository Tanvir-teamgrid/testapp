const express = require("express");
const router = express.Router();
const UserProfileController = require("../controllers/userProfileController");
const upload = require("../middleware/fileUploads"); // Assuming you have an upload middleware for handling images
const authMiddleware = require("../middleware/authJwt"); // Middleware for user authentication
const checkRoleAndPermission = require("../middleware/checkRoleAndPermission"); // Middleware for role and permission checks

// Route for creating a new user profile
router.post(
  "/profiles",
  authMiddleware(), // Ensure the user is authenticated
  checkRoleAndPermission("create"), // Ensure the user has permission to create a profile
  upload.single("image"), // Handle image upload
  UserProfileController.createProfile
);

// Route for viewing a user profile by employee ID
router.get(
  "/profiles/:employeeId",
  authMiddleware(), // Ensure the user is authenticated
  checkRoleAndPermission("view"), // Ensure the user has permission to view profiles
  UserProfileController.viewProfile
);

// Route for updating a user profile by employee ID
router.put(
  "/profiles/:employeeId",
  authMiddleware(), // Ensure the user is authenticated
  checkRoleAndPermission("update"), // Ensure the user has permission to update a profile
  upload.single("image"), // Handle image upload
  UserProfileController.editProfile
);

// Route for deleting a user profile by employee ID
router.delete(
  "/profiles/:employeeId",
  authMiddleware(), // Ensure the user is authenticated
  checkRoleAndPermission("delete"), // Ensure the user has permission to delete a profile
  UserProfileController.deleteProfile
);

module.exports = router;
