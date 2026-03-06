const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Program images...");

    const programImageMap = {
        'Community Wellness Day': '/images/services/event_wellness_new.png',
        'Blood Donation Camp': '/images/services/event_blood_donation.png',
        'Child Nutrition Workshop': '/images/services/event_nutrition.png',
    };

    const progs = await prisma.program.findMany();
    for (const p of progs) {
        const newImg = programImageMap[p.title] || '/images/services/event_wellness_new.png';
        await prisma.program.update({
            where: { id: p.id },
            data: { image: newImg }
        });
        console.log(`Fixed Program: ${p.title} -> ${newImg}`);
    }

    console.log("All program images are now unique!");
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
