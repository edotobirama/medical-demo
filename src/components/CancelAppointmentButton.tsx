'use client';

import { useState } from 'react';
import { cancelAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export default function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        setLoading(true);
        try {
            const res = await cancelAppointment(appointmentId);
            if (res.error) {
                alert(res.error);
            } else {
                router.refresh();
            }
        } catch (e) {
            alert('An error occurred while canceling.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 sm:flex-none btn btn-outline border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 px-4 py-2 text-xs"
        >
            {loading ? 'Canceling...' : 'Cancel'}
        </button>
    );
}
