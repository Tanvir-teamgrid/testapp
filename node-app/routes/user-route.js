const express = require("express");
const UserController = require("../controllers/user-controller");  
const router = express.Router();

 
router.post("/users", UserController.addUser);

 
router.post("/users/login", UserController.loginUser);

 
router.put("/users/:id", UserController.updateUser);

 
router.delete("/users/:id", UserController.deleteUser);
 
module.exports = router;
