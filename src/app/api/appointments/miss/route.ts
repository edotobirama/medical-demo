import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        // typically triggered by Doctor or cron-job
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId } = body;

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (appointment.status !== 'TURN_ARRIVED' && appointment.status !== 'BOOKED') {
            return NextResponse.json({ error: "Cannot miss an appointment not pending or arrived" }, { status: 400 });
        }

        return await prisma.$transaction(async (tx) => {
            if (appointment.rescheduleCount >= 2) {
                // LOST
                const lostAppt = await tx.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        status: 'LOST',
                        updatedAt: new Date()
                    }
                });
                return NextResponse.json({ success: true, message: "Booking Lost", appointment: lostAppt });
            }

            // Generate new lower priority (higher booking number)
            const maxBookingNum = await tx.appointment.aggregate({
                where: { doctorId: appointment.doctorId },
                _max: { bookingNumber: true }
            });

            const newBookingNumber = (maxBookingNum._max.bookingNumber || 0) + 1;

            const rebookedAppt = await tx.appointment.update({
                where: { id: appointmentId },
                data: {
                    status: 'MISSED_BUT_REBOOKED',
                    bookingNumber: newBookingNumber,
                    rescheduleCount: appointment.rescheduleCount + 1,
                    updatedAt: new Date()
                }
            });

            return NextResponse.json({ success: true, message: "Missed and Auto-Rebooked at lower priority", appointment: rebookedAppt });
        });

    } catch (e: any) {
        console.error("Miss Appt Error:", e);
        return NextResponse.json({ error: e.message || "Failed to process miss" }, { status: 500 });
    }
}
