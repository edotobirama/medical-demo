const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');
    // Cleanup Services
    try {
        await prisma.service.deleteMany({});
        console.log('Cleared existing services.');
    } catch (e) {
        console.log('No services to clear or error clearing:', e.message);
    }

    // SEED SERVICES FIRST & EXIT (Temporary fix)
    console.log('Seeding services...');
    await prisma.service.createMany({
        data: [
            {
                name: 'General Consultation',
                description: 'Basic health checkup and consultation with a general physician.',
                category: 'CONSULTATION',
                price: 50,
                duration: 30,
                image: '/images/doctor-sarah.jpg'
            },
            {
                name: 'Full Body Checkup',
                description: 'Comprehensive health screening including blood tests, ECG, and vitals.',
                category: 'CHECKUP',
                price: 150,
                duration: 60,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'MRI Scan',
                description: 'High-resolution magnetic resonance imaging for detailed body analysis.',
                category: 'SCAN',
                price: 300,
                duration: 45,
                image: '/images/services/infrastructure_mri.png'
            },
            {
                name: 'Cardiology Screening',
                description: 'Specialized heart health assessment including Echo and TMT.',
                category: 'CHECKUP',
                price: 200,
                duration: 45,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'Blood Test (CBC)',
                description: 'Complete blood count analysis.',
                category: 'LAB',
                price: 20,
                duration: 10,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'Dental Cleaning',
                description: 'Professional teeth cleaning and scaling.',
                category: 'TREATMENT',
                price: 80,
                duration: 45,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'X-Ray (Chest)',
                description: 'Digital X-Ray imaging for chest and lungs.',
                category: 'SCAN',
                price: 60,
                duration: 15,
                image: '/images/services/infrastructure_mri.png'
            },
            {
                name: 'Root Canal Treatment',
                description: 'Endodontic therapy for infected tooth pulp.',
                category: 'TREATMENT',
                price: 350,
                duration: 90,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'Physical Therapy Session',
                description: 'Rehabilitation session with a certified physiotherapist.',
                category: 'TREATMENT',
                price: 75,
                duration: 60,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'Advanced Operation Theater',
                description: 'State of the art sterile surgery rooms equipped for complex procedures.',
                category: 'INFRASTRUCTURE',
                price: 0,
                duration: 0,
                image: '/images/services/treatment_surgery.png'
            },
            {
                name: 'Dialysis Center',
                description: '24/7 Dialysis support with comfortable seating and monitoring.',
                category: 'INFRASTRUCTURE',
                price: 100,
                duration: 240,
                image: '/images/services/infrastructure_mri.png'
            }
        ]
    });

    console.log('Seeding Programs...');
    try {
        await prisma.program.deleteMany({});
    } catch (e) { }

    await prisma.program.createMany({
        data: [
            {
                title: 'Community Wellness Day',
                description: 'Free yoga, meditation, and health checkups in our hospital garden.',
                date: new Date(new Date().setDate(new Date().getDate() + 7)), // 1 week from now
                image: '/images/services/event_wellness.png',
                location: 'Hospital Garden'
            },
            {
                title: 'Blood Donation Camp',
                description: 'Join us in saving lives. Every drop counts.',
                date: new Date(new Date().setDate(new Date().getDate() + 14)),
                image: '/images/services/treatment_surgery.png',
                location: 'Main Hall'
            },
            {
                title: 'Child Nutrition Workshop',
                description: 'Expert advice for parents on healthy eating habits for kids.',
                date: new Date(new Date().setDate(new Date().getDate() + 21)),
                image: '/images/services/event_wellness.png',
                location: 'Conference Room B'
            }
        ]
    });

    console.log('Services and Programs seeded. Exiting.');
    return; // SKIP THE REST FOR NOW

    const password = await bcrypt.hash('password123', 10);

    // 1. Create Patient
    const patient = await prisma.user.upsert({
        where: { email: 'patient@hospital.com' },
        update: {},
        create: {
            email: 'patient@hospital.com',
            name: 'John Doe',
            password,
            role: 'PATIENT',
            patientProfile: {
                create: {
                    dateOfBirth: new Date('1990-01-01'),
                    gender: 'Male',
                    address: '123 Main St',
                },
            },
        },
    });

    // 2. Create Doctors
    // Doctor A: Cardiologist
    const doctor1 = await prisma.user.upsert({
        where: { email: 'doctor@hospital.com' },
        update: {},
        create: {
            email: 'doctor@hospital.com',
            name: 'Dr. Sarah Wilson',
            password,
            role: 'DOCTOR',
            image: '/images/doctor-sarah.jpg',
            doctorProfile: {
                create: {
                    specialization: 'Cardiology',
                    department: 'Cardiology',
                    licenseNumber: 'CARD-101',
                    consultationFee: 150,
                    bio: 'Expert in interventional cardiology with 15 years experience.',
                    achievements: JSON.stringify(['Top Doctor 2025', 'Published 50+ Papers']),
                    slots: {
                        create: [
                            {
                                startTime: new Date(new Date().setHours(10, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(11, 0, 0, 0)),
                                status: 'AVAILABLE'
                            },
                            {
                                startTime: new Date(new Date().setHours(11, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(12, 0, 0, 0)),
                                status: 'AVAILABLE'
                            },
                            {
                                startTime: new Date(new Date().setHours(14, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(15, 0, 0, 0)),
                                status: 'BOOKED'
                            }
                        ]
                    }
                },
            },
        },
    });

    // Doctor B: Neurologist
    const doctor2 = await prisma.user.upsert({
        where: { email: 'neuro@hospital.com' },
        update: {},
        create: {
            email: 'neuro@hospital.com',
            name: 'Dr. James Chen',
            password,
            role: 'DOCTOR',
            image: '/images/doctor-james.jpg',
            doctorProfile: {
                create: {
                    specialization: 'Neurology',
                    department: 'Neurology',
                    licenseNumber: 'NEURO-202',
                    consultationFee: 200,
                    bio: 'Specializing in complex neurosurgery and cognitive health.',
                    achievements: JSON.stringify(['Best Surgeon Award', 'Chief of Neurology']),
                    /*
                    slots: {
                          create: [
                              {
                                  startTime: new Date(new Date().setHours(9, 0, 0, 0)),
                                  endTime: new Date(new Date().setHours(10, 0, 0, 0)),
                                  status: 'AVAILABLE'
                              },
                              {
                                  startTime: new Date(new Date().setHours(15, 0, 0, 0)),
                                  endTime: new Date(new Date().setHours(16, 0, 0, 0)),
                                  status: 'AVAILABLE'
                              }
                          ]
                      }
                      */
                },
            },
        },
    });

    // 3. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@hospital.com' },
        update: {},
        create: {
            email: 'admin@hospital.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    });

    // 4. Create Services
    // ... code is safe as I didn't add waitlist to seed yet ...
    await prisma.service.createMany({
        data: [
            {
                name: 'General Consultation',
                description: 'Basic health checkup and consultation with a general physician.',
                category: 'CONSULTATION',
                price: 50,
                duration: 30,
            },
            {
                name: 'Full Body Checkup',
                description: 'Comprehensive health screening including blood tests, ECG, and vitals.',
                category: 'CHECKUP',
                price: 150,
                duration: 60,
            },
            {
                name: 'MRI Scan',
                description: 'High-resolution magnetic resonance imaging for detailed body analysis.',
                category: 'SCAN',
                price: 300,
                duration: 45,
            },
            {
                name: 'Cardiology Screening',
                description: 'Specialized heart health assessment including Echo and TMT.',
                category: 'CHECKUP',
                price: 200,
                duration: 45,
            },
            {
                name: 'Blood Test (CBC)',
                description: 'Complete blood count analysis.',
                category: 'LAB',
                price: 20,
                duration: 10,
            },
            {
                name: 'Dental Cleaning',
                description: 'Professional teeth cleaning and scaling.',
                category: 'TREATMENT',
                price: 80,
                duration: 45,
            },
            {
                name: 'X-Ray (Chest)',
                description: 'Digital X-Ray imaging for chest and lungs.',
                category: 'SCAN',
                price: 60,
                duration: 15,
            },
            {
                name: 'Root Canal Treatment',
                description: 'Endodontic therapy for infected tooth pulp.',
                category: 'TREATMENT',
                price: 350,
                duration: 90,
            },
            {
                name: 'Physical Therapy Session',
                description: 'Rehabilitation session with a certified physiotherapist.',
                category: 'TREATMENT',
                price: 75,
                duration: 60,
            },
            {
                name: 'Dermatology Consultation',
                description: 'Skin health analysis and acne treatment planning.',
                category: 'CONSULTATION',
                price: 90,
                duration: 30,
            },
            {
                name: 'CT Scan (Head)',
                description: 'Computed Tomography scan for detailed brain imaging.',
                category: 'SCAN',
                price: 250,
                duration: 30,
            },
            {
                name: 'Nutrition Counseling',
                description: 'Personalized diet plan and nutritional advice.',
                category: 'CONSULTATION',
                price: 60,
                duration: 45,
            }
        ]
    });

    console.log('Seeding completed successfully.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
