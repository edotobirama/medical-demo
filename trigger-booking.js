const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function trigger() {
    // 1. Get a slot
    const slot = await prisma.slot.findFirst({
        where: { status: 'AVAILABLE' }
    });

    if (!slot) {
        console.error("No slots available to test");
        return;
    }

    console.log("Attempting to book slot via API:", slot.id);

    // 2. Call API
    const response = await fetch('http://localhost:3001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            slotId: slot.id,
            type: 'digital'
        })
    });

    const data = await response.json();
    console.log("API Response:", response.status, data);
}

trigger()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
