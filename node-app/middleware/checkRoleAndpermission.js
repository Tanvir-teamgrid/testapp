const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const RolePermission = require("../models/rolePermission");

const checkRoleAndPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Extract token from headers
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      // Verify token and extract user information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Find user and populate role
      const user = await User.findById(userId).populate("roleId");
      if (!user) return res.status(404).json({ message: "User not found" });

      // Check if the user's role is HR_manager or admin
      const allowedRoles = ["HR_manager", "admin"];
      if (!allowedRoles.includes(user.roleId.name)) {
        return res
          .status(403)
          .json({
            message:
              "Forbidden: Only HR Managers or Admins can create employees",
          });
      }

      // Fetch the role permissions for the user
      const rolePermissions = await RolePermission.findOne({
        roleId: user.roleId._id,
      }).populate("permissionId");
      if (!rolePermissions)
        return res.status(404).json({ message: "Role permissions not found" });

      // Extract user permissions
      const userPermissions = rolePermissions.permissionId.map(
        (permission) => permission.name
      );

      // Check if user has the required permission
      if (!userPermissions.includes(requiredPermission)) {
        return res
          .status(403)
          .json({
            message: "Forbidden: You do not have the required permissions",
          });
      }

      // Set user information in the request for later use
      req.user = { id: user._id, role: user.roleId };
      next();
    } catch (err) {
      console.error("Error in authorization middleware:", err);
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};

module.exports = checkRoleAndPermission;
