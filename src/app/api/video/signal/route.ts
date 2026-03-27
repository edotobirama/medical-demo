import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { parseHistoryNotes } from '@/lib/utils/history';

/**
 * Database-backed video call signaling.
 *
 * WHY: Vercel serverless functions run in isolated instances that don't share
 * in-memory state. An in-memory Map() would be empty on every cold-start or
 * when a request lands on a different instance, causing phantom "call ended"
 * signals after the 20-second stale timeout.
 *
 * Solution: Store all call state in the Appointment row (PostgreSQL via Prisma).
 * - INITIATE  → status = IN_PROGRESS, actualStartTime set, historyNotes has call meta
 * - HEARTBEAT → touches updatedAt so we can detect real drops
 * - END        → status = COMPLETED / CANCELLED, actualEndTime set
 * - GET        → reads appointment row; no stale timeout, no instance isolation issue
 *
 * Messages (in-call chat) still use a small in-memory buffer because they are
 * ephemeral and low-stakes. They are also read within the same 3-second poll window.
 */

// Ephemeral in-call chat messages (ok to be instance-local, short-lived)
const chatMessages = new Map<string, { from: string; text: string; time: string; timestamp: number }[]>();

// --- POST ---------------------------------------------------------------
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

        switch (action) {
            case 'INITIATE': {
                if (session.user.role !== 'DOCTOR') {
                    return NextResponse.json({ error: 'Only doctors can initiate calls' }, { status: 403 });
                }

                // Set call state in DB — this is visible to every serverless instance
                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        status: 'IN_PROGRESS',
                        actualStartTime: appointment.actualStartTime || new Date(),
                        actualEndTime: null,          // Clear any previous end time
                        meetingLink: `/video/${appointmentId}`,
                        // Preserve original notes if any, hide from UI via JSON
                        historyNotes: JSON.stringify({
                            ...parseHistoryNotes(appointment.historyNotes).metadata,
                            _originalNotes: parseHistoryNotes(appointment.historyNotes).notes,
                            callStatus: 'RINGING',
                            initiatedAt: Date.now(),
                            lastHeartbeat: Date.now(),
                            endedBy: null
                        })
                    }
                });

                chatMessages.set(appointmentId, []);
                return NextResponse.json({ success: true, status: 'RINGING' });
            }

            case 'ANSWER': {
                // Patient answers — update DB so doctor-side poll sees CONNECTED
                const current = appointment.historyNotes
                    ? JSON.parse(appointment.historyNotes as string)
                    : {};

                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({
                            ...current,
                            callStatus: 'CONNECTED',
                            lastHeartbeat: Date.now()
                        })
                    }
                });

                return NextResponse.json({ success: true, status: 'CONNECTED' });
            }

            case 'HEARTBEAT': {
                // Touch the DB record — updatedAt changes, and we store lastHeartbeat
                const current = appointment.historyNotes
                    ? JSON.parse(appointment.historyNotes as string)
                    : {};

                // Only heartbeat if the call is still active
                if (appointment.status === 'IN_PROGRESS') {
                    await prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            historyNotes: JSON.stringify({
                                ...current,
                                callStatus: current.callStatus || 'CONNECTED',
                                lastHeartbeat: Date.now()
                            })
                        }
                    });
                }

                return NextResponse.json({ success: true });
            }

            case 'WEBRTC_OFFER': {
                const { sdp } = body;
                const current = appointment.historyNotes ? JSON.parse(appointment.historyNotes as string) : {};
                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({ ...current, offer: sdp })
                    }
                });
                return NextResponse.json({ success: true });
            }

            case 'WEBRTC_ANSWER': {
                const { sdp } = body;
                const current = appointment.historyNotes ? JSON.parse(appointment.historyNotes as string) : {};
                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({ ...current, answer: sdp })
                    }
                });
                return NextResponse.json({ success: true });
            }

            case 'WEBRTC_ICE': {
                const { candidate } = body;
                const current = appointment.historyNotes ? JSON.parse(appointment.historyNotes as string) : {};
                const roleKey = session.user.role === 'DOCTOR' ? 'doctorCandidates' : 'patientCandidates';
                const existing = current[roleKey] || [];
                
                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({ ...current, [roleKey]: [...existing, candidate] })
                    }
                });
                return NextResponse.json({ success: true });
            }

            case 'SEND_MESSAGE': {
                const { text } = body;
                if (text) {
                    const msgs = chatMessages.get(appointmentId) || [];
                    msgs.push({
                        from: session.user.role === 'DOCTOR' ? 'Doctor' : 'Patient',
                        text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: Date.now()
                    });
                    chatMessages.set(appointmentId, msgs);
                }
                return NextResponse.json({ success: true });
            }

            case 'END': {
                const endedBy = session.user.role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
                const current = appointment.historyNotes
                    ? JSON.parse(appointment.historyNotes as string)
                    : {};

                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        status: 'COMPLETED',
                        actualEndTime: new Date(),
                        historyNotes: JSON.stringify({
                            ...current,
                            callStatus: 'ENDED',
                            endedAt: Date.now(),
                            endedBy
                        })
                    }
                });

                return NextResponse.json({ success: true, status: 'ENDED', endedBy });
            }

            case 'DISMISS': {
                const current = appointment.historyNotes
                    ? JSON.parse(appointment.historyNotes as string)
                    : {};

                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({ ...current, callStatus: 'MISSED' })
                    }
                });

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

