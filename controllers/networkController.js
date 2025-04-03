const mongoose = require("mongoose");
const Network = require("../models/Networking");

// ✅ Create a new network connection
exports.createConnection = async (req, res) => {
  try {
    const { freelancer_id, connection_id, status } = req.body;

    // ✅ Validate input
    if (!freelancer_id || !connection_id || !status) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (freelancer_id === connection_id) {
      return res.status(400).json({ error: "You cannot connect with yourself" });
    }

    // ✅ Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(freelancer_id) || !mongoose.Types.ObjectId.isValid(connection_id)) {
      return res.status(400).json({ error: "Invalid freelancer or connection ID format" });
    }

    // ✅ Check if the connection already exists
    const existingConnection = await Network.findOne({
      $or: [
        { freelancer_id, connection_id },
        { freelancer_id: connection_id, connection_id: freelancer_id },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ error: "Connection already exists" });
    }

    // ✅ Create new connection
    const newConnection = new Network({
      freelancer_id,
      connection_id,
      status: status.toLowerCase(),
      connected_at: new Date(),
    });

    await newConnection.save();

    res.status(201).json({
      message: "Connection request sent successfully",
      network: newConnection,
    });
  } catch (error) {
    console.error("❌ Error creating connection:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get all network connections
exports.getConnections = async (req, res) => {
  try {
    const connections = await Network.find();
    res.status(200).json({ success: true, connections });
  } catch (error) {
    console.error("❌ Error fetching connections:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get freelancer's connections
exports.getFreelancerConnections = async (req, res) => {
  try {
    const { freelancer_id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(freelancer_id)) {
      return res.status(400).json({ error: "Invalid freelancer ID format" });
    }

    const connections = await Network.find({
      $or: [{ freelancer_id }, { connection_id: freelancer_id }],
    });

    res.status(200).json({ success: true, connections });
  } catch (error) {
    console.error("❌ Error fetching freelancer connections:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update connection status
exports.updateConnectionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid connection ID format" });
    }

    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value. Allowed values: pending, accepted, rejected" });
    }

    const updatedConnection = await Network.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!updatedConnection) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.status(200).json({ message: "Connection status updated", network: updatedConnection });
  } catch (error) {
    console.error("❌ Error updating connection status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete connection
exports.deleteConnection = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid connection ID format" });
    }

    const deletedConnection = await Network.findByIdAndDelete(id);

    if (!deletedConnection) {
      return res.status(404).json({ error: "Connection not found or already deleted" });
    }

    res.status(200).json({ message: "Connection deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting connection:", error);
    res.status(500).json({ error: error.message });
  }
};
