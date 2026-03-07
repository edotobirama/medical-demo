import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const doctors = await prisma.doctorProfile.findMany({
            where: { isAvailable: true },
            include: { user: true }
        });
        return NextResponse.json(doctors);
    } catch (e: any) {
        console.error("Doctors Fetch Error:", e);
        return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
    }
}
