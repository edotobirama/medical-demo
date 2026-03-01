const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
    console.log('🔍 Verifying Data...');

    // 1. Check Seeding
    const patient = await prisma.user.findUnique({
        where: { email: 'alex@patient.com' },
        include: { patientProfile: { include: { appointments: true } } }
    });
    console.log(`Patient: ${patient?.name} (Seeded)`);
    console.log(`Appointments: ${patient?.patientProfile?.appointments.length} (Should be >= 1)`);

    const doctors = await prisma.user.count({ where: { role: 'DOCTOR' } });
    console.log(`Doctors Count: ${doctors} (Should be 3)`);

    const slots = await prisma.slot.count({ where: { status: 'AVAILABLE' } });
    console.log(`Available Slots: ${slots} (Should be many)`);

    // 2. Check Services
    const services = await prisma.service.count();
    console.log(`Services Count: ${services}`);

    if (patient?.patientProfile?.appointments.length > 0 && doctors > 0 && slots > 0) {
        console.log('✅ Final Verification Passed!');
    } else {
        console.error('❌ Verification Failed - Missing Data');
        process.exit(1);
    }
}

verify()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
