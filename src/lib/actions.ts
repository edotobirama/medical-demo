'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    console.log('[ACTION] Authenticate called');
    try {
        const data = Object.fromEntries(formData);
        const redirectTo = (data.redirectTo as string) || '/patient';
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

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

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
