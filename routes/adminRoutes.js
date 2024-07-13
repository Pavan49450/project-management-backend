const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  getAdminWithChildren,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} = require("../controllers/adminControllers");

// Register admin
router.post("/register", registerAdmin);

// Get admin with children
router.get("/:adminId", getAdminWithChildren);

router.post("/login", loginAdmin);

// Get all admins
router.get("/", getAllAdmins);

// Update admin
router.put("/:adminId", updateAdmin);

// Delete admin
router.delete("/:adminId", deleteAdmin);

module.exports = router;
