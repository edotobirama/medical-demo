import { PrismaClient } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting to seed 30 test patients and appointments for Sarah Wilson...');

    // 1. Find Dr. Sarah Wilson
    const sarahUser = await prisma.user.findFirst({
        where: {
            name: {
                contains: 'Sarah Wilson'
            },
            role: 'DOCTOR'
        }
    });

    if (!sarahUser) {
        console.error('CRITICAL ERROR: Could not find Dr. Sarah Wilson in the database.');
        process.exit(1);
    }

    const doctorProfile = await prisma.doctorProfile.findUnique({
        where: {
            userId: sarahUser.id
        }
    });

    if (!doctorProfile) {
        console.error('CRITICAL ERROR: Dr. Sarah Wilson does not have a doctor profile.');
        process.exit(1);
    }

    console.log(`Found Dr. Sarah Wilson (Doctor Profile ID: ${doctorProfile.id})`);

    // 2. Clear previous test patients if they exist (cleanup strategy based on user prompt request)
    console.log('Cleaning up old test patients if any...');
    const deletedAppointments = await prisma.appointment.deleteMany({
        where: {
            patient: {
                user: {
                    email: { startsWith: 'testpatient_sarah_' }
                }
            }
        }
    });

    const deletedProfiles = await prisma.patientProfile.deleteMany({
        where: {
            user: {
                email: { startsWith: 'testpatient_sarah_' }
            }
        }
    });

    const deletedUsers = await prisma.user.deleteMany({
        where: {
            email: { startsWith: 'testpatient_sarah_' }
        }
    });
    console.log(`Cleaned up: ${deletedAppointments.count} appointments, ${deletedProfiles.count} profiles, ${deletedUsers.count} users.`);

    // 3. Generate Patients and Appointments
    const passwordHash = await bcrypt.hash('password123', 10);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // We'll create appointments from 9:00 AM to 5:00 PM (8 hours = 480 mins)
    // 30 appointments -> ~16 mins each. We'll space them out by 15 mins.
    let currentApptTime = new Date(today);
    currentApptTime.setHours(9, 0, 0, 0); // Start at 9:00 AM today

    for (let i = 1; i <= 30; i++) {
        const patientName = `Test Patient ${i}`;
        const patientEmail = `testpatient_sarah_${i}@example.com`;

        // Create User & Profile
        const newUser = await prisma.user.create({
            data: {
                name: patientName,
                email: patientEmail,
                password: passwordHash,
                role: 'PATIENT',
                patientProfile: {
                    create: {
                        // Add some basic profile info if needed
                        bloodGroup: 'O+',
                        gender: i % 2 === 0 ? 'Female' : 'Male'
                    }
                }
            },
            include: {
                patientProfile: true
            }
        });

        // Calculate Times
        const requestedTimeStr = new Date(currentApptTime);
        const actualStartTimeStr = new Date(currentApptTime); // Assuming they start on time

        const endTime = new Date(currentApptTime);
        endTime.setMinutes(endTime.getMinutes() + 15); // 15 min duration

        const appointmentData: any = {
            patientId: newUser.patientProfile!.id,
            doctorId: doctorProfile.id,
            requestedTime: requestedTimeStr,
            actualStartTime: actualStartTimeStr,
            actualEndTime: null,
            estimatedDuration: 15, // 15 minutes
            amountPaid: 50.0, // dummy amount
            totalCost: 150.0,
            status: 'BOOKED',
            type: 'OFFLINE',
            issueDescription: `Test Booking for Patient ${i}`,
            bookingNumber: i + 1000,
        };

        // Create Appointment
        await prisma.appointment.create({
            data: appointmentData
        });

        console.log(`Created Patient ${i}: ${patientEmail} - Appt at ${requestedTimeStr.toLocaleTimeString()}`);

        // Increment time for next patient (15 mins)
        currentApptTime.setMinutes(currentApptTime.getMinutes() + 15);
    }

    console.log('\n✅ Successfully seeded 30 test patients and appointments for Sarah Wilson for today.');
    console.log('You can delete these later by running a script that deletes users where email starts with "testpatient_sarah_"');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
