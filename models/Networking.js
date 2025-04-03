const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema({
  freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  connection_id: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  connected_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Network", networkSchema);
