import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { doctorProfile: true, patientProfile: true }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Gather users to chat with based on appointments
        const chatUsersMap = new Map();

        if (currentUser.role === 'PATIENT' && currentUser.patientProfile) {
            const appointments = await prisma.appointment.findMany({
                where: { patientId: currentUser.patientProfile.id },
                include: {
                    doctor: {
                        include: { user: true }
                    }
                }
            });

            for (const app of appointments) {
                if (app.doctor?.user) {
                    chatUsersMap.set(app.doctor.user.id, {
                        ...app.doctor.user,
                        title: `Dr. ${app.doctor.user.name?.split(' ')[1] || app.doctor.user.name}`,
                        subtext: app.doctor.specialization
                    });
                }
            }
        } else if (currentUser.role === 'DOCTOR' && currentUser.doctorProfile) {
            const appointments = await prisma.appointment.findMany({
                where: { doctorId: currentUser.doctorProfile.id },
                include: {
                    patient: {
                        include: { user: true }
                    }
                }
            });

            for (const app of appointments) {
                if (app.patient?.user) {
                    chatUsersMap.set(app.patient.user.id, {
                        ...app.patient.user,
                        title: app.patient.user.name || "Patient",
                        subtext: "Patient"
                    });
                }
            }
        }

        // Convert Map to Array
        const conversations = Array.from(chatUsersMap.values());

        return NextResponse.json({ success: true, conversations, currentUserId: currentUser.id });
    } catch (e: any) {
        console.error("Fetch Conversations Error:", e);
        return NextResponse.json({ error: e.message || "Failed to fetch conversations" }, { status: 500 });
    }
}
