const Phase = require("../models/phase");
const Project = require("../models/project");

exports.getPhases = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const phases = await Phase.find({ projectId: req.params.projectId }).sort(
      "order"
    );
    res.json(phases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPhase = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const phase = new Phase({
      ...req.body,
      projectId: req.params.projectId,
    });
    await phase.save();
    res.status(201).json(phase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePhase = async (req, res) => {
  try {
    const phase = await Phase.findOneAndUpdate(
      { _id: req.params.id, projectId: req.params.projectId },
      req.body,
      { new: true }
    );
    if (!phase) return res.status(404).json({ message: "Phase not found" });
    res.json(phase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePhase = async (req, res) => {
  try {
    const phase = await Phase.findOneAndDelete({
      _id: req.params.id,
      projectId: req.params.projectId,
    });
    if (!phase) return res.status(404).json({ message: "Phase not found" });
    res.json({ message: "Phase deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
