'use client';

import { useState } from 'react';
import { completeAppointment } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function EndConsultationButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEnd = async () => {
        if (!confirm('Are you sure you want to end this session and mark it as completed?')) return;
        setLoading(true);
        try {
            const res = await completeAppointment(appointmentId);
            if (res.error) {
                alert(res.error);
                setLoading(false);
            } else {
                alert('Session completed successfully.');
                router.push('/doctor'); // Redirect to dashboard queue
            }
        } catch (e) {
            alert('An error occurred while completing the session.');
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
