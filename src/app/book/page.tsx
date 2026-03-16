"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Video, MapPin, Check, Loader2, ArrowRight, User } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

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
        <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] -z-10" />

            <div className="container py-24 relative z-10">
                <div className="max-w-3xl mx-auto space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
                            Book Your <span className="text-emerald-500 italic font-serif">Priority</span> Visit
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl mx-auto font-medium leading-relaxed">
                            Experience our elite healthcare concierge with live waitlist tracking and instant specialist access.
                        </p>
                    </div>

                    {/* Steps Indicator */}
                    <div className="flex items-center justify-center gap-12 mb-12 relative">
                        {[1, 2].map((s) => (
                            <div key={s} className="flex flex-col items-center gap-3">
                                <div className={clsx(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-500 shadow-2xl",
                                    step >= s 
                                        ? "bg-emerald-500 text-slate-950 scale-110 shadow-emerald-500/20" 
                                        : "bg-slate-900 text-slate-500 border border-white/5"
                                )}>
                                    {step > s ? <Check size={24} strokeWidth={3} /> : s}
                                </div>
                                <span className={clsx("text-xs font-bold uppercase tracking-widest", step >= s ? "text-emerald-500" : "text-slate-600")}>
                                    Step {s}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
                        {step === 1 && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Select Experience</h2>
                                    <p className="text-slate-400 font-medium">Choose how you wish to connect with our specialists.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => setType("irl")}
                                        className={clsx(
                                            "group p-8 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden",
                                            type === "irl" 
                                                ? "border-emerald-500/50 bg-emerald-500/10 shadow-2xl shadow-emerald-500/10" 
                                                : "border-white/5 bg-white/5 hover:border-white/20 hover:translate-y-[-4px]"
                                        )}
                                    >
                                        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 mb-6 group-hover:scale-110 transition-transform">
                                            <MapPin size={28} />
                                        </div>
                                        <h3 className="font-bold text-xl mb-2 text-white">In-Person Visit</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Access physical diagnostics and hands-on care at our center of excellence.</p>
                                        {type === 'irl' && <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />}
                                    </button>

                                    <button
                                        onClick={() => setType("digital")}
                                        className={clsx(
                                            "group p-8 rounded-3xl border transition-all duration-300 text-left relative overflow-hidden",
                                            type === "digital" 
                                                ? "border-purple-500/50 bg-purple-500/10 shadow-2xl shadow-purple-500/10" 
                                                : "border-white/5 bg-white/5 hover:border-white/20 hover:translate-y-[-4px]"
                                        )}
                                    >
                                        <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                                            <Video size={28} />
                                        </div>
                                        <h3 className="font-bold text-xl mb-2 text-white">Concierge Telehealth</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">Connect with elite specialists worldwide via our secure 4K video infrastructure.</p>
                                        {type === 'digital' && <div className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />}
                                    </button>
                                </div>

                                <button
                                    disabled={!type}
                                    onClick={() => setStep(2)}
                                    className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-20 disabled:cursor-not-allowed group"
                                >
                                    Continue to Specialists <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in slide-in-from-bottom-5 fade-in duration-500">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Select Elite Specialist</h2>
                                    <p className="text-slate-400 font-medium">Join the priority queue for our world-renowned faculty.</p>
                                </div>

                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                                        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Medical Directory...</p>
                                    </div>
                                ) : doctors.length === 0 ? (
                                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                                        <p className="text-slate-400 font-medium italic">No specialists are currently accepting priority intake.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                                        {doctors.map((doctor) => (
                                            <div key={doctor.id} className="group border border-white/5 rounded-[2rem] p-6 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 relative shadow-2xl">
                                                        {doctor.user.image ? (
                                                            <Image src={doctor.user.image} alt={doctor.user.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-700 bg-slate-900">
                                                                <User size={32} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-xl group-hover:text-emerald-400 transition-colors tracking-tight">{doctor.user.name}</h3>
                                                        <p className="text-emerald-500/80 font-bold text-xs uppercase tracking-widest mt-1">{doctor.specialization}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDoctorSelect(doctor.id)}
                                                    className="px-6 py-3 bg-white/10 hover:bg-emerald-500 hover:text-slate-950 font-black rounded-xl text-sm transition-all flex gap-3 items-center backdrop-blur-xl group/btn"
                                                >
                                                    Join Queue <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-6 border-t border-white/5">
                                    <button onClick={() => setStep(1)} className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-slate-400 hover:text-white transition-all">
                                        Change Type
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
