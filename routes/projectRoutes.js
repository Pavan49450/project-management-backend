const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByAdminId,
  iterateUsingUserId,
} = require("../controllers/projectControllers");
const auth = require("../middleware/auth"); // Assuming you have an auth middleware

// Create Project
router.post("/", auth, createProject);

// Get all projects for a user
router.get("/user/:userId", auth, getProjects);

router.get("/admin/:adminId", auth, getProjectsByAdminId);

// Get a single project by ID
router.get("/:projectId", auth, getProjectById);

// Update a project
router.put("/:projectId", auth, updateProject);

// Delete a project
router.delete("/:projectId", auth, deleteProject);

router.get("/iterate/:userId", auth, iterateUsingUserId);

module.exports = router;
