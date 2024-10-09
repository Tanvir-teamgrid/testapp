const Organization = require("../models/organizationSchema");
const User = require("../models/user-model");
const Role = require("../models/role");
const upload = require("../middleware/fileUploads"); // Adjust the path
const upload_URL = process.env.UPLOAD_URL || "http://localhost:8080/my-upload/";
class AuthController {
  static signUpAndCreateOrganization = async (req, res) => {
    // Use upload.fields() to handle both file and form data
    upload.fields([
      { name: "logo", maxCount: 1 }, // File field
      { name: "username" },
      { name: "email" },
      { name: "password" },
      { name: "phone" },
      { name: "orgName" },
      { name: "addressLine" },
      { name: "city" },
      { name: "state" },
      { name: "country" },
      { name: "zipCode" },
    ])(req, res, async (err) => {
      if (err) {
        console.error("Error during file upload:", err);
        return res
          .status(400)
          .json({ message: "File upload error", error: err.message });
      }

      try {
        // Log to see the content of req.body and req.files
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.files);

        const {
          username,
          email,
          password,
          phone,
          orgName,
          addressLine,
          city,
          state,
          country,
          zipCode,
        } = req.body;

        // Validate required fields
        if (
          !username ||
          !email ||
          !password ||
          !phone ||
          !orgName ||
          !addressLine ||
          !city ||
          !state ||
          !country ||
          !zipCode
        ) {
          return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "User with this email already exists." });
        }

        // Find or create the "super_admin" role
        let role = await Role.findOne({ name: "super_admin" });
        if (!role) {
          role = new Role({ name: "super_admin" });
          await role.save();
        }

        // Create the user (organization creator)
        const user = new User({
          username,
          email,
          password,
          phone,
          roleId: role._id, // Assign super admin role
        });
        const savedUser = await user.save();

        // Create the organization with logo if uploaded
        const organization = new Organization({
          name: orgName,
          logo: req.files.logo
            ? `${upload_URL}${req.files.logo[0].filename}`
            : undefined, // Logo URL if uploaded
          email,
          addressLine,
          phone,
          city,
          state,
          country,
          zipCode,
          superAdminId: savedUser._id, // Assign the created user as super admin
        });

        const savedOrganization = await organization.save();

        // Update user with organizationId
        savedUser.organizationId = savedOrganization._id;
        await savedUser.save();

        return res.status(201).json({
          message: "User and organization created successfully.",
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
            role: role.name,
          },
          organization: {
            id: savedOrganization._id,
            name: savedOrganization.name,
            logo: savedOrganization.logo,
            email: savedOrganization.email,
            superAdminId: savedUser._id,
          },
        });
      } catch (error) {
        console.error("Error in sign-up process:", error);
        return res
          .status(500)
          .json({ message: "Internal server error.", error: error.message });
      }
    });
  };
}

module.exports = AuthController;
