const db = require("../config/prisma");

exports.createProject = async (userId, name) => {
    return db.project.create({
        data: {
            name,
            ownerId: userId,
            members: {
                create: {
                    userId: userId,
                },
            },
        },
    });
};

exports.deleteProject = async (userId, projectId) => {
    const project = await db.project.findUnique({
        where: { id: projectId }
    });

    if (!project || project.ownerId !== userId)
        throw new Error("Only owner can delete project");

    return db.$transaction(async (tx) => {
        await tx.project.delete({
            where: { id: projectId }
        });

        await tx.auditLog.create({
            data: {
                action: "DELETE",
                entity: "Project",
                entityId: projectId,
                userId
            }
        });
    });
};

exports.restoreProject = async (projectId, userId) => {
    return db.$transaction(async (tx) => {
        // 1. Restore the project
        const project = await tx.project.update({
            where: { id: projectId },
            data: { deletedAt: null }
        });

        // 2. Log to AuditLog
        await tx.auditLog.create({
            data: {
                action: "RESTORE",
                entity: "Project",
                entityId: projectId,
                userId: userId
            }
        });

        return project;
    });
};



exports.getProject = async (projectId) => {
    return db.project.findUnique({
        where: { id: projectId },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
};

