const Proposal = require("../models/Proposal");

// ✅ Create Proposal
exports.createProposal = async (req, res) => {
  try {
    const { project_id, freelancer_id, client_id, cover_letter, bid_amount, estimated_time, status } = req.body;

    // Validation - Ensure required fields are present
    if (!project_id || !freelancer_id || !client_id || !cover_letter || !bid_amount || !estimated_time || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const proposal = new Proposal(req.body);
    await proposal.save();
    res.status(201).json({ message: "Proposal created successfully", proposal });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get All Proposals
exports.getAllProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find();
    res.status(200).json({ message: "Proposals retrieved successfully", proposals });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Get Proposal by ID
exports.getProposalById = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    res.status(200).json({ message: "Proposal retrieved successfully", proposal });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Update Proposal
exports.updateProposal = async (req, res) => {
  try {
    const updateFields = req.body;
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: "Update data is required" });
    }

    const proposal = await Proposal.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }

    res.status(200).json({ message: "Proposal updated successfully", proposal });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// ✅ Delete Proposal
exports.deleteProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findByIdAndDelete(req.params.id);
    if (!proposal) {
      return res.status(404).json({ error: "Proposal not found" });
    }
    res.status(200).json({ message: "Proposal deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
