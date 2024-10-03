const express = require("express");
const UserProfileController = require("../controllers/userProfileController");

const router = express.Router();

// Define routes
router.post("/profiles", UserProfileController.createUserProfile); // Create a profile
router.get("/profiles/:id", UserProfileController.getUserProfileById); // Get profile by ID
router.put("/profiles/:id", UserProfileController.updateUserProfile); // Update profile by ID
router.delete("/profiles/:id", UserProfileController.deleteUserProfile); // Delete profile by ID

module.exports = router;
