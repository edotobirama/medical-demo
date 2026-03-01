
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const doctorId = searchParams.get('doctorId');

        if (!doctorId) {
            // If no doctor ID, maybe return global stats or error? 
            // For now, let's require doctorId for this specific feature request
            return NextResponse.json({ error: 'Doctor ID required' }, { status: 400 });
        }

        const count = await prisma.waitlistEntry.count({
            where: {
                doctorId: doctorId,
                status: 'WAITING'
            }
        });

        // Estimate 20 mins per patient
        const estimatedTime = count * 20;

        return NextResponse.json({ count, estimatedTime });
    } catch (error) {
        console.error("Waitlist API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
    }
}
