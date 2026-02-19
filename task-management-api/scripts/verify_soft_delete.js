require("dotenv").config();
const prisma = require("../src/config/prisma");

async function main() {
    console.log("Starting Soft Delete Verification...");

    // 1. Create a User
    const user = await prisma.user.create({
        data: {
            name: "Test User",
            email: `test${Date.now()}@example.com`,
            password: "password123"
        }
    });
    console.log("User created:", user.id);

    // 2. Create a Project
    const project = await prisma.project.create({
        data: {
            name: "Test Project",
            ownerId: user.id
        }
    });
    console.log("Project created:", project.id);

    // 3. Verify Project exists
    const p1 = await prisma.project.findUnique({ where: { id: project.id } });
    if (!p1) throw new Error("Project should exist");
    console.log("Project found via findUnique");

    // 4. Soft Delete (using Prisma delete to test middleware interception)
    console.log("Deleting project...");
    await prisma.project.delete({ where: { id: project.id } });
    console.log("Project deleted (middleware should have converted this to update)");

    // 5. Verify Project is NOT found
    const p2 = await prisma.project.findUnique({ where: { id: project.id } });
    if (p2) throw new Error("Project should NOT be found after soft delete");
    console.log("Project correctly NOT found via findUnique");

    // 6. Verify Project exists in DB (bypass filter)
    // We strictly need to bypass the middleware filter. 
    // Middleware checks: if (params.args.where.deletedAt === undefined)
    // So distinct deletedAt checking (even checking not null) should bypass injection of null.
    // However, findUnique arguments are strict. We must use findFirst to pass complex where.
    const p3 = await prisma.project.findFirst({
        where: {
            id: project.id,
            deletedAt: { not: null }
        }
    });

    if (!p3) throw new Error("Project should exist in DB with deletedAt timestamp");
    console.log("Project found in DB with deletedAt timestamp:", p3.deletedAt);

    console.log("SUCCESS: Soft delete verification passed!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
