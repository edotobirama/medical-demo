import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doctorId, requestedTime, type, issueDescription } = body;

        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const patient = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { patientProfile: true }
        });

        if (!patient || !patient.patientProfile) {
            return NextResponse.json({ error: "Patient profile not found" }, { status: 404 });
        }

        const reqTime = new Date(requestedTime);
        const issueStr = issueDescription || "general";
        const estimatedDuration = Math.max(10, Math.min(60, (issueStr.length % 30) + 10));

        // Build day boundaries for the requested date (daily scoping)
        const dayStart = new Date(reqTime);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(reqTime);
        dayEnd.setHours(23, 59, 59, 999);

        // Transaction to ensure atomic booking number generation
        const appointment = await prisma.$transaction(async (tx) => {
            // Get max booking number for THIS DAY only (daily reset)
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

            const doc = await tx.doctorProfile.findUnique({
                where: { id: doctorId }
            });

            if (!doc) {
                throw new Error("Doctor not found");
            }

            if (!doc.openingTime || !doc.closingTime) {
                throw new Error("Doctor has not validated their time settings.");
            }

            const [openH, openM] = doc.openingTime.split(':').map(Number);
            const [closeH, closeM] = doc.closingTime.split(':').map(Number);
            const openMins = openH * 60 + openM;
            const closeMins = closeH * 60 + closeM;

            const startMins = reqTime.getHours() * 60 + reqTime.getMinutes();
            const endMins = startMins + estimatedDuration;

            if (startMins < openMins || endMins > closeMins) {
                throw new Error("Appointment falls outside doctor's operating hours.");
            }

            // Check for overlapping slots — prevent double booking at the same time
            const overlapping = await tx.appointment.findFirst({
                where: {
                    doctorId,
                    status: { in: ['BOOKED', 'RESCHEDULED', 'TURN_ARRIVED', 'IN_PROGRESS'] },
                    requestedTime: reqTime
                }
            });

            if (overlapping) {
                throw new Error("This exact time slot is already taken. Please select a different time.");
            }

            const partialFee = doc.consultationFee * 0.2; // 20% upfront
            const appointmentType = type === 'digital' ? 'ONLINE' : 'OFFLINE';

            const newAppointment = await tx.appointment.create({
                data: {
                    patientId: patient.patientProfile!.id,
                    doctorId,
                    bookingNumber: newBookingNumber,
                    requestedTime: reqTime,
                    estimatedDuration,
                    status: 'BOOKED',
                    type: appointmentType,
                    issueDescription,
                    amountPaid: partialFee,
                    totalCost: doc.consultationFee
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
            message: "Booking confirmed. Partial fee recorded."
        });

    } catch (e: any) {
        console.error("Booking Creation Failed:", e);
        return NextResponse.json({ error: e.message || "Failed to book" }, { status: 400 });
    }
}
