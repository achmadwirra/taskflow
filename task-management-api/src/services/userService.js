const db = require("../config/prisma");

/**
 * Get current user profile
 */
exports.getMe = async (userId) => {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });

    if (!user) throw new Error("User not found");
    return user;
};

/**
 * Update own profile (no role change allowed)
 */
exports.updateProfile = async (userId, data) => {
    // Email uniqueness check
    if (data.email) {
        const existing = await db.user.findFirst({
            where: {
                email: data.email,
                NOT: { id: userId },
            },
        });
        if (existing) throw new Error("Email already in use");
    }

    return db.user.update({
        where: { id: userId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};

/**
 * Admin: update any user (name, email, role)
 * Cannot downgrade self from ADMIN
 */
exports.adminUpdateUser = async (targetId, adminId, data) => {
    // Prevent admin from downgrading themselves
    if (targetId === adminId && data.role && data.role !== "ADMIN") {
        throw new Error("Cannot downgrade your own admin role");
    }

    // Email uniqueness check
    if (data.email) {
        const existing = await db.user.findFirst({
            where: {
                email: data.email,
                NOT: { id: targetId },
            },
        });
        if (existing) throw new Error("Email already in use");
    }

    return db.user.update({
        where: { id: targetId },
        data: {
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.role && { role: data.role }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
};
