'use server';

import { signIn, auth } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log('[ACTION] Authenticate called');
    try {
        const data = Object.fromEntries(formData);
        // Determine redirect based on role
        const email = data.email as string;
        const userRecord = await prisma.user.findUnique({ where: { email } });
        let redirectTo = (data.redirectTo as string) || '/patient';
        if (userRecord?.role === 'ADMIN') redirectTo = '/admin';
        else if (userRecord?.role === 'DOCTOR') redirectTo = '/doctor';
        await signIn('credentials', { ...data, redirectTo });
    } catch (error) {
        if (error instanceof AuthError) {
            console.error('[ACTION] AuthError:', error.type, error.message);
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        console.error('[ACTION] Non-AuthError in authenticate:', error);
        throw error;
    }
}

export async function authenticateGoogle() {
    await signIn('google');
}

export async function registerUser(prevState: string | undefined, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return "Please fill in all fields.";
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return "User with this email already exists.";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'PATIENT', // Default role
                // patientProfile: { create: {} } // Optionally create profile stub
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return "Failed to register user.";
    }

    try {
        await signIn('credentials', { email, password, redirectTo: '/patient' });
    } catch (error) {
        if (error instanceof AuthError) {
            return 'Failed to log in after registration.';
        }
        throw error;
    }
}



export async function addDoctor(
    prevState: { success?: boolean; error?: string } | null,
    formData: FormData
): Promise<{ success?: boolean; error?: string }> {
    // 1. Validate admin session
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        return { error: 'Unauthorized. Only admins can add doctors.' };
    }

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const specialization = formData.get('specialization') as string;
    const department = (formData.get('department') as string) || null;
    const licenseNumber = (formData.get('licenseNumber') as string) || null;
    const bio = (formData.get('bio') as string) || null;
    const consultationFee = parseFloat(formData.get('consultationFee') as string) || 0;

    // 2. Validate required fields
    if (!name || !email || !password || !specialization) {
        return { error: 'Please fill in all required fields (Name, Email, Password, Specialization).' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
    }

    try {
        // 3. Check duplicate email
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { error: 'A user with this email already exists.' };
        }

        // 4. Create User + DoctorProfile in a transaction
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: 'DOCTOR',
                    image: '/images/team-doctors.png',
                },
            });

            await tx.doctorProfile.create({
                data: {
                    userId: user.id,
                    specialization,
                    department,
                    licenseNumber,
                    bio,
                    consultationFee,
                },
            });
        });

        return { success: true };
    } catch (error) {
        console.error('Error adding doctor:', error);
        return { error: 'Failed to add doctor. Please try again.' };
    }
}

export async function sendContactMessage(
    prevState: { success?: boolean; error?: string } | null,
    formData: FormData
): Promise<{ success?: boolean; error?: string }> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { error: 'Please fill in all fields.' };
    }

    try {
        await prisma.contactMessage.create({
            data: { name, email, message },
        });
        return { success: true };
    } catch (error) {
        console.error('Error saving contact message:', error);
        return { error: 'Failed to send message. Please try again.' };
    }
}

export async function updateDoctorSettings(
    prevState: { success?: boolean; error?: string } | null,
    formData: FormData
): Promise<{ success?: boolean; error?: string }> {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'DOCTOR') {
        return { error: 'Unauthorized.' };
    }

    const consultationFee = parseFloat(formData.get('consultationFee') as string);
    const isAvailable = formData.get('isAvailable') === 'on';
    const openingTime = formData.get('openingTime') as string;
    const closingTime = formData.get('closingTime') as string;

    if (isNaN(consultationFee) || consultationFee < 0) {
        return { error: 'Please enter a valid consultation fee.' };
    }

    try {
        await prisma.doctorProfile.update({
            where: { userId: session.user.id },
            data: {
                consultationFee,
                isAvailable,
                openingTime,
                closingTime
            },
        });
        return { success: true };
    } catch (error) {
        console.error('Error updating doctor settings:', error);
        return { error: 'Failed to update settings. Please try again.' };
    }
}

export async function cancelAppointment(appointmentId: string) {
    const session = await auth();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    try {
        const apt = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: { include: { user: true } }, doctor: { include: { user: true } } }
        });

        if (!apt) throw new Error('Not found');
        const isPatient = apt.patient.user.id === session.user.id;
        const isDoctor = apt.doctor.user.id === session.user.id;
        if (!isPatient && !isDoctor && session.user.role !== 'ADMIN') throw new Error('Unauthorized');

        await prisma.$transaction([
            prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: 'CANCELLED' }
            }),
            ...(apt.slotId ? [prisma.slot.update({
                where: { id: apt.slotId },
                data: { status: 'AVAILABLE', lockedAt: null, lockedBy: null }
            })] : [])
        ]);

        return { success: true };
    } catch (e) {
        return { error: 'Could not cancel appointment' };
    }
}

export async function completeAppointment(appointmentId: string) {
    const session = await auth();
    if (!session?.user) {
        return { error: 'Unauthorized' };
    }

    try {
        const apt = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { doctor: { include: { user: true } } }
        });

        if (!apt) return { error: 'Not found' };
        if (apt.doctor.user.id !== session.user.id) return { error: 'Unauthorized. Only the doctor can complete this.' };

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'COMPLETED',
                actualEndTime: new Date()
            }
        });

        return { success: true };
    } catch (e) {
        return { error: 'Could not complete appointment' };
    }
}

export async function requestRescheduleAppointment(appointmentId: string) {
    const session = await auth();
    if (!session?.user) return { error: 'Unauthorized' };

    try {
        const apt = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { doctor: { include: { user: true } } }
        });

        if (!apt) return { error: 'Not found' };
        if (apt.doctor.user.id !== session.user.id) return { error: 'Unauthorized' };

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: 'RESCHEDULE_REQUESTED' }
        });

        return { success: true };
    } catch (e) {
        return { error: 'Could not request reschedule' };
    }
}

export async function startConsultation(appointmentId: string) {
    const session = await auth();
    if (!session?.user) return { error: 'Unauthorized' };

    try {
        const apt = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { doctor: { include: { user: true } } }
        });

        if (!apt) return { error: 'Not found' };
        if (apt.doctor.user.id !== session.user.id) return { error: 'Unauthorized' };

        await prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                status: 'IN_PROGRESS',
                actualStartTime: new Date()
            }
        });

        return { success: true };
    } catch (e) {
        return { error: 'Could not start consultation' };
    }
}

export async function requestRefund(appointmentId: string) {
    const session = await auth();
    if (!session?.user) return { error: 'Unauthorized' };

    try {
        const apt = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: { include: { user: true } } }
        });

        if (!apt) return { error: 'Appointment not found' };
        if (apt.patient.user.id !== session.user.id) return { error: 'Unauthorized' };

        const refundableStatuses = ['CANCELLED', 'RESCHEDULE_REQUESTED'];
        if (!refundableStatuses.includes(apt.status)) {
            return { error: 'This appointment is not eligible for a refund.' };
        }

        await prisma.$transaction([
            prisma.appointment.update({
                where: { id: appointmentId },
                data: { status: 'REFUNDED' }
            }),
            ...(apt.slotId ? [prisma.slot.update({
                where: { id: apt.slotId },
                data: { status: 'AVAILABLE', lockedAt: null, lockedBy: null }
            })] : [])
        ]);

        return { success: true, refundAmount: apt.amountPaid };
    } catch (e) {
        return { error: 'Could not process refund' };
    }
}
