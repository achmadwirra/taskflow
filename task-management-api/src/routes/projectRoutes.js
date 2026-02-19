const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { isProjectMember, isProjectOwner } = require("../middleware/projectAccess");
const { requireAdmin } = require("../middleware/roleMiddleware");

const projectController = require("../controllers/projectController");
const projectService = require("../services/projectService");

const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");

router.post("/", auth, projectController.createProject);

router.get("/", auth, projectController.getMyProjects);

router.get("/:projectId", auth, isProjectMember, projectController.getProject);

router.delete("/:projectId", auth, isProjectOwner, projectController.deleteProject);

router.patch(
    "/:projectId",
    auth,
    isProjectOwner,
    projectController.updateProject
);

router.patch(
    "/:projectId/restore",
    auth,
    requireAdmin,
    asyncHandler(async (req, res) => {
        const project = await projectService.restoreProject(
            req.params.projectId,
            req.user.id
        );

        success(res, project, "Project restored");
    })
);

module.exports = router;
