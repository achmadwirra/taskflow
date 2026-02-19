const db = require("../config/prisma");
const { generateImpersonationToken } = require("../utils/jwt");

/**
 * Get admin dashboard summary
 */
exports.getSummary = async () => {
    const [totalUsers, totalProjects, totalTasks, tasksByStatus] =
        await Promise.all([
            db.user.count(),
            db.project.count(),
            db.task.count(),
            db.task.groupBy({
                by: ["status"],
                _count: { status: true },
            }),
        ]);

    const statusBreakdown = {
        TODO: 0,
        IN_PROGRESS: 0,
        DONE: 0,
    };

    tasksByStatus.forEach((group) => {
        statusBreakdown[group.status] = group._count.status;
    });

    return {
        totalUsers,
        totalProjects,
        totalTasks,
        tasksByStatus: statusBreakdown,
    };
};

/**
 * Get all projects filtered by a specific user (as owner or member)
 */
exports.getProjectsByUser = async (userId) => {
    return db.project.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
            ],
        },
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
            members: {
                include: {
                    user: {
                        select: { id: true, name: true, email: true },
                    },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

/**
 * Get all users (for dropdown / filter)
 */
exports.getAllUsers = async () => {
    return db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
        orderBy: { name: "asc" },
    });
};

/**
 * Generate impersonation token for a target user
 */
exports.impersonateUser = async (targetUserId, adminId) => {
    const targetUser = await db.user.findUnique({
        where: { id: targetUserId },
    });

    if (!targetUser) {
        throw new Error("User not found");
    }

    const token = generateImpersonationToken(targetUser, adminId);

    return {
        token,
        user: {
            id: targetUser.id,
            name: targetUser.name,
            email: targetUser.email,
            role: targetUser.role,
        },
    };
};

/**
 * Get activity timeline (last 50 audit logs)
 */
exports.getTimeline = async () => {
    return db.auditLog.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
    });
};

/**
 * Get all projects (optionally including deleted)
 */
exports.getAllProjects = async (includeDeleted = false) => {
    return db.project.findMany({
        ...(includeDeleted ? { bypassSoftDelete: true } : {}),
        include: {
            owner: {
                select: { id: true, name: true, email: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
};

