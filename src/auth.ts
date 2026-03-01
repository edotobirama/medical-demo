import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { User } from '@/lib/definitions';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

import Google from 'next-auth/providers/google';

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials) {
                console.log('[AUTH] Attempting login with:', credentials?.email);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);

                    if (!user) {
                        console.log('[AUTH] User not found during login:', email);
                        return null;
                    }

                    // Social login users might not have a password
                    if (!user.password) {
                        console.log('[AUTH] User has no password (likely social login):', email);
                        return null;
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if (passwordsMatch) {
                        console.log('[AUTH] Login Successful for:', user.email);
                        // Return simpler object to avoid serialization issues
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        };
                    }
                    console.log('[AUTH] Password mismatch for:', email);
                } else {
                    console.log('[AUTH] Zod validation failed for credentials');
                }

                console.log('[AUTH] Returning null (Invalid credentials)');
                return null;
            },
        }),
    ],
});
