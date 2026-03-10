'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarClock, RefreshCcw, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface PatientRescheduleProps {
    appointmentId: string;
    currentTime: string;
    rescheduleCount: number;
    maxReschedules?: number;
    doctorOpeningTime?: string;
    doctorClosingTime?: string;
}

export default function PatientRescheduleButton({
    appointmentId,
    currentTime,
    rescheduleCount,
    maxReschedules = 3,
    doctorOpeningTime = '09:00',
    doctorClosingTime = '17:00'
}: PatientRescheduleProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [newTime, setNewTime] = useState('');
    const router = useRouter();

    const remainingReschedules = maxReschedules - rescheduleCount;
    const canReschedule = remainingReschedules > 0;

    const handleReschedule = async () => {
        if (!newTime) {
            setError('Please select a new time.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const newRequestedTime = new Date(`${newDate}T${newTime}:00`).toISOString();

            const res = await fetch('/api/appointments/reschedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    newRequestedTime
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setShowModal(false);
                    router.refresh();
                }, 2000);
            } else {
                setError(data.error || 'Failed to reschedule');
            }
        } catch (e: any) {
            setError(e.message || 'Network error');
        } finally {
            setLoading(false);
        }
    };

    if (!canReschedule) {
        return (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <AlertCircle size={12} />
                <span>Max reschedules reached ({maxReschedules}/{maxReschedules})</span>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition"
            >
                <CalendarClock size={14} />
                Reschedule ({remainingReschedules} left)
            </button>

            {/* Reschedule Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Rescheduled!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Your appointment has been moved to {format(new Date(`${newDate}T${newTime}`), 'MMM d, h:mm a')}.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <RefreshCcw className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Reschedule Appointment</h3>
                                            <p className="text-xs text-muted-foreground">
                                                {remainingReschedules} of {maxReschedules} reschedules remaining
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Current Appointment */}
                                <div className="bg-muted/50 border border-border rounded-xl p-3 mb-4">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Current Time</p>
                                    <p className="text-sm font-bold text-foreground">
                                        {format(new Date(currentTime), 'EEEE, MMM d · h:mm a')}
                                    </p>
                                </div>

                                {/* Reschedule Attempt Indicator */}
                                <div className="flex items-center gap-1 mb-4">
                                    {Array.from({ length: maxReschedules }, (_, i) => (
                                        <div
                                            key={i}
                                            className={clsx(
                                                "flex-1 h-1.5 rounded-full transition",
                                                i < rescheduleCount
                                                    ? "bg-amber-400"
                                                    : i === rescheduleCount
                                                        ? "bg-blue-500 animate-pulse"
                                                        : "bg-muted"
                                            )}
                                        />
                                    ))}
                                    <span className="text-[10px] text-muted-foreground ml-2">
                                        Attempt {rescheduleCount + 1}/{maxReschedules}
                                    </span>
                                </div>

                                {/* New Date/Time Selection */}
                                <div className="space-y-3 mb-5">
                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-1">New Date</label>
                                        <select
                                            value={newDate}
                                            onChange={e => setNewDate(e.target.value)}
                                            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        >
                                            <option value={format(new Date(), 'yyyy-MM-dd')}>Today ({format(new Date(), 'MMM d')})</option>
                                            <option value={format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')}>Tomorrow ({format(new Date(Date.now() + 86400000), 'MMM d')})</option>
                                            <option value={format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd')}>
                                                {format(new Date(Date.now() + 86400000 * 2), 'EEEE, MMM d')}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-1">
                                            New Time ({doctorOpeningTime} - {doctorClosingTime})
                                        </label>
                                        <input
                                            type="time"
                                            value={newTime}
                                            onChange={e => setNewTime(e.target.value)}
                                            min={doctorOpeningTime}
                                            max={doctorClosingTime}
                                            className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                                        <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-700">{error}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        disabled={loading}
                                        className="flex-1 py-2.5 border border-border bg-background hover:bg-muted text-foreground rounded-xl font-bold text-sm transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleReschedule}
                                        disabled={loading || !newTime}
                                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-blue-500/20"
                                    >
                                        {loading ? (
                                            <Loader2 size={16} className="animate-spin" />
                                        ) : (
                                            <CalendarClock size={16} />
                                        )}
                                        Confirm Reschedule
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
