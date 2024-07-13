const Admin = require("../models/admin");
const Project = require("../models/project");
const User = require("../models/user");

// Create Project
exports.createProject = async (req, res) => {
  const { name, description, status, pMultiplier = {}, createdOn } = req.body;

  try {
    const project = new Project({
      name,
      description,
      status,
      createdBy: req.user.id, // assuming req.user contains the authenticated user's info
      pMultiplier,
      createdOn,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all projects for a user
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.params.userId });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getProjectsByAdminId = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const adminDetails = await Admin.findById(adminId).populate("children");

    if (!adminDetails) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    let allProjects = await Promise.all(
      adminDetails.children.map(async (child) => {
        const projects = await Project.find({ createdBy: child._id });
        return projects;
      })
    );

    // Flatten the array of arrays into a single array of projects
    allProjects = allProjects.flat();

    res.json(allProjects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  const { name, description, status, pMultiplier } = req.body;

  try {
    let project = await Project.findById(req.params.projectId);

    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Project not found" });
    }

    project.name = name || project.name;
    project.description = description || project.description;
    project.status = status || project.status;
    project.createdOn = status || project.createdOn;
    project.pMultiplier = pMultiplier || project.pMultiplier;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project || project.createdBy.toString() !== req.user.id) {
      return res.status(404).json({ msg: "Project not found" });
    }

    await project.remove();
    res.json({ msg: "Project removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.iterateUsingUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Find the admin details by admin ID from the user object
    const adminDetails = await Admin.findById(user.admin);
    if (!adminDetails) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    // Check if iterations can be decremented
    if (adminDetails.iterations > 0) {
      adminDetails.iterations = adminDetails.iterations - 1;
    } else {
      return res.status(400).json({ msg: "Iterations exceeded" });
    }

    // Save the updated admin details
    await adminDetails.save();

    // Send a success response
    res.json({
      msg: "Iterations decremented successfully",
      admin: adminDetails,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