// --- GET ---------------------------------------------------------------
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const appointmentId = url.searchParams.get('appointmentId');

        if (appointmentId) {
            // --- Specific appointment status check (used by both parties in video room) ---
            const appointment = await prisma.appointment.findUnique({
                where: { id: appointmentId },
                include: {
                    doctor: { include: { user: true } },
                    patient: { include: { user: true } }
                }
            });

            if (!appointment) {
                return NextResponse.json({ hasActiveCall: false, callEnded: false, messages: [] });
            }

            const meta = appointment.historyNotes
                ? JSON.parse(appointment.historyNotes as string)
                : {};

            const callStatus = meta.callStatus as string | undefined;

            const hasActiveCall =
                appointment.status === 'IN_PROGRESS' &&
                (callStatus === 'RINGING' || callStatus === 'CONNECTED');

            const callEnded =
                appointment.status === 'COMPLETED' ||
                appointment.status === 'CANCELLED' ||
                callStatus === 'ENDED';

            const messages = chatMessages.get(appointmentId) || [];

            return NextResponse.json({
                hasActiveCall,
                callEnded,
                endedBy: meta.endedBy || null,
                messages,
                webrtc: {
                    offer: meta.offer || null,
                    answer: meta.answer || null,
                    doctorCandidates: meta.doctorCandidates || [],
                    patientCandidates: meta.patientCandidates || []
                },
                signal: {
                    status: callStatus || appointment.status,
                    endedBy: meta.endedBy || null,
                    endedAt: meta.endedAt || null,
                    doctorName: appointment.doctor.user.name || 'Doctor'
                }
            });
        }

        // --- Patient: check for incoming calls on any appointment ---
        if (session.user.role !== 'DOCTOR') {
            const incomingCalls: any[] = [];

            const activeAppointments = await prisma.appointment.findMany({
                where: {
                    status: 'IN_PROGRESS',
                    patient: { userId: session.user.id }
                },
                include: { doctor: { include: { user: true } } }
            });

            for (const apt of activeAppointments) {
                const meta = apt.historyNotes
                    ? JSON.parse(apt.historyNotes as string)
                    : {};

                if (meta.callStatus === 'RINGING' || meta.callStatus === 'CONNECTED') {
                    incomingCalls.push({
                        appointmentId: apt.id,
                        doctorName: apt.doctor.user.name || 'Doctor',
                        initiatedAt: meta.initiatedAt || Date.now(),
                        status: meta.callStatus
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
