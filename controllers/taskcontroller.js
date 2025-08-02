const Task = require("../models/task");
const Phase = require("../models/phase");
const Project = require("../models/project");

exports.getTasks = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.phaseId);
    if (!phase) return res.status(404).json({ message: "Phase not found" });

    const project = await Project.findOne({
      _id: phase.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ phaseId: req.params.phaseId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const phase = await Phase.findById(req.params.phaseId);
    if (!phase) return res.status(404).json({ message: "Phase not found" });

    const project = await Project.findOne({
      _id: phase.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = new Task({
      ...req.body,
      phaseId: req.params.phaseId,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const phase = await Phase.findById(task.phaseId);
    const project = await Project.findOne({
      _id: phase.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const updates = {
      ...req.body,
      updatedAt: Date.now(),
      completedAt: req.body.completed ? Date.now() : task.completedAt,
    };

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const phase = await Phase.findById(task.phaseId);
    const project = await Project.findOne({
      _id: phase.projectId,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
