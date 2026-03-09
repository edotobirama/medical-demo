"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Calendar, Clock, CheckCircle, Hash, Users, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import clsx from "clsx";

export default function DoctorBookingWidget({
    doctorId,
    userId,
    openingTime = "09:00",
    closingTime = "17:00"
}: {
    doctorId: string,
    userId?: string,
    openingTime?: string,
    closingTime?: string
}) {
    const router = useRouter();
    const [booking, setBooking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [paymentNumber, setPaymentNumber] = useState<string | null>(null);

    const { data: session, status } = useSession();

    const [requestedTime, setRequestedTime] = useState(() => {
        // default to next hour
        const d = new Date();
        d.setHours(d.getHours() + 1);
        d.setMinutes(0);
        return format(d, 'HH:mm');
    });

    // allow selection for today or tomorrow
    const [bookingDate, setBookingDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    const [issue, setIssue] = useState("");
    const [bookingType, setBookingType] = useState("in-person");

    const [simulation, setSimulation] = useState<any>(null);
    const [simulating, setSimulating] = useState(false);
    const [simError, setSimError] = useState<string | null>(null);

    // Call Simulation API
    useEffect(() => {
        const fetchSimulation = async () => {
            if (!requestedTime || !bookingDate) return;
            setSimulating(true);
            try {
                // Construct proper datetime string
                const timestamp = new Date(`${bookingDate}T${requestedTime}:00`);
                if (isNaN(timestamp.getTime())) return;

                const [reqH, reqM] = requestedTime.split(':').map(Number);
                const [openH, openM] = openingTime.split(':').map(Number);
                const [closeH, closeM] = closingTime.split(':').map(Number);

                const reqMins = reqH * 60 + reqM;
                const openMins = openH * 60 + openM;
                const closeMins = closeH * 60 + closeM;

                if (reqMins < openMins || reqMins > closeMins) {
                    setSimError(`Doctor available only between ${openingTime} and ${closingTime}`);
                    setSimulation(null);
                    setSimulating(false);
                    return;
                }

                const res = await fetch('/api/booking/simulate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        doctorId,
                        requestedTime: timestamp.toISOString(),
                        issueDescription: issue
                    })
                });

                if (res.ok) {
                    const data = await res.json();
                    setSimulation(data);
                    setSimError(null);
                } else {
                    console.error("Simulation error response", res.status);
                    setSimulation(null);
                    setSimError("Failed to calculate queue. Please try again.");
                }
            } catch (err) {
                console.error("Simulation error", err);
                setSimulation(null);
                setSimError("Network error. Could not connect to the queue system.");
            } finally {
                setSimulating(false);
            }
        };

        const debounce = setTimeout(fetchSimulation, 500);
        return () => clearTimeout(debounce);
    }, [doctorId, requestedTime, bookingDate, issue]);

    const handlePaymentInitiation = () => {
        const isAuthenticated = !!userId || !!session;
        if (!isAuthenticated) {
            const returnUrl = encodeURIComponent(`/doctors/${doctorId}`);
            router.push(`/login?callbackUrl=${returnUrl}`);
            return;
        }
        setShowPayment(true);
    };

    const handleBooking = async () => {
        setBooking(true);

        try {
            const timestamp = new Date(`${bookingDate}T${requestedTime}:00`).toISOString();

            const res = await fetch('/api/booking/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    doctorId,
                    type: bookingType, // 'in-person' or 'digital'
                    requestedTime: timestamp,
                    issueDescription: issue
                })
            });

            const data = await res.json();

            if (res.ok) {
                setPaymentNumber(`PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
                setShowPayment(false);
                setIsSuccess(true);
            } else {
                alert(`Booking Failed: ${data.error || "Unknown error"}`);
            }
        } catch (e) {
            console.error("Booking Error:", e);
            alert("Network error or server unavailable.");
        }
        setBooking(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg border border-border p-6 sticky top-24">
                <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Priority Waitlist Booking
                </h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Select Date</label>
                        <select
                            value={bookingDate}
                            onChange={e => setBookingDate(e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value={format(new Date(), 'yyyy-MM-dd')}>Today ({format(new Date(), 'MMM d')})</option>
                            <option value={format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')}>Tomorrow ({format(new Date(Date.now() + 86400000), 'MMM d')})</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Appointment Type</label>
                        <select
                            value={bookingType}
                            onChange={e => setBookingType(e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="in-person">In-Person Visit</option>
                            <option value="digital">Digital Consultation</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Exact Requested Time</label>
                        <input
                            type="time"
                            value={requestedTime}
                            onChange={e => setRequestedTime(e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-primary">Exact minute supported.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-foreground mb-1">Medical Issue (optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. Headache, Checkup..."
                            value={issue}
                            onChange={e => setIssue(e.target.value)}
                            className="w-full border border-border rounded-lg px-3 py-2 bg-background focus:ring-2 focus:ring-primary outline-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Used by AI to calculate expected visit duration.</p>
                    </div>
                </div>

                {/* Live Waitlist Info - Integrated & Dynamic */}
                <div className={clsx(
                    "mb-6 rounded-xl p-4 border transition-all relative overflow-hidden",
                    "bg-secondary/30 border-primary/20"
                )}>
                    {simulating && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                            <Loader2 className="animate-spin text-primary" size={24} />
                        </div>
                    )}

                    <h4 className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        Live Queue Simulation
                    </h4>

                    {simulation ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-background rounded-lg p-3 border border-border text-center shadow-sm">
                                    <div className="text-xs font-semibold text-muted-foreground mb-1 flex justify-center items-center gap-1">
                                        <Hash className="w-3 h-3" /> Booking #
                                    </div>
                                    <div className="text-2xl font-black text-foreground">#{simulation.bookingNumber}</div>
                                </div>
                                <div className="bg-background rounded-lg p-3 border border-border text-center shadow-sm">
                                    <div className="text-xs font-semibold text-muted-foreground mb-1 flex justify-center items-center gap-1">
                                        <Users className="w-3 h-3" /> Ahead of You
                                    </div>
                                    <div className="text-2xl font-black text-foreground">{simulation.estimatedWaitlist}</div>
                                </div>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-100 dark:border-orange-900/40">
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-semibold text-orange-900 dark:text-orange-400">Est. Wait Time:</span>
                                    <span className="font-bold text-orange-700 dark:text-orange-500">{simulation.estimatedWaitTime} mins</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-semibold text-foreground">Actual Start Time:</span>
                                    <span className="font-bold text-primary">{format(new Date(simulation.actualStartTime), 'h:mm a')}</span>
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-2 border-t pt-2 border-orange-200/50">
                                    AI estimated duration: {simulation.estimatedDuration} mins
                                </div>
                            </div>
                        </div>
                    ) : simError ? (
                        <div className="text-center py-6 text-red-500 text-sm font-semibold">
                            {simError}
                        </div>
                    ) : simError ? (
                        <div className="text-center py-6 text-rose-500 text-sm font-medium bg-rose-50 rounded-xl border border-rose-100">
                            {simError}
                        </div>
                    ) : (
                        <div className="text-center py-6 text-muted-foreground text-sm">
                            Enter time to calculate your priority and Waitlist position.
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-border">
                    <button
                        onClick={handlePaymentInitiation}
                        disabled={booking || showPayment || !simulation || simulating || simError !== null}
                        className={clsx(
                            "w-full py-4 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2",
                            booking || !simulation || simulating || simError !== null
                                ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                : "bg-primary hover:bg-primary/90 text-primary-foreground group"
                        )}
                    >
                        {booking ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                <CreditCard className="w-4 h-4 group-hover:-translate-y-0.5 transition" />
                                Pay & Secure ##{simulation?.bookingNumber ?? '-'}
                            </>
                        )}
                    </button>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        Minimal upfront fee required to secure your Booking Number priority.
                    </p>
                </div>
            </div>

            {showPayment && !isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <CreditCard size={48} className="text-primary mb-4" />
                            <h3 className="text-xl font-bold text-card-foreground mb-2">Simulate Payment</h3>
                            <p className="text-muted-foreground mb-6 text-sm">
                                Click OK to confirm your partial payment and secure booking #{simulation?.bookingNumber}.
                            </p>
                            <div className="flex gap-4 w-full">
                                <button
                                    onClick={() => setShowPayment(false)}
                                    className="w-full py-3 border border-border bg-background hover:bg-muted text-foreground rounded-xl font-bold transition"
                                    disabled={booking}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBooking}
                                    disabled={simulating || booking || !simulation || simError !== null}
                                    className="w-full mt-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-4 focus:ring-primary/20 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                                >
                                    {booking ? (<Loader2 className="animate-spin" size={18} />) : "OK"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-2">Booking Confirmed!</h3>

                            <div className="bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-3 w-full mb-4 space-y-1">
                                <div className="flex justify-between items-center font-medium text-sm">
                                    <span>Status:</span>
                                    <span className="font-bold bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-md text-emerald-700 dark:text-emerald-300">Paid</span>
                                </div>
                                <div className="flex justify-between items-center font-medium text-sm">
                                    <span>Payment No:</span>
                                    <span className="font-bold font-mono text-xs text-muted-foreground">{paymentNumber}</span>
                                </div>
                            </div>

                            <p className="text-muted-foreground mb-6 text-sm">
                                Your priority number is <strong>#{simulation?.bookingNumber}</strong>. <br />
                                Please monitor the live queue.
                            </p>
                            <button
                                onClick={() => router.push('/patient')}
                                className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition shadow-lg"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
