const { PrismaClient } = require("@prisma/client");

const globalForPrisma = global;

const basePrisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = basePrisma;
}

const modelsWithSoftDelete = ["Project", "User", "Task"];

function getDelegate(model) {
    return model.charAt(0).toLowerCase() + model.slice(1);
}

const prisma = basePrisma.$extends({
    query: {
        $allModels: {
            async findUnique({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                // Handle bypass
                const { bypassSoftDelete, ...restArgs } = args;
                if (bypassSoftDelete) {
                    return query(restArgs);
                }

                // Redirect findUnique -> findFirst to allow deletedAt filter
                return basePrisma[getDelegate(model)].findFirst({
                    ...restArgs,
                    where: {
                        ...restArgs.where,
                        deletedAt: null,
                    },
                });
            },

            async findFirst({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                const { bypassSoftDelete, ...restArgs } = args;
                if (bypassSoftDelete) {
                    return query(restArgs);
                }

                if (restArgs.where?.deletedAt === undefined) {
                    restArgs.where = { ...restArgs.where, deletedAt: null };
                }

                return query(restArgs);
            },

            async findMany({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                const { bypassSoftDelete, ...restArgs } = args;
                if (bypassSoftDelete) {
                    return query(restArgs);
                }

                if (restArgs.where?.deletedAt === undefined) {
                    restArgs.where = { ...restArgs.where, deletedAt: null };
                }

                return query(restArgs);
            },

            async update({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                // Allow restoring logic or other updates
                // If checking specifically for restore (deletedAt setting to null), we let it pass
                // But generally we also want to ensure we're finding a non-deleted item to update?
                // The previous middleware logic was:
                // if args.data.deletedAt !== null (implied undefined or value)
                // then filter deletedAt: null

                // If we are RESTORING (setting deletedAt: null), we must verify strict existence?
                // Or allows update on deleted items?
                // Usually update() on deleted item is allowed if we know ID.
                // But previous middleware added `deletedAt: null` to where clause UNLESS restoring.

                const isRestore = args.data?.deletedAt === null;

                if (!isRestore) {
                    if (args.where?.deletedAt === undefined) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                }

                return query(args);
            },

            async updateMany({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                const isRestore = args.data?.deletedAt === null;

                if (!isRestore) {
                    if (args.where?.deletedAt === undefined) {
                        args.where = { ...args.where, deletedAt: null };
                    }
                }

                return query(args);
            },

            async delete({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                // Intercept delete -> update
                return basePrisma[getDelegate(model)].update({
                    ...args,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },

            async deleteMany({ model, operation, args, query }) {
                if (!modelsWithSoftDelete.includes(model)) {
                    return query(args);
                }

                // Intercept deleteMany -> updateMany
                return basePrisma[getDelegate(model)].updateMany({
                    ...args,
                    data: {
                        deletedAt: new Date(),
                    },
                });
            },
        },
    },
});

module.exports = prisma;
