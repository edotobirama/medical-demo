"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Calendar, Clock, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import clsx from "clsx";

type Slot = {
    id: string;
    startTime: string;
    status: string;
};

export default function DoctorBookingWidget({ doctorId, userId }: { doctorId: string, userId?: string }) {
    const router = useRouter();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [booking, setBooking] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { data: session, status } = useSession();
    // Check debugging log
    // console.log("DoctorBookingWidget Session:", session, "Status:", status, "Prop UserId:", userId);

    const [waitlistData, setWaitlistData] = useState({ count: 0, estimatedTime: 0 });

    useEffect(() => {
        // Fetch Slots
        fetch(`/api/slots?doctorId=${doctorId}`)
            .then(res => res.json())
            .then(data => {
                setSlots(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch slots:", err);
                setLoading(false);
            });

        // Polling function for waitlist
        const fetchWaitlist = () => {
            fetch(`/api/waitlist?doctorId=${doctorId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && typeof data.count === 'number') {
                        setWaitlistData(data);
                    }
                })
                .catch(err => console.error("Failed to fetch waitlist:", err));
        };

        // Initial fetch
        fetchWaitlist();

        // Poll every 5 seconds
        const intervalId = setInterval(fetchWaitlist, 5000);

        return () => clearInterval(intervalId);

    }, [doctorId]);

    const handleBooking = async () => {
        if (!selectedSlot) return;

        // Use prop (server-side truth) OR client session
        const isAuthenticated = !!userId || !!session;

        if (!isAuthenticated) {
            console.log("No session found in handleBooking, redirecting...");
            const returnUrl = encodeURIComponent(`/doctors/${doctorId}`);
            router.push(`/login?callbackUrl=${returnUrl}`);
            return;
        }

        setBooking(true);

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'OFFLINE', // Default to offline for quick profile booking
                    slotId: selectedSlot.id
                })
            });

            const data = await res.json();

            if (res.ok) {
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

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <div className="flex justify-center py-8">
                    <Loader2 className="animate-spin text-teal-500" size={32} />
                </div>
            </div>
        );
    }

    // Group slots by date for better UI? For now, list simple.
    // Actually, let's just show next few available.
    const availableSlots = slots.filter(s => s.status === 'AVAILABLE').slice(0, 6);

    return (
        <>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-600" />
                    Book Appointment
                </h3>

                {/* Live Waitlist Info - Integrated & Dynamic */}
                <div className={clsx(
                    "mb-6 rounded-xl p-4 border transition-all",
                    selectedSlot ? "bg-emerald-50/50 border-emerald-100" : "bg-blue-50/50 border-blue-100"
                )}>
                    {selectedSlot ? (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm">
                                    <Clock className="w-4 h-4 text-emerald-600" />
                                    Expected Status
                                </div>
                                <span className="text-emerald-700 font-bold text-sm">
                                    {(() => {
                                        const now = new Date();
                                        const slotTime = new Date(selectedSlot.startTime);
                                        const minsUntilSlot = (slotTime.getTime() - now.getTime()) / 60000;

                                        // The current backlog (waitlist work) needs to be finished.
                                        // If backlog > time until slot, we are delayed.
                                        // If backlog < time until slot, we are likely on time.
                                        const delay = Math.round(Math.max(0, waitlistData.estimatedTime - minsUntilSlot));

                                        if (delay <= 0) return "On Time";
                                        return `~${delay} mins delay`;
                                    })()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-emerald-600/80">
                                <span>Based on current queue:</span>
                                <span className="font-medium">
                                    {Math.max(0, waitlistData.estimatedTime - Math.round(((new Date(selectedSlot.startTime).getTime() - new Date().getTime()) / 60000))) > 0
                                        ? "Queue overlap"
                                        : "Queue clear"}
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    Check Wait Time
                                </div>
                                <span className="text-blue-700 font-bold text-sm">-- mins</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-blue-600/80">
                                <span>Status:</span>
                                <span className="font-medium">Calculated per slot</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-400">
                                <span>Live Hospital Queue:</span>
                                <span className="font-semibold">{waitlistData.count} patients waiting</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
                        {availableSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {availableSlots.map(slot => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={clsx(
                                            "px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-2",
                                            selectedSlot?.id === slot.id
                                                ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200"
                                                : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50 text-gray-700"
                                        )}
                                    >
                                        <Clock size={14} />
                                        {format(new Date(slot.startTime), 'p')}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg text-sm border border-dashed border-gray-200">
                                No slots available recently. <br /> Check back later.
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button
                            onClick={handleBooking}
                            disabled={!selectedSlot || booking}
                            className={clsx(
                                "w-full py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2",
                                !selectedSlot || booking
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                                    : "bg-gray-900 hover:bg-gray-800 text-white"
                            )}
                        >
                            {booking ? <Loader2 className="animate-spin" size={18} /> : "Confirm Booking"}
                        </button>
                        {!selectedSlot && availableSlots.length > 0 && (
                            <p className="text-center text-xs text-gray-400 mt-2">Please select a time first</p>
                        )}
                        <p className="text-center text-xs text-gray-500 mt-3">
                            No payment required until confirmation.
                        </p>
                    </div>
                </div>
            </div>
            {isSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                            <p className="text-gray-500 mb-6 text-sm">
                                Your appointment has been secured. You can view details in your dashboard.
                            </p>
                            <button
                                onClick={() => router.push('/patient')}
                                className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition shadow-lg"
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
