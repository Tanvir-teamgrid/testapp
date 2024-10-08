const express = require("express");
const UserController = require("../controllers/user-controller");
const authAndPermission = require("../middleware/authJwtAndPermission");

const router = express.Router();

router.post("/users/add", UserController.addUser);

router.post("/users/login", UserController.loginUser);

router.put(
  "/users/:id",
  authAndPermission("update"),
  UserController.updateUser
);

router.delete(
  "/users/:id",
  authAndPermission("delete"),
  UserController.deleteUser
);

router.get("/users", authAndPermission("viewall"), UserController.viewUsers);

module.exports = router;
