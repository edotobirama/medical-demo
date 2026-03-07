import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const doctorId = url.searchParams.get('doctorId');

        if (!doctorId) {
            return NextResponse.json({ error: "Missing doctorId" }, { status: 400 });
        }

        const now = new Date();
        const tomorrowEnd = new Date(now);
        tomorrowEnd.setDate(tomorrowEnd.getDate() + 2);
        tomorrowEnd.setHours(0, 0, 0, 0);

        // Fetch pending/active appointments
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                status: {
                    in: ["BOOKED", "RESCHEDULED", "TURN_ARRIVED", "IN_PROGRESS"]
                },
                requestedTime: {
                    gte: new Date(now.setHours(0, 0, 0, 0)),
                    lt: tomorrowEnd
                }
            },
            orderBy: {
                requestedTime: 'asc'
            }
        });

        // Group by hour
        const hourlyGroups: Record<string, any> = {};

        appointments.sort((a, b) => (a.bookingNumber || 0) - (b.bookingNumber || 0));

        appointments.forEach(app => {
            if (!app.requestedTime) return;

            const hourDate = new Date(app.requestedTime);
            hourDate.setMinutes(0, 0, 0);
            const hourStr = hourDate.toISOString();

            if (!hourlyGroups[hourStr]) {
                hourlyGroups[hourStr] = {
                    hour: hourStr,
                    bookings: [],
                    totalWaitlist: 0,
                    totalDuration: 0
                };
            }

            hourlyGroups[hourStr].bookings.push(app.bookingNumber);
            hourlyGroups[hourStr].totalWaitlist++;
            hourlyGroups[hourStr].totalDuration += (app.estimatedDuration || 15);
        });

        const formatted = Object.values(hourlyGroups)
            .sort((a: any, b: any) => new Date(a.hour).getTime() - new Date(b.hour).getTime())
            .map((g: any) => ({
                ...g,
                avgWaitTime: Math.max(0, g.totalDuration - 10) // Just a mock estimate for display
            }));

        return NextResponse.json(formatted);
    } catch (e: any) {
        console.error("Schedule API Error:", e);
        return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 });
    }
}
