'use client';

import { useState } from 'react';
import { Phone, Loader2 } from 'lucide-react';
import { useCustomAlert } from '@/context/AlertContext';

export default function CallPatientButton({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const [called, setCalled] = useState(false);

    const { showAlert } = useCustomAlert();

    const handleCall = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    action: 'INITIATE'
                })
            });

            if (res.ok) {
                setCalled(true);
                // Open video call in new tab
                window.open(`/video/${appointmentId}`, '_blank');
                // Reset the called state after 10 seconds
                setTimeout(() => setCalled(false), 10000);
            } else {
                const data = await res.json();
                showAlert(`Failed to call: ${data.error || 'Unknown error'}`, 'error');
            }
        } catch (e) {
            showAlert('Failed to initiate video call.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCall}
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-md ${called
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20'
                }`}
        >
            {loading ? (
                <Loader2 size={18} className="animate-spin" />
            ) : (
                <Phone size={18} />
            )}
            {called ? 'Ringing Patient...' : 'Call Patient'}
        </button>
    );
}
