const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));
app.use("/api/phases", require("./routes/phases"));
app.use("/api/tasks", require("./routes/tasks"));

// WebSocket for real-time updates
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
  });

  socket.on("projectUpdate", (projectId, update) => {
    socket.to(projectId).emit("projectUpdate", update);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Data export endpoint
app.get(
  "/api/export/projects",
  require("./middleware/auth"),
  async (req, res) => {
    try {
      const projects = await Project.find({ userId: req.user.userId }).populate(
        {
          path: "phases",
          populate: { path: "tasks" },
        }
      );
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Search endpoint
app.get("/api/search/tasks", require("./middleware/auth"), async (req, res) => {
  try {
    const { query } = req.query;
    const tasks = await Task.find({
      name: { $regex: query, $options: "i" },
      phaseId: {
        $in: await Phase.find({
          projectId: {
            $in: await Project.find({ userId: req.user.userId }).distinct(
              "_id"
            ),
          },
        }).distinct("_id"),
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
