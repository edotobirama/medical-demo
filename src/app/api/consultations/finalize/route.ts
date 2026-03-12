import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const { appointmentId, notes, prescriptionUrl, aiSummary } = await req.json();

        if (!appointmentId) {
            return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { doctor: { include: { user: true } }, patient: true }
        });

        if (!appointment || appointment.doctor.userId !== session.user.id) {
            return NextResponse.json({ error: 'Invalid appointment' }, { status: 404 });
        }

        // Update appointment notes & status to COMPLETED
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                notes,
                status: 'COMPLETED'
            }
        });

        // Save the updated master AI summary for future sessions
        if (aiSummary) {
            await prisma.patientProfile.update({
                where: { id: appointment.patient.id },
                data: {
                    masterAiSummary: aiSummary,
                    lastSummaryUpdate: new Date()
                } as any
            });
        }

        // If a file URL was provided, create a MedicalReport for the patient
        if (prescriptionUrl) {
            await (prisma as any).medicalReport.create({
                data: {
                    patientId: appointment.patient.id,
                    uploadedById: session.user.id,
                    appointmentId: appointment.id,
                    title: `Prescription - ${new Date().toLocaleDateString()}`,
                    fileUrl: prescriptionUrl,
                    fileType: 'PRESCRIPTION',
                    aiSummary: aiSummary || ''
                }
            });
        }

        // Also create a digital report if Notes are filled
        if (notes && !prescriptionUrl) {
            await (prisma as any).medicalReport.create({
                data: {
                    patientId: appointment.patient.id,
                    uploadedById: session.user.id,
                    appointmentId: appointment.id,
                    title: `Digital Consultation Report - ${new Date().toLocaleDateString()}`,
                    fileUrl: '#', // Not a real file
                    fileType: 'DIGITAL_REPORT',
                    aiSummary: aiSummary || '',
                    aiPatientNotes: notes
                }
            });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Finalize consultation error:', e);
        return NextResponse.json({ error: e.message || 'Error finalizing' }, { status: 500 });
    }
}
