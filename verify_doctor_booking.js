const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDoctorSlots() {
    // 1. Get a doctor
    const doctor = await prisma.doctorProfile.findFirst({
        include: { user: true }
    });

    if (!doctor) {
        console.error("No doctor found");
        return;
    }

    console.log(`Checking slots for Dr. ${doctor.user.name} (${doctor.id})...`);

    // 2. Fetch slots via API simulation (DB query mirroring API logic)
    const today = new Date();
    // API logic uses filtered dates
    const slots = await prisma.slot.findMany({
        where: {
            doctorId: doctor.id,
            status: 'AVAILABLE',
            startTime: { gte: today }
        }
    });

    console.log(`Found ${slots.length} available future slots for this doctor.`);
    if (slots.length > 0) {
        console.log("Sample slot:", slots[0].startTime);
    } else {
        console.warn("No slots found! Widget might show empty state.");
    }
}

checkDoctorSlots()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
