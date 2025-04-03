const express = require("express");
const {
  createConnection,
  getConnections,
  getFreelancerConnections,
  updateConnectionStatus,
  deleteConnection,
} = require("../controllers/networkController"); // ✅ Ensure this path is correct

const router = express.Router();

// ✅ Create a new network connection
router.post("/connect", createConnection);

// ✅ Get all network connections
router.get("/", getConnections);

// ✅ Get connections for a specific freelancer
router.get("/freelancer/:freelancer_id", getFreelancerConnections);

// ✅ Update network connection status
router.put("/:id/status", updateConnectionStatus);

// ✅ Delete a network connection
router.delete("/:id", deleteConnection);

module.exports = router;
