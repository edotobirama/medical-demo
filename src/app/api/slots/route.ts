import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addDays } from 'date-fns';

export async function GET(request: Request) {
    try {
        // Fetch today's slots for now, or use query params
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(addDays(today, 7)); // Next 7 days

        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get('doctorId');

        const whereClause: any = {
            status: 'AVAILABLE',
            startTime: {
                gte: new Date(),
                lte: end
            }
        };

        if (doctorId) {
            whereClause.doctorId = doctorId;
        }

        const slots = await prisma.slot.findMany({
            where: whereClause,
            include: {
                doctor: {
                    include: { user: true }
                }
            },
            orderBy: {
                startTime: 'asc'
            }
        });

        return NextResponse.json(slots);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
    }
}
