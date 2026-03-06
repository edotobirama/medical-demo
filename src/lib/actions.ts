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

    redirect('/login?registered=true');
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
