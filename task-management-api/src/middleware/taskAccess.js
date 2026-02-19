const db = require("../config/prisma");

exports.canEditTask = async (req, res, next) => {
    const { taskId } = req.params;
    const userId = req.user.id;

    try {
        const task = await db.task.findUnique({
            where: { id: taskId },
            select: { projectId: true },
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        const member = await db.projectMember.findFirst({
            where: {
                projectId: task.projectId,
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
    } catch (error) {
        console.error("Task access error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during access check",
        });
    }
};
