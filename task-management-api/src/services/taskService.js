const db = require("../config/prisma");
exports.createTask = async (userId, data) => {
    const member = await db.projectMember.findFirst({
        where: {
            projectId: data.projectId,
            userId,
        },
    });

    if (!member)
        throw new Error("Only project member can create task");

    return db.task.create({
        data: {
            ...data,
            dueDate:
                data.dueDate && !isNaN(new Date(data.dueDate).getTime())
                    ? new Date(data.dueDate)
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
        },
    });
};

exports.assignTask = async (taskId, assignedTo, userId) => {
    const task = await db.task.findUnique({
        where: { id: taskId },
        include: { project: true },
    });

    if (!task) throw new Error("Task not found");

    // Pastikan assign ke member project
    const member = await db.projectMember.findFirst({
        where: {
            projectId: task.projectId,
            userId: assignedTo,
        },
    });

    if (!member) {
        throw new Error("Cannot assign task to non-member");
    }

    return db.task.update({
        where: { id: taskId },
        data: { assignedTo },
    });
};

exports.getProjectTasks = async (projectId, query) => {
    const {
        page = 1,
        limit = 10,
        status,
        priority,
        search,
        sortBy = "createdAt",
        order = "desc",
    } = query;

    const skip = (page - 1) * limit;

    const where = {
        projectId,
    };

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = Number(priority);
    }

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive",
        };
    }

    const [tasks, total] = await Promise.all([
        db.task.findMany({
            where,
            skip: Number(skip),
            take: Number(limit),
            orderBy: {
                [sortBy]: order,
            },
        }),
        db.task.count({ where }),
    ]);

    return {
        meta: {
            total,
            page: Number(page),
            lastPage: Math.ceil(total / limit),
        },
        data: tasks,
    };
};

exports.updateTask = async (taskId, data) => {
    const updateData = {};

    if (data.title !== undefined) {
        updateData.title = data.title;
    }

    if (data.status !== undefined) {
        updateData.status = data.status;
    }

    if (data.priority !== undefined) {
        updateData.priority = Number(data.priority);
    }

    if (data.dueDate !== undefined) {
        const parsed = new Date(data.dueDate);
        updateData.dueDate = isNaN(parsed.getTime()) ? null : parsed;
    }

    return db.task.update({
        where: { id: taskId },
        data: updateData,
    });
};
