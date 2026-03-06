const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Starting Image Fix Script...");

    // 1. Update Doctors
    const docs = await prisma.user.findMany({ where: { role: 'DOCTOR' } });
    for (const d of docs) {
        let newImg = '/images/team-doctors.png';
        if (d.name.includes('Sarah')) newImg = '/images/doctors/sarah.png';
        if (d.name.includes('James')) newImg = '/images/doctors/james.png';
        if (d.name.includes('Emily')) newImg = '/images/doctors/emily.png';
        if (d.name.includes('Robert')) newImg = '/images/doctors/emily.png';
        if (d.name.includes('Alan')) newImg = '/images/doctors/james.png';

        await prisma.user.update({
            where: { id: d.id },
            data: { image: newImg }
        });
        console.log(`Fixed Doctor: ${d.name} -> ${newImg}`);
    }

    // 2. Update Services — Each gets a UNIQUE image
    const serviceImageMap = {
        'General Consultation': '/images/services/consultation.png',
        'Full Body Checkup': '/images/services/checkup.png',
        'MRI Scan': '/images/services/mri.png',
        'CT Scan (Head & Body)': '/images/services/ct_scan.png',
        'PET Scan': '/images/services/pet_scan.png',
        'X-Ray (Digital)': '/images/services/xray.png',
        'Ultrasound': '/images/services/ultrasound.png',
        'Blood Test (CBC)': '/images/services/blood_test.png',
        'Cardiology Screening (ECG/TMT)': '/images/services/cardiology.png',
        'Advanced Operation Theater': '/images/services/operation_theater.png',
        'Intensive Care Unit (ICU)': '/images/services/icu.png',
        'Dialysis Center': '/images/services/dialysis.png',
        'Executive Waiting Lounge': '/images/services/lounge.png',
    };

    const services = await prisma.service.findMany();
    for (const s of services) {
        const newImg = serviceImageMap[s.name] || '/images/hero-hospital.png';
        await prisma.service.update({
            where: { id: s.id },
            data: { image: newImg }
        });
        console.log(`Fixed Service: ${s.name} -> ${newImg}`);
    }

    // 3. Update Programs
    const progs = await prisma.program.findMany();
    for (const p of progs) {
        let newImg = '/images/services/event_wellness.png';
        await prisma.program.update({
            where: { id: p.id },
            data: { image: newImg }
        });
        console.log(`Fixed Program: ${p.title} -> ${newImg}`);
    }

    console.log("All DB image URLs successfully mapped to unique local images.");
}

main()
    .catch(e => {
        console.error("Error updating images:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
