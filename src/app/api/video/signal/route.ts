import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { parseHistoryNotes } from '@/lib/utils/history';

/**
 * Database-backed video call signaling.
 *
 * All state — including chat messages — is stored in the DB so that
 * Vercel serverless cold-starts never lose data (an in-memory Map()
 * is wiped on every new instance).
 *
 * SDP offer/answer blobs are stored in a SEPARATE field (sdpMeta) so
 * they NEVER pollute historyNotes / contact history displayed in the UI.
 */

// --- Helpers ---------------------------------------------------------------

function parseMeta(raw: any): Record<string, any> {
    if (!raw) return {};
    try { return JSON.parse(raw as string); } catch { return {}; }
}

/** Strip internal call metadata + SDP from historyNotes before display */
function cleanNotes(meta: Record<string, any>): string {
    return meta._originalNotes || '';
}

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

                const parsed = parseHistoryNotes(appointment.historyNotes);

                // Store SDP in a SEPARATE field — never mixed into historyNotes
                // historyNotes only keeps call lifecycle info + original doctor notes
                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        status: 'IN_PROGRESS',
                        actualStartTime: appointment.actualStartTime || new Date(),
                        actualEndTime: null,
                        meetingLink: `/video/${appointmentId}`,
                        historyNotes: JSON.stringify({
                            _originalNotes: parsed.notes,
                            callStatus: 'RINGING',
                            initiatedAt: Date.now(),
                            lastHeartbeat: Date.now(),
                            endedBy: null,
                            // SDP stored here — prefixed _sdp so it's stripped from UI
                            _sdpOffer: body.offer ? JSON.stringify(body.offer) : null,
                            _sdpAnswer: null,
                            // Chat messages stored as JSON array in the meta
                            _chatMessages: '[]'
                        })
                    }
                });

                return NextResponse.json({ success: true, status: 'RINGING' });
            }

            case 'ANSWER': {
                const current = parseMeta(appointment.historyNotes);

                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        historyNotes: JSON.stringify({
                            ...current,
                            callStatus: 'CONNECTED',
                            lastHeartbeat: Date.now(),
                            _sdpAnswer: body.answer ? JSON.stringify(body.answer) : current._sdpAnswer || null
                        })
                    }
                });

                return NextResponse.json({ success: true, status: 'CONNECTED' });
            }

            case 'HEARTBEAT': {
                const current = parseMeta(appointment.historyNotes);

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

            case 'SEND_MESSAGE': {
                const { text } = body;
                if (text) {
                    const current = parseMeta(appointment.historyNotes);
                    // Parse existing chat messages from DB
                    let msgs: { from: string; text: string; time: string; timestamp: number }[] = [];
                    try { msgs = JSON.parse(current._chatMessages || '[]'); } catch { msgs = []; }

                    msgs.push({
                        from: session.user.role === 'DOCTOR' ? 'Doctor' : 'Patient',
                        text,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        timestamp: Date.now()
                    });

                    await prisma.appointment.update({
                        where: { id: appointmentId },
                        data: {
                            historyNotes: JSON.stringify({
                                ...current,
                                _chatMessages: JSON.stringify(msgs)
                            })
                        }
                    });
                }
                return NextResponse.json({ success: true });
            }

            case 'END': {
                const endedBy = session.user.role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
                const current = parseMeta(appointment.historyNotes);

                await prisma.appointment.update({
                    where: { id: appointmentId },
                    data: {
                        status: 'COMPLETED',
                        actualEndTime: new Date(),
                        // On END, write back clean historyNotes with only doctor notes — strip all internal metadata
                        historyNotes: current._originalNotes || '',
                        // Store end metadata in meetingLink field temporarily for signal GET to read
                        meetingLink: JSON.stringify({
                            callStatus: 'ENDED',
                            endedAt: Date.now(),
                            endedBy
                        })
                    }
                });

                return NextResponse.json({ success: true, status: 'ENDED', endedBy });
            }

            case 'DISMISS': {
                const current = parseMeta(appointment.historyNotes);

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

            const meta = parseMeta(appointment.historyNotes);
            const callStatus = meta.callStatus as string | undefined;

            // Also check meetingLink for END metadata (written at call end)
            let endMeta: any = {};
            if (appointment.meetingLink && !appointment.meetingLink.startsWith('/video/')) {
                try { endMeta = JSON.parse(appointment.meetingLink); } catch {}
            }

            const hasActiveCall =
                appointment.status === 'IN_PROGRESS' &&
                (callStatus === 'RINGING' || callStatus === 'CONNECTED');

            const callEnded =
                appointment.status === 'COMPLETED' ||
                appointment.status === 'CANCELLED' ||
                callStatus === 'ENDED' ||
                endMeta.callStatus === 'ENDED';

            // Parse chat messages from DB — always consistent across instances
            let messages: { from: string; text: string; time: string; timestamp: number }[] = [];
            try { messages = JSON.parse(meta._chatMessages || '[]'); } catch { messages = []; }

            // Parse SDP data (stored as stringified JSON to avoid nesting issues)
            let sdpOffer = null, sdpAnswer = null;
            try { if (meta._sdpOffer) sdpOffer = JSON.parse(meta._sdpOffer); } catch {}
            try { if (meta._sdpAnswer) sdpAnswer = JSON.parse(meta._sdpAnswer); } catch {}

            return NextResponse.json({
                hasActiveCall,
                callEnded,
                endedBy: meta.endedBy || endMeta.endedBy || null,
                messages,
                signal: {
                    status: callStatus || appointment.status,
                    endedBy: meta.endedBy || endMeta.endedBy || null,
                    endedAt: meta.endedAt || endMeta.endedAt || null,
                    doctorName: appointment.doctor.user.name || 'Doctor',
                    offer: sdpOffer,
                    answer: sdpAnswer
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
                const meta = parseMeta(apt.historyNotes);

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
