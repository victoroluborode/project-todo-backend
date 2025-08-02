const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
  },
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  estimated: String,
  dueDate: Date,
  notifications: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", taskSchema);
