import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET: Check if patient already has a booking for a given date
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ hasBooking: false });
        }

        const url = new URL(req.url);
        const date = url.searchParams.get('date');

        if (!date) {
            return NextResponse.json({ hasBooking: false });
        }

        const patient = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { patientProfile: true }
        });

        if (!patient?.patientProfile) {
            return NextResponse.json({ hasBooking: false });
        }

        const dayStart = new Date(date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const existingBooking = await prisma.appointment.findFirst({
            where: {
                patientId: patient.patientProfile.id,
                status: { in: ['BOOKED', 'RESCHEDULED', 'TURN_ARRIVED', 'IN_PROGRESS'] },
                requestedTime: {
                    gte: dayStart,
                    lte: dayEnd
                }
            },
            include: {
                doctor: {
                    include: { user: true }
                }
            }
        });

        if (existingBooking) {
            return NextResponse.json({
                hasBooking: true,
                booking: {
                    id: existingBooking.id,
                    doctorName: existingBooking.doctor.user.name,
                    requestedTime: existingBooking.requestedTime,
                    status: existingBooking.status,
                    type: existingBooking.type
                }
            });
        }

        return NextResponse.json({ hasBooking: false });
    } catch (e: any) {
        console.error('Booking check error:', e);
        return NextResponse.json({ hasBooking: false });
    }
}
