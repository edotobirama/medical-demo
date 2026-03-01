import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') ||
                (nextUrl.pathname.startsWith('/doctor') && !nextUrl.pathname.startsWith('/doctors')) ||
                nextUrl.pathname.startsWith('/patient');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            // Allow access to other pages
            return true;
        },
        // Add role to the session
        async session({ session, token }) {
            if (token.role && session.user) {
                session.user.role = token.role as string;
                session.user.id = token.sub as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
