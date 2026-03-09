import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// WaitMath Simulation Logic — Scoped to CURRENT DAY only
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doctorId, requestedTime, issueDescription } = body;

        if (!doctorId || !requestedTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reqTime = new Date(requestedTime);
        const currentTime = new Date();

        // Build today's date boundaries (start of day to end of day)
        const todayStart = new Date(reqTime);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(reqTime);
        todayEnd.setHours(23, 59, 59, 999);

        // Mock AI duration logic based on issue complexity
        const issueStr = issueDescription || "general";
        const estimatedDuration = Math.max(10, Math.min(60, (issueStr.length % 30) + 10));

        // Get ONLY today's active appointments for this doctor (daily reset logic)
        const todaysAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                requestedTime: {
                    gte: todayStart,
                    lte: todayEnd
                },
                status: {
                    in: ["BOOKED", "RESCHEDULED", "TURN_ARRIVED", "IN_PROGRESS"]
                }
            },
            include: {
                patient: {
                    include: { user: true }
                }
            },
            orderBy: {
                bookingNumber: 'asc'
            }
        } as any);

        // Get max booking number for TODAY only — daily reset
        const maxBookingNum: any = await prisma.appointment.aggregate({
            where: {
                doctorId,
                requestedTime: {
                    gte: todayStart,
                    lte: todayEnd
                }
            },
            _max: { bookingNumber: true }
        } as any);

        const newBookingNumber = (maxBookingNum._max.bookingNumber || 0) + 1;

        // Build the simulation queue from today's appointments
        const queue = (todaysAppointments as any[]).map(app => ({
            id: app.id,
            bookingNumber: app.bookingNumber,
            patientName: app.patient?.user?.name || 'Patient',
            requestedTime: new Date(app.requestedTime || new Date()),
            estimatedDuration: app.estimatedDuration || 15,
            status: app.status,
            type: app.type || 'OFFLINE'
        }));

        // Add the new prospective user to the queue
        const newUserEntry = {
            id: 'NEW_USER_ENTRY',
            bookingNumber: newBookingNumber,
            patientName: 'You',
            requestedTime: reqTime,
            estimatedDuration: estimatedDuration,
            status: 'NEW',
            type: 'OFFLINE'
        };
        queue.push(newUserEntry);

        // === Simulation Engine ===
        let simTime = new Date(currentTime);
        let doctorFreeTime = new Date(currentTime);
        let processed: any[] = [];

        // If doctor is currently seeing someone
        const inProgress = queue.find(q => q.status === 'IN_PROGRESS');
        if (inProgress) {
            doctorFreeTime = new Date(inProgress.requestedTime.getTime() + inProgress.estimatedDuration * 60000);
        }

        const unassigned = [...queue].filter(q => q.status !== 'IN_PROGRESS');
        if (inProgress) {
            processed.push({
                ...inProgress,
                actualStart: inProgress.requestedTime,
                actualEnd: doctorFreeTime
            });
        }

        // Safety counter to prevent infinite loops
        let iterations = 0;
        const maxIterations = 500;

        while (unassigned.length > 0 && iterations < maxIterations) {
            iterations++;
            let isFree = simTime >= doctorFreeTime;

            if (isFree) {
                const waiting = unassigned.filter(u => u.requestedTime <= simTime);

                if (waiting.length > 0) {
                    waiting.sort((a, b) => a.bookingNumber - b.bookingNumber);
                    const nextPatient = waiting[0];

                    const actualStart = new Date(simTime);
                    const actualEnd = new Date(simTime.getTime() + nextPatient.estimatedDuration * 60000);

                    processed.push({ ...nextPatient, actualStart, actualEnd });
                    doctorFreeTime = actualEnd;

                    const idx = unassigned.findIndex(u => u.id === nextPatient.id);
                    if (idx !== -1) unassigned.splice(idx, 1);
                } else {
                    unassigned.sort((a, b) => a.requestedTime.getTime() - b.requestedTime.getTime());
                    simTime = new Date(unassigned[0].requestedTime);
                }
            } else {
                simTime = new Date(doctorFreeTime);
            }
        }

        // Find the new user's simulation result
        const newUserResult = processed.find(p => p.id === 'NEW_USER_ENTRY');

        if (!newUserResult) {
            return NextResponse.json({ error: "Simulation failed to process user" }, { status: 500 });
        }

        // Waitlist count = people processed before new user (today only)
        const waitlistAhead = processed.filter(
            p => p.actualEnd <= newUserResult.actualStart && p.id !== 'NEW_USER_ENTRY'
        );
        const estWaitlistCount = waitlistAhead.length;

        const estimatedWaitMs = newUserResult.actualStart.getTime() - currentTime.getTime();
        const estimatedWaitMins = Math.max(0, Math.floor(estimatedWaitMs / 60000));

        // Build the "existing bookings" list for display (exclude the new user projection)
        const existingBookings = (todaysAppointments as any[]).map(app => ({
            bookingNumber: app.bookingNumber,
            patientName: app.patient?.user?.name || 'Patient',
            requestedTime: app.requestedTime,
            estimatedDuration: app.estimatedDuration || 15,
            status: app.status,
            type: app.type || 'OFFLINE'
        }));

        // Build the full simulated schedule (with calculated start times)
        const simulatedSchedule = processed
            .filter(p => p.id !== 'NEW_USER_ENTRY')
            .map(p => ({
                bookingNumber: p.bookingNumber,
                patientName: p.patientName,
                estimatedStart: p.actualStart,
                estimatedEnd: p.actualEnd,
                estimatedDuration: p.estimatedDuration,
                status: p.status,
                type: p.type
            }));

        return NextResponse.json({
            bookingNumber: newBookingNumber,
            requestedTime: newUserResult.requestedTime,
            estimatedDuration,
            actualStartTime: newUserResult.actualStart,
            estimatedWaitTime: estimatedWaitMins,
            estimatedWaitlist: estWaitlistCount,
            queuePosition: estWaitlistCount + 1,
            todaysTotalBooked: todaysAppointments.length,
            existingBookings,
            simulatedSchedule
        });

    } catch (e: any) {
        console.error("Simulation error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
