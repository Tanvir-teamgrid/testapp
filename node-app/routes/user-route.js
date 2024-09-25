const express = require("express");
const UserController = require("../controllers/user-controller"); 
const authMiddleware = require("../middleware/authJwt"); 
const router = express.Router();

 
router.post("/users/add",authMiddleware("create"), UserController.addUser);

 
router.post("/users/login", UserController.loginUser);

 
router.put("/users/:id",authMiddleware("update"), UserController.updateUser);

 
router.delete("/users/:id",authMiddleware("delete"), UserController.deleteUser);
 
module.exports = router;
