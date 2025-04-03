const express = require("express");
const { createProject, getProjects, getProjectById, updateProjectStatus } = require("../controllers/projectController");

const router = express.Router();

// ✅ Create a new project
router.post("/create", createProject);

// ✅ Get all projects
router.get("/", getProjects);

// ✅ Get a single project by ID
router.get("/:id", getProjectById);

// ✅ Update project status (without /status)
router.put("/:id", updateProjectStatus);

module.exports = router;
