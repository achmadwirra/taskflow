const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { isProjectMember } = require("../middleware/projectAccess");
const { canEditTask } = require("../middleware/taskAccess");
const taskController = require("../controllers/taskController");

// Create Task
router.post(
    "/projects/:projectId/tasks",
    auth,
    isProjectMember,
    taskController.createTask
);

// Get Project Tasks
router.get(
    "/projects/:projectId/tasks",
    auth,
    isProjectMember,
    taskController.getTasks
);

// Update Task
router.patch(
    "/tasks/:taskId",
    auth,
    canEditTask,
    taskController.updateTask
);

// Delete Task
router.delete(
    "/tasks/:taskId",
    auth,
    canEditTask,
    taskController.deleteTask
);

module.exports = router;
