import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { doctorProfileId, startTime, endTime, type } = body;

        if (!doctorProfileId || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const doc = await prisma.doctorProfile.findUnique({
            where: { id: doctorProfileId }
        });

        if (!doc) {
            return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
        }

        if (!doc.openingTime || !doc.closingTime) {
            return NextResponse.json({ error: 'Doctor has not validated their time settings.' }, { status: 400 });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        const startMins = start.getHours() * 60 + start.getMinutes();
        const endMins = end.getHours() * 60 + end.getMinutes();

        const [openH, openM] = doc.openingTime.split(':').map(Number);
        const [closeH, closeM] = doc.closingTime.split(':').map(Number);

        const openMins = openH * 60 + openM;
        const closeMins = closeH * 60 + closeM;

        if (startMins < openMins || endMins > closeMins) {
            return NextResponse.json({ error: 'Slot falls outside doctor operating hours.' }, { status: 400 });
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
