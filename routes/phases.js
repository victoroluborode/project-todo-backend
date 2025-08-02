const express = require("express");
const router = express.Router();
const phaseController = require("../controllers/phasecontroller");
const authMiddleware = require("../middleware/auth");

router.use(authMiddleware);

router.get("/projects/:projectId/phases", phaseController.getPhases);
router.post("/projects/:projectId/phases", phaseController.createPhase);
router.put("/:id", phaseController.updatePhase);
router.delete("/:id", phaseController.deletePhase);

module.exports = router;
