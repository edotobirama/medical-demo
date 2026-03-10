import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET: Fetch patient documents for a specific appointment (doctor-only)
export async function GET(
    req: Request,
    { params }: { params: Promise<{ appointmentId: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { appointmentId } = await params;

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: {
                    include: {
                        medicalReports: {
                            orderBy: { createdAt: 'desc' },
                            take: 20
                        }
                    }
                }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        return NextResponse.json({
            documents: appointment.patient.medicalReports
        });
    } catch (e: any) {
        console.error('Patient docs fetch error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}
