'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Search, UserPlus, Calendar, Clock, Loader2, CheckCircle,
    AlertCircle, X, Stethoscope, FileText
} from 'lucide-react';
import { format } from 'date-fns';
import clsx from 'clsx';

interface PatientResult {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    gender: string | null;
    bloodGroup: string | null;
    appointmentCount: number;
}

export default function DoctorFollowUpBooking({ doctorId }: { doctorId: string }) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [patients, setPatients] = useState<PatientResult[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);
    const [bookingDate, setBookingDate] = useState(format(new Date(Date.now() + 86400000), 'yyyy-MM-dd'));
    const [bookingTime, setBookingTime] = useState('10:00');
    const [bookingType, setBookingType] = useState<'OFFLINE' | 'ONLINE'>('OFFLINE');
    const [notes, setNotes] = useState('');
    const [booking, setBooking] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const searchPatients = async () => {
        if (!searchQuery.trim() || searchQuery.length < 2) return;

        setSearching(true);
        setError(null);

        try {
            const res = await fetch(`/api/doctor/search-patients?q=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                setPatients(data.patients || []);
                if (data.patients?.length === 0) {
                    setError('No patients found matching your search.');
                }
            } else {
                setError('Search failed');
            }
        } catch (e) {
            setError('Network error during search');
        } finally {
            setSearching(false);
        }
    };

    const handleBookFollowUp = async () => {
        if (!selectedPatient) return;

        setBooking(true);
        setError(null);

        try {
            const res = await fetch('/api/doctor/follow-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patientId: selectedPatient.id,
                    doctorId,
                    requestedTime: new Date(`${bookingDate}T${bookingTime}:00`).toISOString(),
                    type: bookingType,
                    notes
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                    setSelectedPatient(null);
                    setSearchQuery('');
                    setPatients([]);
                    router.refresh();
                }, 2000);
            } else {
                setError(data.error || 'Failed to book follow-up');
            }
        } catch (e: any) {
            setError(e.message || 'Network error');
        } finally {
            setBooking(false);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm shadow-md transition active:scale-[0.98]"
            >
                <UserPlus size={16} />
                Book Follow-Up
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        {success ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="text-emerald-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Follow-Up Booked!</h3>
                                <p className="text-sm text-muted-foreground">
                                    Appointment created for {selectedPatient?.userName} on{' '}
                                    {format(new Date(`${bookingDate}T${bookingTime}`), 'MMM d, h:mm a')}.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-border">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <Stethoscope className="text-primary" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">Book Follow-Up Appointment</h3>
                                            <p className="text-xs text-muted-foreground">Search for a patient by name or email</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Patient Search */}
                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-2 uppercase tracking-wider">
                                            Search Patient
                                        </label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && searchPatients()}
                                                    placeholder="Patient name or email..."
                                                    className="w-full pl-9 pr-3 py-2.5 border border-border rounded-xl bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={searchPatients}
                                                disabled={searching || searchQuery.length < 2}
                                                className="px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm transition disabled:opacity-50 flex items-center gap-1.5"
                                            >
                                                {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                                                Find
                                            </button>
                                        </div>
                                    </div>

                                    {/* Search Results */}
                                    {patients.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                                {patients.length} Patient{patients.length !== 1 ? 's' : ''} Found
                                            </p>
                                            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-border rounded-xl p-2">
                                                {patients.map(p => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => setSelectedPatient(p)}
                                                        className={clsx(
                                                            "w-full text-left p-3 rounded-lg transition flex items-center justify-between",
                                                            selectedPatient?.id === p.id
                                                                ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
                                                                : "hover:bg-muted border border-transparent"
                                                        )}
                                                    >
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{p.userName}</p>
                                                            <p className="text-xs text-muted-foreground">{p.userEmail}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                                                {p.appointmentCount} visits
                                                            </span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Appointment Details (shown after selecting patient) */}
                                    {selectedPatient && (
                                        <div className="space-y-3 pt-2 border-t border-border">
                                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                                                    {selectedPatient.userName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{selectedPatient.userName}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedPatient.gender || 'N/A'} • {selectedPatient.bloodGroup || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs font-bold text-foreground mb-1">Date</label>
                                                    <select
                                                        value={bookingDate}
                                                        onChange={e => setBookingDate(e.target.value)}
                                                        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                                                    >
                                                        <option value={format(new Date(), 'yyyy-MM-dd')}>Today</option>
                                                        <option value={format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')}>Tomorrow</option>
                                                        <option value={format(new Date(Date.now() + 86400000 * 2), 'yyyy-MM-dd')}>
                                                            {format(new Date(Date.now() + 86400000 * 2), 'MMM d')}
                                                        </option>
                                                        <option value={format(new Date(Date.now() + 86400000 * 7), 'yyyy-MM-dd')}>
                                                            {format(new Date(Date.now() + 86400000 * 7), 'MMM d')} (1 wk)
                                                        </option>
                                                        <option value={format(new Date(Date.now() + 86400000 * 14), 'yyyy-MM-dd')}>
                                                            {format(new Date(Date.now() + 86400000 * 14), 'MMM d')} (2 wk)
                                                        </option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-foreground mb-1">Time</label>
                                                    <input
                                                        type="time"
                                                        value={bookingTime}
                                                        onChange={e => setBookingTime(e.target.value)}
                                                        className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1">Type</label>
                                                <div className="flex gap-2">
                                                    {(['OFFLINE', 'ONLINE'] as const).map(t => (
                                                        <button
                                                            key={t}
                                                            onClick={() => setBookingType(t)}
                                                            className={clsx(
                                                                "flex-1 py-2 rounded-lg text-xs font-bold border transition",
                                                                bookingType === t
                                                                    ? t === 'ONLINE'
                                                                        ? "bg-purple-50 border-purple-300 text-purple-700"
                                                                        : "bg-blue-50 border-blue-300 text-blue-700"
                                                                    : "bg-background border-border text-muted-foreground hover:bg-muted"
                                                            )}
                                                        >
                                                            {t === 'ONLINE' ? '📹 Digital' : '🏥 In-Person'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-foreground mb-1">Follow-Up Notes</label>
                                                <textarea
                                                    value={notes}
                                                    onChange={e => setNotes(e.target.value)}
                                                    placeholder="e.g. Review lab results, check medication response..."
                                                    rows={2}
                                                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                                            <AlertCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-red-700">{error}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setOpen(false)}
                                            className="flex-1 py-2.5 border border-border bg-background hover:bg-muted text-foreground rounded-xl font-bold text-sm transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleBookFollowUp}
                                            disabled={!selectedPatient || booking || !bookingTime}
                                            className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg"
                                        >
                                            {booking ? (
                                                <Loader2 size={16} className="animate-spin" />
                                            ) : (
                                                <Calendar size={16} />
                                            )}
                                            Book Follow-Up
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
