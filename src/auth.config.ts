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
                nextUrl.pathname.startsWith('/patient') ||
                nextUrl.pathname.startsWith('/inbox') ||
                nextUrl.pathname.startsWith('/messages') ||
                nextUrl.pathname.startsWith('/video');
            const isOnAdmin = nextUrl.pathname.startsWith('/admin');

            if (isOnAdmin) {
                if (!isLoggedIn) return false;
                // Only ADMIN role can access /admin routes
                const role = (auth?.user as any)?.role;
                if (role !== 'ADMIN') {
                    return Response.redirect(new URL('/login', nextUrl));
                }
                return true;
            }

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
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
