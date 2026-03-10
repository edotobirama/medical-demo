"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Video, MapPin, Check, Loader2, ArrowRight } from "lucide-react";
import clsx from "clsx";

export default function BookPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [type, setType] = useState<"irl" | "digital" | null>(null);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (step === 2) {
            setLoading(true);
            // Fetch doctors instead of fixed slots, as scheduling is now fluid.
            fetch('/api/doctors')
                .then(res => res.json())
                .then(data => {
                    setDoctors(data);
                    setLoading(false);
                })
                .catch(err => setLoading(false));
        }
    }, [step]);

    const handleDoctorSelect = (doctorId: string) => {
        // We navigate to the doctor's page where the advanced Live Waitlist booking widget lives
        // Pass the selected consultation type so the booking widget can pre-select it
        router.push(`/doctors/${doctorId}?type=${type}`);
    };

    return (
        <div className="container py-20 min-h-screen bg-background text-foreground">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-foreground mb-4">Book Your Appointment</h1>
                    <p className="text-muted-foreground">Experience our new Priority Waitlist System.</p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-between mb-12 relative">
                    <div className="absolute top-1/2 w-full h-1 bg-secondary -z-10" />
                    {[1, 2].map((s) => (
                        <div key={s} className={clsx(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-4 border-background",
                            step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                            {step > s ? <Check size={20} /> : s}
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-card text-card-foreground p-8 rounded-3xl border border-border shadow-xl">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-5 fade-in">
                            <h2 className="text-2xl font-bold">Select Consultation Type</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setType("irl")}
                                    className={clsx(
                                        "p-6 rounded-xl border-2 text-left transition-all hover:scale-105",
                                        type === "irl" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
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
                                        type === "digital" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-border hover:border-purple-400/50"
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
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl justify-center text-lg mt-6 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-5 fade-in">
                            <h2 className="text-2xl font-bold">Choose a Specialist</h2>
                            <p className="text-muted-foreground text-sm">
                                Select a doctor to join their live priority waitlist queue.
                            </p>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                </div>
                            ) : doctors.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    No doctors available at the moment.
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {doctors.map((doctor) => (
                                        <div key={doctor.id} className="border border-border rounded-xl p-4 bg-background shadow-sm hover:shadow-md transition">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                                                        {doctor.user.image ? (
                                                            <img src={doctor.user.image} className="w-full h-full object-cover" />
                                                        ) : null}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">{doctor.user.name}</h3>
                                                        <p className="text-sm text-primary font-medium">{doctor.specialization}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDoctorSelect(doctor.id)}
                                                    className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold rounded-lg text-sm transition flex gap-2 items-center"
                                                >
                                                    View Live Queue <ArrowRight size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-border">
                                <button onClick={() => setStep(1)} className="px-6 py-2 border border-border rounded-lg font-bold text-muted-foreground hover:bg-muted transition">
                                    Back
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
