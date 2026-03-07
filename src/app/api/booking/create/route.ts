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
        const estimatedDuration = Math.max(10, Math.min(60, (issueStr.length % 30) + 10)); // 10 to 40 mins

        // Transaction to ensure atomic booking number generation
        const appointment = await prisma.$transaction(async (tx) => {
            const maxBookingNum = await tx.appointment.aggregate({
                where: { doctorId },
                _max: { bookingNumber: true }
            });

            const newBookingNumber = (maxBookingNum._max.bookingNumber || 0) + 1;

            const doc = await tx.doctorProfile.findUnique({
                where: { id: doctorId }
            });

            if (!doc) {
                throw new Error("Doctor not found");
            }

            const partialFee = doc.consultationFee * 0.2; // 20% upfront

            return await tx.appointment.create({
                data: {
                    patientId: patient.patientProfile.id,
                    doctorId,
                    bookingNumber: newBookingNumber,
                    requestedTime: reqTime,
                    estimatedDuration,
                    status: 'BOOKED',
                    type: type === 'digital' ? 'ONLINE' : 'OFFLINE',
                    issueDescription,
                    amountPaid: partialFee,
                    totalCost: doc.consultationFee
                }
            });
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
