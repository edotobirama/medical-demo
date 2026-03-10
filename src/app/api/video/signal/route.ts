import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// In-memory call signaling store (in production, use Redis or a DB table)
// Maps appointmentId -> { status, initiatedAt, doctorName }
const callSignals = new Map<string, {
    status: 'RINGING' | 'CONNECTED' | 'ENDED' | 'MISSED';
    initiatedAt: number;
    doctorName: string;
    patientId: string;
    appointmentId: string;
}>();

// Clean up stale signals (older than 2 minutes)
function cleanupStaleSignals() {
    const now = Date.now();
    for (const [key, signal] of callSignals.entries()) {
        if (now - signal.initiatedAt > 120000) {
            if (signal.status === 'RINGING') {
                callSignals.set(key, { ...signal, status: 'MISSED' });
            }
            // Remove signals older than 5 minutes
            if (now - signal.initiatedAt > 300000) {
                callSignals.delete(key);
            }
        }
    }
}

// POST: Doctor initiates a call / updates signal
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId, action } = body;

        if (!appointmentId || !action) {
            return NextResponse.json({ error: 'Missing appointmentId or action' }, { status: 400 });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        cleanupStaleSignals();

        switch (action) {
            case 'INITIATE': {
                // Doctor starts the call
                if (session.user.role !== 'DOCTOR') {
                    return NextResponse.json({ error: 'Only doctors can initiate calls' }, { status: 403 });
                }

                callSignals.set(appointmentId, {
                    status: 'RINGING',
                    initiatedAt: Date.now(),
                    doctorName: appointment.doctor.user.name || 'Doctor',
                    patientId: appointment.patient.userId,
                    appointmentId
                });

                // Update appointment status if not already in progress
                if (appointment.status === 'BOOKED' || appointment.status === 'RESCHEDULED' || appointment.status === 'TURN_ARRIVED') {
                    await prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            status: 'IN_PROGRESS',
                            actualStartTime: appointment.actualStartTime || new Date(),
                            meetingLink: `/video/${appointmentId}`
                        }
                    });
                }

                return NextResponse.json({ success: true, status: 'RINGING' });
            }

            case 'ANSWER': {
                // Patient answers
                const signal = callSignals.get(appointmentId);
                if (signal) {
                    callSignals.set(appointmentId, { ...signal, status: 'CONNECTED' });
                }
                return NextResponse.json({ success: true, status: 'CONNECTED' });
            }

            case 'END': {
                // Either party ends the call
                const signal = callSignals.get(appointmentId);
                if (signal) {
                    callSignals.set(appointmentId, { ...signal, status: 'ENDED' });
                }
                return NextResponse.json({ success: true, status: 'ENDED' });
            }

            case 'DISMISS': {
                // Patient dismisses the notification without answering
                const signal = callSignals.get(appointmentId);
                if (signal) {
                    callSignals.set(appointmentId, { ...signal, status: 'MISSED' });
                }
                return NextResponse.json({ success: true, status: 'MISSED' });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (e: any) {
        console.error('Video signal error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

// GET: Check for incoming calls (polled by patient) or call status (polled by doctor)
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        cleanupStaleSignals();

        const url = new URL(req.url);
        const appointmentId = url.searchParams.get('appointmentId');

        // If checking a specific appointment's call status
        if (appointmentId) {
            const signal = callSignals.get(appointmentId);
            return NextResponse.json({
                hasActiveCall: !!signal && (signal.status === 'RINGING' || signal.status === 'CONNECTED'),
                signal: signal || null
            });
        }

        // For patients: check if any appointments have incoming calls
        if (session.user.role === 'PATIENT' || session.user.role !== 'DOCTOR') {
            const incomingCalls: any[] = [];

            for (const [aptId, signal] of callSignals.entries()) {
                if (signal.patientId === session.user.id && signal.status === 'RINGING') {
                    incomingCalls.push({
                        appointmentId: aptId,
                        doctorName: signal.doctorName,
                        initiatedAt: signal.initiatedAt,
                        status: signal.status
                    });
                }
            }

            return NextResponse.json({ incomingCalls });
        }

        return NextResponse.json({ incomingCalls: [] });
    } catch (e: any) {
        console.error('Video signal check error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}
