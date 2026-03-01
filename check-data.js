const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.service.count();
        console.log(`count: ${count}`);
        const services = await prisma.service.findMany();
        console.log(JSON.stringify(services, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
