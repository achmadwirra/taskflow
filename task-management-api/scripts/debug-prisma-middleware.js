const prisma = require('../src/config/prisma');

async function main() {
    try {
        console.log("Attempting findUnique...");
        // We expect this to be converted to findFirst by the middleware
        // passing a random UUID
        const result = await prisma.project.findUnique({
            where: { id: "123e4567-e89b-12d3-a456-426614174000" }
        });
        console.log("Success! Result:", result);
    } catch (e) {
        console.error("Caught error:");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
