import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// In-memory call signaling store (in production, use Redis or a DB table)
// Maps appointmentId -> signal data
const callSignals = new Map<string, {
    status: 'RINGING' | 'CONNECTED' | 'ENDED' | 'MISSED';
    initiatedAt: number;
    endedAt: number | null;
    endedBy: 'DOCTOR' | 'PATIENT' | null;
    doctorName: string;
    doctorUserId: string;
    patientId: string;
    appointmentId: string;
}>();

// Clean up stale signals (older than 2 minutes for RINGING, 5 minutes total)
function cleanupStaleSignals() {
    const now = Date.now();
    for (const [key, signal] of callSignals.entries()) {
        // Auto-expire RINGING after 2 minutes
        if (signal.status === 'RINGING' && now - signal.initiatedAt > 120000) {
            callSignals.set(key, { ...signal, status: 'MISSED' });
        }
        // Keep ENDED signals for 30 seconds so the other party can poll and detect it
        if (signal.status === 'ENDED' && signal.endedAt && now - signal.endedAt > 30000) {
            callSignals.delete(key);
            continue;
        }
        // Remove very old signals (5+ minutes)
        if (now - signal.initiatedAt > 300000 && signal.status !== 'ENDED') {
            callSignals.delete(key);
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
                    endedAt: null,
                    endedBy: null,
                    doctorName: appointment.doctor.user.name || 'Doctor',
                    doctorUserId: appointment.doctor.user.id,
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
                // Either party ends the call — set ENDED with endedBy info
                const signal = callSignals.get(appointmentId);
                const endedBy = session.user.role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';

                if (signal) {
                    callSignals.set(appointmentId, {
                        ...signal,
                        status: 'ENDED',
                        endedAt: Date.now(),
                        endedBy: endedBy as 'DOCTOR' | 'PATIENT'
                    });
                } else {
                    // Create an ENDED signal even if no prior signal existed
                    // (handles case where doctor ends from consultation page)
                    callSignals.set(appointmentId, {
                        status: 'ENDED',
                        initiatedAt: Date.now(),
                        endedAt: Date.now(),
                        endedBy: endedBy as 'DOCTOR' | 'PATIENT',
                        doctorName: appointment.doctor.user.name || 'Doctor',
                        doctorUserId: appointment.doctor.user.id,
                        patientId: appointment.patient.userId,
                        appointmentId
                    });
                }

                return NextResponse.json({
                    success: true,
                    status: 'ENDED',
                    endedBy
                });
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

// GET: Check for incoming calls (polled by patient) or call status (polled by either party in video room)
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        cleanupStaleSignals();

        const url = new URL(req.url);
        const appointmentId = url.searchParams.get('appointmentId');

        // If checking a specific appointment's call status (used by video page for both parties)
        if (appointmentId) {
            const signal = callSignals.get(appointmentId);
            return NextResponse.json({
                hasActiveCall: !!signal && (signal.status === 'RINGING' || signal.status === 'CONNECTED'),
                callEnded: !!signal && signal.status === 'ENDED',
                endedBy: signal?.endedBy || null,
                signal: signal ? {
                    status: signal.status,
                    endedBy: signal.endedBy,
                    endedAt: signal.endedAt,
                    doctorName: signal.doctorName
                } : null
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
