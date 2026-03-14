'use client';

import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ProvidersProps {
    children: React.ReactNode;
    session?: Session | null;
}

import { AlertProvider } from '@/context/AlertContext';

export default function Providers({ children, session }: ProvidersProps) {
    return (
        <SessionProvider session={session}>
            <AlertProvider>
                {children}
            </AlertProvider>
        </SessionProvider>
    );
}
