const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const doctor = await prisma.doctorProfile.findFirst({
        select: {
            id: true,
            bio: true,
            achievements: true,
            specialization: true,
            rating: true,
            reviews: true,
            consultationFee: true
        }
    });
    console.log(JSON.stringify(doctor, null, 2));
}

main()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
