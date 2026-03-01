const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugBooking() {
    console.log('🔍 Debugging Booking Flow...');

    // 1. Find Patient
    const patient = await prisma.user.findUnique({
        where: { email: 'alex@patient.com' },
        include: { patientProfile: true }
    });

    if (!patient || !patient.patientProfile) {
        console.error('❌ Patient not found!');
        return;
    }
    console.log(`✅ Patient Found: ${patient.name} (${patient.patientProfile.id})`);

    // 2. Find Available Slot
    const slot = await prisma.slot.findFirst({
        where: { status: 'AVAILABLE' },
        include: { doctor: { include: { user: true } } }
    });

    if (!slot) {
        console.error('❌ No available slots!');
        return;
    }
    console.log(`✅ Slot Found: ${slot.id} - ${slot.startTime} (Dr. ${slot.doctor.user.name})`);

    // 3. Attempt Booking Transaction
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Re-fetch slot to ensure lock (simple check here)
            const s = await tx.slot.findUnique({ where: { id: slot.id } });
            if (!s || s.status !== 'AVAILABLE') throw new Error("Slot taken");

            const appointment = await tx.appointment.create({
                data: {
                    patientId: patient.patientProfile.id,
                    doctorId: slot.doctorId,
                    slotId: slot.id,
                    status: 'CONFIRMED',
                    type: 'OFFLINE'
                }
            });

            await tx.slot.update({
                where: { id: slot.id },
                data: { status: 'BOOKED' }
            });

            return appointment;
        });

        console.log('✅ Booking Successful!');
        console.log(result);

    } catch (error) {
        console.error('❌ Booking Failed:', error);
    }
}

debugBooking()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
