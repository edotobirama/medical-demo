import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET: Search patients by name or email (doctor-only)
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const url = new URL(req.url);
        const query = url.searchParams.get('q') || '';

        if (query.length < 2) {
            return NextResponse.json({ patients: [] });
        }

        // Search by name or email
        const users = await prisma.user.findMany({
            where: {
                role: 'PATIENT',
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } }
                ]
            },
            include: {
                patientProfile: {
                    include: {
                        _count: {
                            select: { appointments: true }
                        }
                    }
                }
            },
            take: 10
        });

        const patients = users
            .filter(u => u.patientProfile)
            .map(u => ({
                id: u.patientProfile!.id,
                userId: u.id,
                userName: u.name || 'Unknown',
                userEmail: u.email,
                gender: u.patientProfile!.gender,
                bloodGroup: u.patientProfile!.bloodGroup,
                appointmentCount: u.patientProfile!._count.appointments
            }));

        return NextResponse.json({ patients });
    } catch (e: any) {
        console.error('Patient search error:', e);
        return NextResponse.json({ error: e.message || 'Search failed' }, { status: 500 });
    }
}
