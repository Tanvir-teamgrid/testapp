const Organization = require("../models/organizationSchema");
const User = require("../models/user-model");
const Role = require("../models/role");
const handleFileUpload = require("../middleware/logoUpload");

class AuthController {
  // Sign-up logic for the first user (organization creator)
  static signUpAndCreateOrganization = async (req, res) => {
    console.log("Received request:", req.body);
    try {
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
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user with the email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Find or create the "super_admin" role
      let role = await Role.findOne({ name: "super_admin" });
      if (!role) {
        role = new Role({ name: "super_admin" });
        await role.save();
      }

      // Create the user who is also the admin of the organization
      const user = new User({
        username,
        email,
        password,
        phone,
        roleId: role._id, // Assign super admin role
      });

      const savedUser = await user.save();

      // Handle organization logo upload
      handleFileUpload("logo")(req, res, async () => {
        const organization = new Organization({
          name: orgName,
          logo: req.file ? `${upload_URL}${req.file.filename}` : undefined, // Logo URL if uploaded
          email,
          addressLine,
          phone,
          city,
          state,
          country,
          zipCode,
          superAdminId: savedUser._id, // Assign this user as the super admin of the org
        });

        const savedOrganization = await organization.save();

        // Update user with organizationId
        savedUser.organizationId = savedOrganization._id;
        await savedUser.save();

        res.status(201).json({
          message: "User and Organization created successfully",
          user: savedUser,
          organization: savedOrganization,
        });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error in sign-up", error: error.message });
    }
  };
}

module.exports = AuthController;
