"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Video, MapPin, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";

type Slot = {
    id: string;
    startTime: string;
    doctor: {
        user: { name: string };
        specialization: string;
    };
};

export default function BookPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [type, setType] = useState<"irl" | "digital" | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);

    useEffect(() => {
        if (step === 2) {
            setLoading(true);
            fetch('/api/slots')
                .then(res => res.json())
                .then(data => {
                    setSlots(data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, [step]);

    const handleBooking = async () => {
        if (!selectedSlot || !type) return;
        setBooking(true);
        console.log("Attempting booking:", { type, slotId: selectedSlot.id });

        try {
            const res = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    slotId: selectedSlot.id
                })
            });

            const data = await res.json();
            console.log("Booking response:", data);

            if (res.ok) {
                setStep(3);
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
        <div className="container py-20 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Book Your Appointment</h1>
                    <p className="text-slate-600 dark:text-slate-300">Scheduled for better health in 3 simple steps.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 w-full h-1 bg-slate-100 -z-10" />
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-4 border-white",
                            step >= s ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-400"
                        )}>
                            {step > s ? <Check size={20} /> : s}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="glass-card bg-card text-card-foreground p-8 rounded-3xl border border-border shadow-xl">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-5 fade-in">
                            <h2 className="text-2xl font-bold">Select Consultation Type</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setType("irl")}
                                    className={clsx(
                                        "p-6 rounded-xl border-2 text-left transition-all hover:scale-105",
                                        type === "irl" ? "border-teal-500 bg-teal-50" : "border-slate-100 hover:border-teal-200"
                                    )}
                                >
                                    <div className="bg-blue-100/10 w-12 h-12 rounded-lg flex items-center justify-center text-blue-500 mb-4">
                                        <MapPin size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg">In-Person Visit</h3>
                                    <p className="text-sm text-muted-foreground mt-2">Visit our hospital in Vadasery for a physical checkup.</p>
                                </button>

                                <button
                                    onClick={() => setType("digital")}
                                    className={clsx(
                                        "p-6 rounded-xl border-2 text-left transition-all hover:scale-105",
                                        type === "digital" ? "border-purple-500 bg-purple-50" : "border-slate-100 hover:border-purple-200"
                                    )}
                                >
                                    <div className="bg-purple-100/10 w-12 h-12 rounded-lg flex items-center justify-center text-purple-500 mb-4">
                                        <Video size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg">Digital Consult</h3>
                                    <p className="text-sm text-muted-foreground mt-2">Video call with a specialist from the comfort of your home.</p>
                                </button>
                            </div>
                            <button
                                disabled={!type}
                                onClick={() => setStep(2)}
                                className="btn btn-primary w-full py-4 justify-center text-lg mt-6"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-5 fade-in">
                            <h2 className="text-2xl font-bold">Choose Available Slot</h2>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-teal-500" size={32} />
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No slots available. Please try again later.
                                </div>
                            ) : (
                                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                                    {Object.values(slots.reduce((acc, slot) => {
                                        const doctorName = slot.doctor.user.name;
                                        if (!acc[doctorName]) {
                                            acc[doctorName] = { doctor: slot.doctor, slots: [] };
                                        }
                                        acc[doctorName].slots.push(slot);
                                        return acc;
                                    }, {} as Record<string, { doctor: any, slots: Slot[] }>)).map(({ doctor, slots: doctorSlots }) => (
                                        <div key={doctor.user.name} className="border border-border rounded-xl p-4 bg-background shadow-sm">
                                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                                                <div>
                                                    <h3 className="font-bold text-lg">{doctor.user.name}</h3>
                                                    <p className="text-sm text-teal-500 font-medium">{doctor.specialization}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {doctorSlots.map((slot) => (
                                                    <button
                                                        key={slot.id}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        className={clsx(
                                                            "px-4 py-2 rounded-lg border text-sm transition-all hover:shadow-sm font-medium",
                                                            selectedSlot?.id === slot.id
                                                                ? "border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-200"
                                                                : "border-slate-200 hover:border-teal-400 text-slate-700 bg-slate-50"
                                                        )}
                                                    >
                                                        {format(new Date(slot.startTime), 'MMM d, h:mm a')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-4 pt-4 border-t border-slate-100">
                                <button onClick={() => setStep(1)} className="btn btn-ghost">Back</button>
                                <button
                                    disabled={!selectedSlot || booking}
                                    onClick={handleBooking}
                                    className="btn btn-primary flex-1 items-center justify-center gap-2"
                                >
                                    {booking && <Loader2 className="animate-spin" size={16} />}
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center animate-in zoom-in fade-in duration-500">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Check size={40} />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
                            <p className="text-muted-foreground mb-8">Your appointment has been scheduled.</p>
                            <div className="bg-background border border-border p-6 rounded-xl text-left space-y-3 mb-8">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-bold capitalize">{type === 'irl' ? 'In-Person' : 'Digital Consultation'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date</span>
                                    <span className="font-bold">
                                        {selectedSlot && format(new Date(selectedSlot.startTime), 'PP p')}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Doctor</span>
                                    <span className="font-bold">{selectedSlot?.doctor.user.name}</span>
                                </div>
                            </div>
                            <button onClick={() => router.push('/patient')} className="btn btn-primary w-full">Go to Dashboard</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
