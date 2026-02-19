const prisma = require("../src/config/prisma");

async function main() {
    const projects = await prisma.project.findMany();
    console.log("Prisma project count:", projects.length);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
