const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    freelancer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
    cover_letter: { type: String, required: true },
    bid_amount: { type: Number, required: true },
    estimated_time: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
