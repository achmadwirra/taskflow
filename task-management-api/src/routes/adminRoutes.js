const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const adminController = require("../controllers/adminController");

// All routes require auth + admin
router.use(auth, requireAdmin);

router.get("/summary", adminController.getSummary);
router.get("/users", adminController.getAllUsers);
router.get("/projects", adminController.getProjectsByUser);
router.post("/impersonate/:userId", adminController.impersonate);
router.get("/timeline", adminController.getTimeline);
router.get("/all-projects", adminController.getAllProjects);
router.patch("/users/:userId", adminController.updateUser);

module.exports = router;
