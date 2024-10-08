const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const RolePermission = require("../models/rolePermission");

const authAndPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // Extract token from headers
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }

      const userId = decoded.id;

      // Find user and check role
      const user = await User.findById(userId).populate("roleId");
      if (!user || !user.roleId) {
        return res.status(404).json({ message: "User or role not found" });
      }

      // Set user information in the request for later use
      req.user = { id: user._id, role: user.roleId.name };

      // Fetch the role permissions for the user
      const rolePermissions = await RolePermission.findOne({
        roleId: user.roleId._id,
      }).populate("permissionId");
      if (!rolePermissions) {
        return res.status(404).json({ message: "Role permissions not found" });
      }

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

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      console.error("Error in authAndPermission middleware:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = authAndPermission;
