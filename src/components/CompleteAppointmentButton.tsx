'use client';

import { useState } from 'react';
import { completeAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function CompleteAppointmentButton({ appointmentId, disabled }: { appointmentId: string, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleComplete = async () => {
        if (!confirm('Mark this appointment as completed?')) return;
        setLoading(true);
        try {
            const res = await completeAppointment(appointmentId);
            if (res.error) {
                alert(res.error);
            } else {
                router.refresh();
            }
        } catch (e) {
            alert('An error occurred while marking as complete.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleComplete}
            disabled={loading || disabled}
            className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/20 py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <CheckCircle size={16} />
            {loading ? 'Processing...' : 'Complete'}
        </button>
    );
}
