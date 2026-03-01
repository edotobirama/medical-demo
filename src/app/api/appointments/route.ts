import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { slotId, type } = body;
        console.log("Booking Request:", { slotId, type });

        const session = await auth();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const patient = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { patientProfile: true }
        });

        if (!patient) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Auto-create profile if missing (safety net)
        if (!patient.patientProfile) {
            console.log("Creating missing patient profile for booking...");
            const newProfile = await prisma.patientProfile.create({
                data: { userId: patient.id }
            });
            patient.patientProfile = newProfile;
        }

        // Transaction to ensure atomicity
        const result = await prisma.$transaction(async (tx) => {
            const slot = await tx.slot.findUnique({
                where: { id: slotId }
            });

            if (!slot || slot.status !== 'AVAILABLE') {
                console.error("Booking Error: Slot unavailable", slot);
                throw new Error("Slot not available");
            }

            const appointment = await tx.appointment.create({
                data: {
                    patientId: patient.patientProfile!.id,
                    doctorId: slot.doctorId,
                    slotId: slot.id,
                    status: 'CONFIRMED',
                    type: type === 'digital' ? 'ONLINE' : 'OFFLINE'
                },
                include: {
                    slot: true,
                    doctor: { include: { user: true } }
                }
            });

            await tx.slot.update({
                where: { id: slotId },
                data: { status: 'BOOKED' }
            });

            return appointment;
        });

        console.log("Booking Success:", result.id);

        // Revalidate dashboard so confirmed booking shows up immediately
        revalidatePath('/patient');
        revalidatePath('/doctors/[id]');

        return NextResponse.json({
            success: true,
            appointment: result
        });
    } catch (error) {
        console.error("Booking Transaction Failed:", error);
        return NextResponse.json({ error: "Booking failed or slot taken" }, { status: 400 });
    }
}

