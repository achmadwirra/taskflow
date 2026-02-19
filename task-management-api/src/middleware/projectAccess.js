const db = require("../config/prisma");

exports.isProjectMember = async (req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    const member = await db.projectMember.findFirst({
        where: {
            projectId,
            userId,
        },
    });

    if (!member) {
        return res.status(403).json({
            success: false,
            message: "Access denied. Not a project member.",
        });
    }

    next();
};

exports.isProjectOwner = async (req, res, next) => {
    const userId = req.user.id;
    const { projectId } = req.params;

    const project = await db.project.findUnique({
        where: { id: projectId },
    });

    if (!project || project.ownerId !== userId) {
        return res.status(403).json({
            success: false,
            message: "Only project owner can perform this action.",
        });
    }

    next();
};
