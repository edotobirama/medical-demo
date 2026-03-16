"use client";

import { Microscope, Activity, Stethoscope, Calendar, MapPin, Clock } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Service {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number | string;
    duration: number;
    image: string | null;
}

interface Program {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    image: string | null;
}

export default function ServicesContent({
    treatments,
    infrastructure,
    programs
}: {
    treatments: Service[],
    infrastructure: Service[],
    programs: Program[]
}) {
    const { theme } = useTheme();
    const isMinimal = theme === 'minimal';
    const isDark = ['modern', 'cyberpunk'].includes(theme);
    const isNature = theme === 'nature';
    const isPlayful = theme === 'playful';

    return (
        <div className={clsx(
            "min-h-screen pb-24 transition-colors duration-300 relative overflow-hidden",
            isMinimal ? "bg-white text-black font-mono" :
                isDark ? "bg-slate-950 text-white selection:bg-cyan-500/30" :
                    isNature ? "bg-[#F1F0E8] text-[#2C362B]" :
                        isPlayful ? "bg-rose-50 text-rose-900" :
                            "bg-background text-foreground"
        )}>

            {/* Modern Background Blobs */}
            {isDark && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-[20%] right-[30%] w-[20vw] h-[20vw] bg-blue-500/10 rounded-full blur-[80px]" />
                </div>
            )}

            {/* Hero Section */}
            <div className={clsx(
                "pt-32 pb-20 px-6 text-center transition-colors relative z-10",
                isMinimal ? "bg-white border-b-4 border-black" :
                    isDark ? "bg-transparent text-white" :
                        isNature ? "bg-[#4A5D45] text-[#F1F0E8]" :
                            isPlayful ? "bg-rose-200 text-rose-900" :
                                "bg-emerald-900 text-white"
            )}>
                <h1 className={clsx(
                    "text-4xl md:text-5xl font-bold mb-4",
                    isMinimal ? "font-black uppercase tracking-tighter" :
                        isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-200" :
                            "font-heading"
                )}>
                    Medical Excellence & Care
                </h1>
                <p className={clsx(
                    "max-w-2xl mx-auto text-lg opacity-90",
                    isMinimal ? "font-bold text-black opacity-100" :
                        isDark ? "text-slate-400" :
                            isNature ? "text-[#E5E9DF]" :
                                isPlayful ? "text-rose-900 opacity-80" :
                                    "text-emerald-100"
                )}>
                    From advanced surgical theaters to community wellness, we provide holistic healthcare solutions.
                </p>
                {isMinimal && (
                    <div className="mt-6 inline-block border-2 border-black bg-yellow-400 text-black px-4 py-1 font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        Full Service List
                    </div>
                )}
            </div>

            <div className="container mx-auto px-6 space-y-24 -mt-10 relative z-20">

                {/* Treatments Section */}
                <section>
                    <div className={clsx("flex items-center gap-3 mb-8 p-6 rounded-2xl",
                        isMinimal ? "bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" :
                            isDark ? "bg-white/5 backdrop-blur-md border border-white/10" :
                                isNature ? "bg-white/80 shadow-md text-[#2C362B]" :
                                    isPlayful ? "bg-white/80 shadow-md text-rose-900 border-2 border-rose-100" :
                                        "bg-white/80 backdrop-blur-sm shadow-sm"
                    )}>
                        <div className={clsx("p-3 rounded-xl",
                            isMinimal ? "bg-black text-white rounded-none" :
                                isDark ? "bg-cyan-500/10 text-cyan-400" :
                                    isNature ? "bg-[#4A5D45]/10 text-[#4A5D45]" :
                                        isPlayful ? "bg-rose-100 text-rose-500" :
                                            "bg-emerald-100 text-emerald-700"
                        )}>
                            <Stethoscope className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className={clsx("text-3xl font-bold", isMinimal ? "text-black uppercase" : isDark ? "text-white" : "text-gray-900")}>Treatments & Consultations</h2>
                            <p className={clsx(isMinimal ? "text-black font-medium" : isDark ? "text-slate-400" : "text-gray-500")}>Expert care across multiple specialities</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {treatments.map((item) => (
                            <div key={item.id} className={clsx(
                                "overflow-hidden transition group flex flex-col",
                                isMinimal ? "bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none" :
                                    isDark ? "bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]" :
                                        isPlayful ? "bg-white rounded-3xl hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.3)] shadow-sm border border-rose-100" :
                                            "bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl"
                            )}>
                                <div className={clsx("h-48 overflow-hidden relative",
                                    isMinimal ? "border-b-4 border-black grayscale" :
                                        isDark ? "bg-slate-900/50" :
                                            "bg-gray-100"
                                )}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Stethoscope className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className={clsx("font-bold text-lg mb-2 truncate", isMinimal ? "uppercase" : isDark ? "text-white" : "")} title={item.name}>{item.name}</h3>
                                    <p className={clsx("text-sm line-clamp-2 mb-4 h-10", isDark ? "text-slate-400" : "text-gray-500")}>{item.description}</p>
                                    <div className={clsx(
                                        "flex items-center justify-between text-sm font-medium mt-auto px-3 py-1.5",
                                        isMinimal ? "bg-black text-white font-bold" :
                                            isDark ? "bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/20" :
                                                isNature ? "bg-[#4A5D45]/10 text-[#4A5D45] rounded-lg" :
                                                    isPlayful ? "bg-rose-100 text-rose-600 rounded-full px-4" :
                                                        "bg-emerald-50 text-emerald-700 rounded-lg"
                                    )}>
                                        <span>${Number(item.price)}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {item.duration}m</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Infrastructure Section */}
                <section>
                    <div className={clsx("flex items-center gap-3 mb-8 p-6 rounded-2xl",
                        isMinimal ? "bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" :
                            isDark ? "bg-white/5 backdrop-blur-md border border-white/10" :
                                "bg-white/80 backdrop-blur-sm shadow-sm"
                    )}>
                        <div className={clsx("p-3 rounded-xl",
                            isMinimal ? "bg-black text-white rounded-none" :
                                isDark ? "bg-blue-500/10 text-blue-400" :
                                    "bg-blue-100 text-blue-700"
                        )}>
                            <Microscope className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className={clsx("text-3xl font-bold", isMinimal ? "text-black uppercase" : isDark ? "text-white" : "text-gray-900")}>Infrastructure & Diagnostics</h2>
                            <p className={clsx(isMinimal ? "text-black font-medium" : isDark ? "text-slate-400" : "text-gray-500")}>State-of-the-art labs and scanning centers</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {infrastructure.map((item) => (
                            <div key={item.id} className={clsx(
                                "relative group overflow-hidden aspect-video",
                                isMinimal ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grayscale" : "rounded-2xl shadow-lg"
                            )}>
                                <img src={item.image || '/images/services/infrastructure_mri.png'} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-110" />
                                <div className={clsx(
                                    "absolute inset-0 p-6 flex flex-col justify-end transition-opacity duration-300",
                                    isMinimal ? "bg-white/90 opacity-0 group-hover:opacity-100" :
                                        isDark ? "bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" :
                                            "bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent text-white"
                                )}>
                                    <h3 className={clsx("font-bold text-xl mb-1", isMinimal ? "text-black uppercase" : "text-white")}>{item.name}</h3>
                                    <p className={clsx("text-sm opacity-90 line-clamp-2", isMinimal ? "text-black" : "text-gray-300")}>{item.description}</p>
                                </div>
                                {/* Minimal Always-Visible Label if hover not active (mobile) or simplistic view */}
                                {isMinimal && (
                                    <div className="absolute top-0 left-0 bg-black text-white px-3 py-1 font-bold text-xs uppercase">
                                        INFRA // {item.name}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Programs & Events Section */}
                <section className={clsx(
                    "-mx-6 px-6 py-16",
                    isMinimal ? "bg-yellow-400 border-t-4 border-b-4 border-black" :
                        isDark ? "bg-slate-900/50 border border-white/5 rounded-3xl" :
                            "bg-gray-50 rounded-3xl"
                )}>
                    <div className="container mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-12 text-center">
                            <div className={clsx("p-3 rounded-xl",
                                isMinimal ? "bg-black text-white rounded-none" :
                                    isDark ? "bg-amber-500/10 text-amber-500" :
                                        "bg-amber-100 text-amber-700"
                            )}>
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div className="text-left">
                                <h2 className={clsx("text-3xl font-bold", isMinimal ? "text-black uppercase" : isDark ? "text-white" : "text-gray-900")}>Programs & Events</h2>
                                <p className={clsx(isMinimal ? "text-black font-medium" : isDark ? "text-slate-400" : "text-gray-500")}>Community wellness initiatives</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {programs.map((prog) => (
                                <div key={prog.id} className={clsx(
                                    "overflow-hidden flex flex-col transition duration-300",
                                    isMinimal ? "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none hover:shadow-none hover:translate-x-1 hover:translate-y-1" :
                                        isDark ? "bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1" :
                                            "bg-white rounded-2xl shadow-md hover:-translate-y-1"
                                )}>
                                    <div className={clsx("h-56 relative", isMinimal ? "border-b-4 border-black grayscale" : "")}>
                                        <img src={prog.image || '/images/services/event_wellness.png'} alt={prog.title} className="w-full h-full object-cover" />
                                        <div className={clsx(
                                            "absolute top-4 right-4 px-3 py-1 text-xs font-bold uppercase tracking-wide",
                                            isMinimal ? "bg-black text-white border-2 border-white" :
                                                isDark ? "bg-slate-950/80 text-white backdrop-blur border border-white/10 rounded-lg" :
                                                    "bg-white/90 backdrop-blur shadow-sm text-gray-800 rounded-lg"
                                        )}>
                                            {new Date(prog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className={clsx("text-xl font-bold mb-3", isMinimal ? "text-black uppercase" : isDark ? "text-white" : "text-gray-900")}>{prog.title}</h3>
                                        <p className={clsx("mb-6 flex-1", isMinimal ? "text-black font-medium" : isDark ? "text-slate-400" : "text-gray-600")}>{prog.description}</p>
                                        <div className={clsx(
                                            "flex items-center gap-2 text-sm font-medium pt-4 border-t",
                                            isMinimal ? "border-black text-black" :
                                                isDark ? "border-white/10 text-slate-500" : "border-gray-100 text-gray-500"
                                        )}>
                                            <MapPin className={clsx("w-4 h-4", isMinimal ? "text-black" : isDark ? "text-cyan-500" : "text-emerald-500")} />
                                            {prog.location}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
