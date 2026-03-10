import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        // Verify the user is either the doctor or the patient
        const isDoctorUser = appointment.doctor.user.id === session.user.id;
        const isPatientUser = appointment.patient.user.id === session.user.id;

        if (!isDoctorUser && !isPatientUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        return NextResponse.json({
            id: appointment.id,
            doctorName: appointment.doctor.user.name || 'Doctor',
            patientName: appointment.patient.user.name || 'Patient',
            doctorImage: appointment.doctor.user.image,
            patientImage: appointment.patient.user.image,
            type: appointment.type,
            status: appointment.status,
            specialization: appointment.doctor.specialization,
            issueDescription: appointment.issueDescription,
            meetingLink: appointment.meetingLink,
            requestedTime: appointment.requestedTime,
            bookingNumber: appointment.bookingNumber
        });
    } catch (e: any) {
        console.error('Appointment fetch error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}
