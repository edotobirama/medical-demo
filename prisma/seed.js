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
            // Consultations
            {
                name: 'General Consultation',
                description: 'Basic health checkup and consultation with a general physician.',
                category: 'CONSULTATION',
                price: 50,
                duration: 30,
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Full Body Checkup',
                description: 'Comprehensive health screening including blood tests, ECG, and vitals.',
                category: 'CHECKUP',
                price: 150,
                duration: 60,
                image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
            },

            // Imaging & Scans
            {
                name: 'MRI Scan',
                description: 'High-resolution magnetic resonance imaging for detailed body analysis.',
                category: 'SCAN',
                price: 300,
                duration: 45,
                image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'CT Scan (Head & Body)',
                description: 'Computed Tomography scan for detailed 3D internal imaging.',
                category: 'SCAN',
                price: 250,
                duration: 30,
                image: 'https://images.unsplash.com/photo-1530497610245-94d3ce57e31d?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'PET Scan',
                description: 'Positron Emission Tomography for detecting cellular level metabolic changes.',
                category: 'SCAN',
                price: 450,
                duration: 60,
                image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'X-Ray (Digital)',
                description: 'Rapid digital X-Ray imaging for bones and chest.',
                category: 'SCAN',
                price: 60,
                duration: 15,
                image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Ultrasound',
                description: 'Non-invasive diagnostic imaging using high-frequency sounds.',
                category: 'SCAN',
                price: 100,
                duration: 20,
                image: 'https://images.unsplash.com/photo-1527613426400-9ce99653c82e?auto=format&fit=crop&w=800&q=80'
            },

            // Labs
            {
                name: 'Blood Test (CBC)',
                description: 'Complete blood count analysis.',
                category: 'LAB',
                price: 20,
                duration: 10,
                image: 'https://images.unsplash.com/photo-1579154492231-4a5f333918d6?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Cardiology Screening (ECG/TMT)',
                description: 'Specialized heart health assessment including Echo and TMT.',
                category: 'CHECKUP',
                price: 200,
                duration: 45,
                image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=800&q=80'
            },

            // Infrastructure
            {
                name: 'Advanced Operation Theater',
                description: 'State of the art sterile surgery rooms equipped for complex procedures.',
                category: 'INFRASTRUCTURE',
                price: 0,
                duration: 0,
                image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Intensive Care Unit (ICU)',
                description: '24/7 highly monitored critical care with dedicated nursing.',
                category: 'INFRASTRUCTURE',
                price: 500,
                duration: 1440,
                image: 'https://images.unsplash.com/photo-1583912265927-8cbaf12f9d51?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Dialysis Center',
                description: 'Comfortable 24/7 Dialysis support with entertainment screens.',
                category: 'INFRASTRUCTURE',
                price: 100,
                duration: 240,
                image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223f1e?auto=format&fit=crop&w=800&q=80'
            },
            {
                name: 'Executive Waiting Lounge',
                description: 'Premium waiting areas with complimentary refreshments and Wi-Fi.',
                category: 'INFRASTRUCTURE',
                price: 0,
                duration: 0,
                image: 'https://images.unsplash.com/photo-1510074377623-8cf13fb86fc8?auto=format&fit=crop&w=800&q=80'
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
                date: new Date(new Date().setDate(new Date().getDate() + 7)),
                image: 'https://images.unsplash.com/photo-1544367567-0f2feb0594a0?auto=format&fit=crop&w=800&q=80',
                location: 'Hospital Garden'
            },
            {
                title: 'Blood Donation Camp',
                description: 'Join us in saving lives. Every drop counts.',
                date: new Date(new Date().setDate(new Date().getDate() + 14)),
                image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
                location: 'Main Hall'
            },
            {
                title: 'Child Nutrition Workshop',
                description: 'Expert advice for parents on healthy eating habits for kids.',
                date: new Date(new Date().setDate(new Date().getDate() + 21)),
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
                location: 'Conference Room B'
            }
        ]
    });

    console.log('Services and Programs seeded. Next: users & doctors...'); const password = await bcrypt.hash('password123', 10);

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
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80',
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
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80',
            doctorProfile: {
                create: {
                    specialization: 'Neurology',
                    department: 'Neurology',
                    licenseNumber: 'NEURO-202',
                    consultationFee: 200,
                    bio: 'Specializing in complex neurosurgery and cognitive health.',
                    achievements: JSON.stringify(['Best Surgeon Award', 'Chief of Neurology']),
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
                },
            },
        },
    });

    // Doctor C: Orthopedics
    const doctor3 = await prisma.user.upsert({
        where: { email: 'ortho@hospital.com' },
        update: {},
        create: {
            email: 'ortho@hospital.com',
            name: 'Dr. Alan Davies',
            password,
            role: 'DOCTOR',
            image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
            doctorProfile: {
                create: {
                    specialization: 'Orthopedic Surgery',
                    department: 'Orthopedics',
                    licenseNumber: 'ORTHO-303',
                    consultationFee: 180,
                    bio: 'Renowned orthopedic surgeon focused on joint replacements and sports injuries.',
                    achievements: JSON.stringify(['Olympic Team Doctor', '10,000+ Surgeries']),
                    slots: {
                        create: [
                            {
                                startTime: new Date(new Date().setHours(12, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(13, 0, 0, 0)),
                                status: 'AVAILABLE'
                            },
                            {
                                startTime: new Date(new Date().setHours(16, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(17, 0, 0, 0)),
                                status: 'AVAILABLE'
                            }
                        ]
                    }
                },
            },
        },
    });

    // Doctor D: Ophthalmology
    const doctor4 = await prisma.user.upsert({
        where: { email: 'eye@hospital.com' },
        update: {},
        create: {
            email: 'eye@hospital.com',
            name: 'Dr. Emily Rostova',
            password,
            role: 'DOCTOR',
            image: 'https://images.unsplash.com/photo-1594824436998-0570b691079d?auto=format&fit=crop&w=800&q=80',
            doctorProfile: {
                create: {
                    specialization: 'Ophthalmology',
                    department: 'Eye Care',
                    licenseNumber: 'OPH-404',
                    consultationFee: 120,
                    bio: 'Expert in LASIK surgery and advanced retinal treatments.',
                    achievements: JSON.stringify(['Visionary Leader 2024', 'Laser Tech Pioneer']),
                    slots: {
                        create: [
                            {
                                startTime: new Date(new Date().setHours(8, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(9, 0, 0, 0)),
                                status: 'AVAILABLE'
                            },
                            {
                                startTime: new Date(new Date().setHours(13, 0, 0, 0)),
                                endTime: new Date(new Date().setHours(14, 0, 0, 0)),
                                status: 'AVAILABLE'
                            }
                        ]
                    }
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
