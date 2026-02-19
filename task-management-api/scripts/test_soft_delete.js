const prisma = require("../src/config/prisma");

async function main() {
    const user = await prisma.user.findFirst();

    if (!user) {
        console.log("No user found. Create a user first.");
        return;
    }

    const project = await prisma.project.create({
        data: {
            name: "Soft Delete Test",
            ownerId: user.id
        }
    });

    console.log("Created:", project.id);

    await prisma.project.delete({
        where: { id: project.id }
    });

    console.log("Deleted (soft)");

    const result = await prisma.project.findUnique({
        where: { id: project.id }
    });

    console.log("FindUnique result:", result);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
