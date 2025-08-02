const Project = require("../models/project");

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.aggregate([
      // Match projects for this user
      { $match: { userId: req.user.userId } },

      // Lookup phases for each project
      {
        $lookup: {
          from: "phases", // MongoDB collection name (lowercase, pluralized)
          localField: "_id",
          foreignField: "projectId",
          as: "phases",
        },
      },

      // Lookup tasks for each phase
      {
        $lookup: {
          from: "tasks", // MongoDB collection name (lowercase, pluralized)
          localField: "phases._id",
          foreignField: "phaseId",
          as: "allTasks",
        },
      },

      // Group tasks back into their respective phases
      {
        $addFields: {
          phases: {
            $map: {
              input: "$phases",
              as: "phase",
              in: {
                $mergeObjects: [
                  "$$phase",
                  {
                    tasks: {
                      $filter: {
                        input: "$allTasks",
                        cond: { $eq: ["$$this.phaseId", "$$phase._id"] },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      // Remove the temporary allTasks field
      { $project: { allTasks: 0 } },

      // Sort by creation date
      { $sort: { createdAt: -1 } },
    ]);

    console.log(
      "Fetched projects with phases and tasks:",
      JSON.stringify(projects, null, 2)
    );
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      userId: req.user.userId,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
