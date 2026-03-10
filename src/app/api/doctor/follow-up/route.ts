import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST: Doctor creates a follow-up appointment for a patient
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Only doctors can book follow-up appointments' }, { status: 403 });
        }

        const body = await req.json();
        const { patientId, doctorId, requestedTime, type, notes } = body;

        if (!patientId || !doctorId || !requestedTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Verify the doctor is the logged-in user
        const doctorUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { doctorProfile: true }
        });

        if (!doctorUser?.doctorProfile || doctorUser.doctorProfile.id !== doctorId) {
            return NextResponse.json({ error: 'Doctor profile mismatch' }, { status: 403 });
        }

        // Verify patient exists
        const patient = await prisma.patientProfile.findUnique({
            where: { id: patientId }
        });

        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        const reqTime = new Date(requestedTime);
        const dayStart = new Date(reqTime);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(reqTime);
        dayEnd.setHours(23, 59, 59, 999);

        const appointment = await prisma.$transaction(async (tx) => {
            // Get next booking number for the day
            const maxBookingNum = await tx.appointment.aggregate({
                where: {
                    doctorId,
                    requestedTime: {
                        gte: dayStart,
                        lte: dayEnd
                    }
                },
                _max: { bookingNumber: true }
            });

            const newBookingNumber = (maxBookingNum._max.bookingNumber || 0) + 1;
            const appointmentType = type || 'OFFLINE';

            const newAppointment = await tx.appointment.create({
                data: {
                    patientId,
                    doctorId,
                    bookingNumber: newBookingNumber,
                    requestedTime: reqTime,
                    estimatedDuration: 20, // Default follow-up duration
                    status: 'BOOKED',
                    type: appointmentType,
                    issueDescription: `Follow-up appointment booked by doctor`,
                    historyNotes: notes || '',
                    amountPaid: 0, // Doctor-initiated follow-ups are pre-authorized
                    totalCost: doctorUser.doctorProfile!.consultationFee
                }
            });

            // Generate meeting link for online consultations
            if (appointmentType === 'ONLINE') {
                return await tx.appointment.update({
                    where: { id: newAppointment.id },
                    data: { meetingLink: `/video/${newAppointment.id}` }
                });
            }

            return newAppointment;
        });

        return NextResponse.json({
            success: true,
            appointment,
            message: 'Follow-up appointment created successfully.'
        });

    } catch (e: any) {
        console.error('Follow-up booking error:', e);
        return NextResponse.json({ error: e.message || 'Failed to create follow-up' }, { status: 500 });
    }
}
