'use client';

import { useState } from 'react';
import { cancelAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useCustomAlert } from '@/context/AlertContext';

export default function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { showAlert, showConfirm } = useCustomAlert();

    const handleCancel = async () => {
        const confirmed = await showConfirm('Cancel Appointment', 'Are you sure you want to cancel this appointment?');
        if (!confirmed) return;
        
        setLoading(true);
        try {
            const res = await cancelAppointment(appointmentId);
            if (res.error) {
                showAlert(res.error, 'error');
            } else {
                showAlert('Appointment canceled successfully', 'success');
                router.refresh();
            }
        } catch (e) {
            showAlert('An error occurred while canceling.', 'error');
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
