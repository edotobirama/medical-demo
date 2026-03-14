'use client';

import { useState } from 'react';
import { completeAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useCustomAlert } from '@/context/AlertContext';

export default function EndConsultationButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { showAlert, showConfirm } = useCustomAlert();

    const handleEnd = async () => {
        const confirmed = await showConfirm('End Session', 'Are you sure you want to end this session and mark it as completed?');
        if (!confirmed) return;
        
        setLoading(true);
        try {
            // Send END signal to terminate any active video call for this appointment
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, action: 'END' })
            }).catch(() => { }); // Non-blocking; okay if no active call

            const res = await completeAppointment(appointmentId);
            if (res.error) {
                showAlert(res.error, 'error');
                setLoading(false);
            } else {
                showAlert('Session completed successfully.', 'success');
                router.push('/doctor'); // Redirect to dashboard queue
            }
        } catch (e) {
            showAlert('An error occurred while completing the session.', 'error');
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleEnd}
            disabled={loading}
            className="w-full sm:w-auto btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/20 py-3 px-8 text-lg font-bold flex items-center justify-center gap-2"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle size={20} />}
            End Session
        </button>
    );
}
