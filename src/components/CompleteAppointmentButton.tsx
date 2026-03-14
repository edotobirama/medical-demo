'use client';

import { useState } from 'react';
import { completeAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { useCustomAlert } from '@/context/AlertContext';

export default function CompleteAppointmentButton({ appointmentId, disabled }: { appointmentId: string, disabled?: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { showAlert, showConfirm } = useCustomAlert();

    const handleComplete = async () => {
        const confirmed = await showConfirm('Complete Appointment', 'Mark this appointment as completed?');
        if (!confirmed) return;
        
        setLoading(true);
        try {
            const res = await completeAppointment(appointmentId);
            if (res.error) {
                showAlert(res.error, 'error');
            } else {
                showAlert('Appointment marked as complete', 'success');
                router.refresh();
            }
        } catch (e) {
            showAlert('An error occurred while marking as complete.', 'error');
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
