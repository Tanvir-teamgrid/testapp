const jwt = require("jsonwebtoken");
const User = require("../models/user-model"); // Adjust the path as needed

const authJwt = (requiredPermission) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decoded.id; // Ensure this matches your JWT payload
       

      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Set user information in the request for later use
      req.user = { id: user._id, role: user.roleId, organizationId:user.organizationId }; // You can add more fields if needed
      next();
    } catch (err) {
      console.error("Error in authJwt middleware:", err);
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

module.exports = authJwt;