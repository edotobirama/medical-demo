import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// WaitMath Simulation Logic
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { doctorId, requestedTime, issueDescription } = body;

        if (!doctorId || !requestedTime) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const reqTime = new Date(requestedTime);
        const currentTime = new Date(); // Actual current real-world time

        // Mock AI duration logic based on issue complexity
        const issueStr = issueDescription || "general";
        const estimatedDuration = Math.max(10, Math.min(60, (issueStr.length % 30) + 10)); // 10 to 40 mins

        // Get all pending appointments for the doctor
        const pendingAppointments = await prisma.appointment.findMany({
            where: {
                doctorId,
                status: {
                    in: ["BOOKED", "RESCHEDULED", "TURN_ARRIVED", "IN_PROGRESS", "MISSED_BUT_REBOOKED"] // active statuses
                },
                // we should only consider appointments that haven't ended yet
                OR: [
                    { actualEndTime: null },
                    { actualEndTime: { gt: currentTime } }
                ]
            },
            orderBy: {
                bookingNumber: 'asc'
            }
        });

        const maxBookingNum = await prisma.appointment.aggregate({
            where: { doctorId },
            _max: { bookingNumber: true }
        });

        const newBookingNumber = (maxBookingNum._max.bookingNumber || 0) + 1;

        // Create our simulation array
        const queue = pendingAppointments.map(app => ({
            id: app.id,
            bookingNumber: app.bookingNumber,
            requestedTime: new Date(app.requestedTime || new Date()),
            estimatedDuration: app.estimatedDuration || 15,
            status: app.status
        }));

        // Add the new user to queue
        const newUserEntry = {
            id: 'NEW_USER_ENTRY',
            bookingNumber: newBookingNumber,
            requestedTime: reqTime,
            estimatedDuration: estimatedDuration,
            status: 'NEW'
        };
        queue.push(newUserEntry);

        // Simulation State
        let simTime = new Date(currentTime);
        let doctorFreeTime = new Date(currentTime);

        let processed = []; // Store calculated actual start/end

        // Find if doctor is currently busy (IN_PROGRESS)
        const inProgress = queue.find(q => q.status === 'IN_PROGRESS');
        if (inProgress) {
            doctorFreeTime = new Date(inProgress.requestedTime.getTime() + inProgress.estimatedDuration * 60000); // Rough estimate, or from actualStartTime if we had it
        }

        const unassigned = [...queue].filter(q => q.status !== 'IN_PROGRESS');

        while (unassigned.length > 0) {
            // Check if doctor is free at simTime
            let isFree = simTime >= doctorFreeTime;

            if (isFree) {
                // Anyone waiting? (requestedTime <= simTime)
                const waiting = unassigned.filter(u => u.requestedTime <= simTime);

                if (waiting.length > 0) {
                    // Pick lowest booking number
                    waiting.sort((a, b) => a.bookingNumber - b.bookingNumber);
                    const nextPatient = waiting[0];

                    // Assign to doctor
                    const actualStart = new Date(simTime);
                    const actualEnd = new Date(simTime.getTime() + nextPatient.estimatedDuration * 60000);

                    processed.push({ ...nextPatient, actualStart, actualEnd });
                    doctorFreeTime = actualEnd; // Doctor is busy until actualEnd

                    // Remove from unassigned
                    const idx = unassigned.findIndex(u => u.id === nextPatient.id);
                    if (idx !== -1) unassigned.splice(idx, 1);
                } else {
                    // No one waiting, fast forward to the nearest upcoming appointment time
                    unassigned.sort((a, b) => a.requestedTime.getTime() - b.requestedTime.getTime());
                    simTime = new Date(unassigned[0].requestedTime);
                }
            } else {
                // Doctor is busy, fast forward sim time to when doctor is free
                simTime = new Date(doctorFreeTime);
            }
        }

        // Find the new user's result
        const newUserResult = processed.find(p => p.id === 'NEW_USER_ENTRY');

        if (!newUserResult) {
            return NextResponse.json({ error: "Simulation failed to process user" }, { status: 500 });
        }

        // Waitlist count = number of people seen before newUser
        const waitlistAhead = processed.filter(p => p.actualEnd <= newUserResult.actualStart && p.id !== 'NEW_USER_ENTRY');
        const estWaitlistCount = waitlistAhead.length;

        const estimatedWaitMs = newUserResult.actualStart.getTime() - newUserResult.requestedTime.getTime();
        const estimatedWaitMins = Math.max(0, Math.floor(estimatedWaitMs / 60000));

        return NextResponse.json({
            bookingNumber: newBookingNumber,
            requestedTime: newUserResult.requestedTime,
            estimatedDuration,
            actualStartTime: newUserResult.actualStart,
            estimatedWaitTime: estimatedWaitMins,
            estimatedWaitlist: estWaitlistCount,
            queuePosition: estWaitlistCount + 1 // if 3 people ahead, you are 4th
        });

    } catch (e: any) {
        console.error("Simulation error:", e);
        return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
    }
}
