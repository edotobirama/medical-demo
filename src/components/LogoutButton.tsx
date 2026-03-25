'use client';

import { LogOut } from 'lucide-react';
import { logoutAction } from '@/lib/actions';

export default function LogoutButton() {
    return (
        <form action={logoutAction}>
            <button className="btn btn-outline border-border hover:bg-muted text-muted-foreground flex items-center justify-center p-2 rounded-md transition-colors">
                <LogOut size={18} />
            </button>
        </form>
    );
}
