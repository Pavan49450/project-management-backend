const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUsersByAdminId,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userControllers");
const auth = require("../middleware/auth");

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

router.get("/admin/:adminId", auth, getUsersByAdminId);

router.get("/:userId", auth, getUserById);

// Update user
router.put("/:userId", auth, updateUser);

// Delete user
router.delete("/:userId", auth, deleteUser);

module.exports = router;
