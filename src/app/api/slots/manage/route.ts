import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { doctorProfileId, startTime, endTime, type } = body;

        if (!doctorProfileId || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const slot = await prisma.slot.create({
            data: {
                doctorId: doctorProfileId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                type: type || 'OFFLINE',
                status: 'AVAILABLE'
            }
        });

        return NextResponse.json({ message: 'Slot created successfully', slot }, { status: 201 });
    } catch (error) {
        console.error('Error creating slot:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
