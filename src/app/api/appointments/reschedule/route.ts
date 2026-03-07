import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId, newRequestedTime } = body;

        const patient = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { patientProfile: true }
        });

        if (!patient || !patient.patientProfile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId }
        });

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (appointment.patientId !== patient.patientProfile.id) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        if (appointment.status !== 'BOOKED') {
            return NextResponse.json({ error: "Only booked appointments can be rescheduled" }, { status: 400 });
        }

        // Reschedule Quota Check
        if (appointment.rescheduleCount >= 2) {
            return NextResponse.json({ error: "You have exhausted your 2 maximum reschedules." }, { status: 400 });
        }

        return await prisma.$transaction(async (tx) => {
            // Keep the old booking number when user reschedules? Wait, no.
            // "The user can reschedule up to 2 times of their own accord.
            // Missing an appointment... system automatically makes a new booking... with newly generated lower priority number.
            // Doing this counts against their 2-reschedule quota."
            // So user initiated reschedule MUST retain their queue position? Or get a new one?
            // Typically, standard rescheduling gives you a new spot for that new time but wait... if you booked yesterday for 5PM, and now you want 6PM, your number is still `#1`. You keep your number.

            const updated = await tx.appointment.update({
                where: { id: appointmentId },
                data: {
                    requestedTime: new Date(newRequestedTime),
                    rescheduleCount: appointment.rescheduleCount + 1,
                    status: 'RESCHEDULED',
                    updatedAt: new Date()
                }
            });

            return NextResponse.json({ success: true, appointment: updated });
        });

    } catch (e: any) {
        console.error("Reschedule Error:", e);
        return NextResponse.json({ error: e.message || "Failed to reschedule" }, { status: 500 });
    }
}
