const Project = require("../models/Project");

// ✅ Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, budget, deadline, client } = req.body;
    
    const project = new Project({
      title,
      description,
      budget,
      deadline,
      client
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("client", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("client", "name email");
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update project status
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Check if status is provided
    if (!status) {
      return res.status(400).json({ error: "Status field is required" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({ message: "Project status updated", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
