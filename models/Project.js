const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true },
  status: { type: String, default: "Open" }
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
