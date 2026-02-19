const db = require("../config/prisma");

const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const projectService = require("../services/projectService");

exports.createProject = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const project = await projectService.createProject(
        req.user.id,
        name
    );

    success(res, project, "Project created", 201);
});

exports.getProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await projectService.getProject(projectId);

    if (!project) {
        return res.status(404).json({ message: "Project not found" });
    }

    success(res, project, "Project retrieved");
});

exports.deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    await projectService.deleteProject(req.user.id, projectId);

    success(res, null, "Project deleted");
});

exports.getMyProjects = asyncHandler(async (req, res) => {
    const includeDeleted = req.query.includeDeleted === "true";

    if (includeDeleted && req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Admin only"
        });
    }

    const projects = await db.project.findMany({
        where: {
            ownerId: req.user.id
        },
        bypassSoftDelete: includeDeleted
    });

    success(res, projects);
});

exports.updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name } = req.body;

    const project = await db.project.update({
        where: { id: projectId },
        data: { name }
    });

    success(res, project, "Project updated");
});
