const { PrismaClient } = require('@prisma/client');
const { addDays, startOfHour, setHours } = require('date-fns');

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Future Slots...");

    // 1. Get all doctors
    const doctors = await prisma.doctorProfile.findMany();
    if (doctors.length === 0) {
        console.error("No doctors found! Please seed doctors first.");
        return;
    }
    console.log(`Found ${doctors.length} doctors.`);

    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfter = addDays(today, 2);

    // 2. Create slots for tomorrow and day after
    // Schedule: 9 AM to 5 PM
    const startHour = 9;
    const endHour = 17;

    let totalSlots = 0;

    for (const doctor of doctors) {
        for (const date of [tomorrow, dayAfter]) {
            for (let hour = startHour; hour < endHour; hour++) {
                // Ensure date object is set to specific hour
                const slotTime = setHours(startOfHour(date), hour);

                // Create slot
                await prisma.slot.create({
                    data: {
                        doctorId: doctor.id,
                        startTime: slotTime,
                        endTime: new Date(slotTime.getTime() + 30 * 60000), // 30 mins
                        status: 'AVAILABLE',
                        type: 'OFFLINE'
                    }
                });
                totalSlots++;
            }
        }
    }

    console.log(`✅ Automatically created ${totalSlots} future slots for the next 2 days.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
