const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  title: { type: String, required: true },
  goal: String,
  color: {
    type: String,
    default: "bg-gradient-to-r from-blue-500 to-purple-600",
  },
  timeline: String,
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Phase", phaseSchema);
