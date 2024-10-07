const express = require("express");
const AuthController = require("../controllers/authController");
const router = express.Router();

// Route for user signup and organization creation
router.post("/signup", AuthController.signUpAndCreateOrganization);

// // Route for user login
// router.post("/login", AuthController.login);

module.exports = router;
