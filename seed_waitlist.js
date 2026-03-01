
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding waitlist entries...');

    // Get all doctor profiles
    const doctors = await prisma.doctorProfile.findMany();

    if (doctors.length === 0) {
        console.log('No doctor profiles found. Please seed users/doctors first.');
        return;
    }

    // Clear existing waitlist entries to avoid duplicates/mess
    await prisma.waitlistEntry.deleteMany({});
    console.log('Cleared existing waitlist entries.');

    // Create fake patients (names)
    const fakePatients = [
        "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown", "Charlie Davis",
        "Eva Wilson", "Frank Miller", "Grace Taylor", "Henry Anderson", "Ivy Thomas"
    ];

    for (const doctor of doctors) {
        // Determine a random number of people in the waitlist (0 to 8)
        const count = Math.floor(Math.random() * 9);

        console.log(`Adding ${count} patients to waitlist for doctor ${doctor.id}`);

        for (let i = 0; i < count; i++) {
            // We need a valid patient ID. Since we might not have enough users, 
            // we'll fetch a random user to be the "patient" or create a placeholder if needed.
            // Ideally, in a real seeded DB, we have patients. 
            // Let's assume we have at least one user to link to, or create dummy profiles.

            // For simplicity in this demo, let's just find the first available user who is NOT this doctor 
            // (though self-booking is possible in this simple schema).
            // A better approach: Create a dummy patient profile on the fly if needed?
            // No, that's complex. Let's just pick a random user from DB.

            const randomUser = await prisma.user.findFirst({
                skip: Math.floor(Math.random() * 1), // Just pick the first one for now to ensure it exists
            });

            if (!randomUser) continue;

            // Ensure patient profile exists
            let patientProfile = await prisma.patientProfile.findUnique({
                where: { userId: randomUser.id }
            });

            if (!patientProfile) {
                patientProfile = await prisma.patientProfile.create({
                    data: { userId: randomUser.id }
                });
            }

            await prisma.waitlistEntry.create({
                data: {
                    patientId: patientProfile.id,
                    doctorId: doctor.id,
                    status: 'WAITING',
                    position: i + 1,
                    // We'll trust the ID generation
                }
            });
        }
    }

    console.log('Waitlist seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
