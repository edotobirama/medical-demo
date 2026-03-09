'use client';

import { useState } from 'react';
import { cancelAppointment, requestRescheduleAppointment, startConsultation } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Play, XCircle, CalendarClock, Loader2 } from 'lucide-react';

export default function DoctorConsultationButtons({ appointmentId, status, type }: { appointmentId: string, status: string, type: string }) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleStart = async () => {
        setLoading('start');
        try {
            const res = await startConsultation(appointmentId);
            if (res.error) {
                alert(res.error);
                setLoading(null);
            } else {
                if (type === 'ONLINE') {
                    window.open(`/video/${appointmentId}`, '_blank');
                }
                router.push(`/doctor/consultation/${appointmentId}`);
            }
        } catch (e) {
            alert('An error occurred.');
            setLoading(null);
        }
    };

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this appointment?')) return;
        setLoading('cancel');
        try {
            const res = await cancelAppointment(appointmentId);
            if (res.error) alert(res.error);
            else router.refresh();
        } catch (e) {
            alert('An error occurred.');
        } finally {
            setLoading(null);
        }
    };

    const handleReschedule = async () => {
        if (!confirm('Request the patient to reschedule this appointment?')) return;
        setLoading('reschedule');
        try {
            const res = await requestRescheduleAppointment(appointmentId);
            if (res.error) alert(res.error);
            else router.refresh();
        } catch (e) {
            alert('An error occurred.');
        } finally {
            setLoading(null);
        }
    };

    if (status === 'COMPLETED' || status === 'CANCELLED') {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mt-4 sm:mt-0">
            {status !== 'IN_PROGRESS' && (
                <button
                    onClick={handleStart}
                    disabled={!!loading}
                    className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/20 py-2 px-4 text-sm flex items-center gap-2"
                >
                    {loading === 'start' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play size={16} />}
                    Start
                </button>
            )}

            {status === 'IN_PROGRESS' && (
                <button
                    onClick={() => {
                        if (type === 'ONLINE') {
                            window.open(`/video/${appointmentId}`, '_blank');
                        }
                        router.push(`/doctor/consultation/${appointmentId}`);
                    }}
                    className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 border-none shadow-md shadow-emerald-500/20 py-2 px-4 text-sm flex items-center gap-2"
                >
                    <Play size={16} /> Resume
                </button>
            )}

            <button
                onClick={handleReschedule}
                disabled={!!loading}
                className="btn btn-outline border-blue-200 text-blue-600 hover:bg-blue-50 py-2 px-4 text-sm flex items-center gap-2"
            >
                {loading === 'reschedule' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarClock size={16} />}
                Reschedule
            </button>

            <button
                onClick={handleCancel}
                disabled={!!loading}
                className="btn btn-outline border-rose-200 text-rose-500 hover:bg-rose-50 hover:text-rose-600 py-2 px-4 text-sm flex items-center gap-2"
            >
                {loading === 'cancel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle size={16} />}
                Cancel
            </button>
        </div>
    );
}
