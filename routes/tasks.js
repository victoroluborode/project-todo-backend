const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskcontroller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/phases/:phaseId/tasks", taskController.getTasks);
router.post("/phases/:phaseId/tasks", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
