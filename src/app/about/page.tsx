"use client";

import Navbar from '@/components/Navbar';
import StatsSection from '@/components/StatsSection';
import { ShieldCheck, Users, Target, Award } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';

export default function AboutPage() {
    const { theme } = useTheme();

    const isMinimal = theme === 'minimal';
    const isDark = ['modern', 'cyberpunk'].includes(theme);

    return (
        <div className={clsx(
            "min-h-screen pb-24 font-sans transition-colors duration-300 relative overflow-hidden",
            isMinimal ? "bg-white text-black font-mono" :
                isDark ? "bg-slate-950 text-white selection:bg-cyan-500/30" :
                    "bg-zinc-50 text-slate-900"
        )}>
            <Navbar />

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
                "pt-32 pb-20 px-6 text-center relative overflow-hidden transition-colors duration-300 z-10",
                isMinimal ? "bg-white border-b-4 border-black" :
                    isDark ? "bg-transparent text-white" :
                        "bg-primary text-primary-foreground"
            )}>
                <div className="relative z-10 max-w-3xl mx-auto">
                    {isMinimal && (
                        <div className="inline-block border-2 border-black px-3 py-1 text-xs font-bold uppercase mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 text-black">
                            Est. 1998 // Legacy
                        </div>
                    )}
                    <h1 className={clsx(
                        "text-4xl md:text-5xl font-bold mb-6",
                        isMinimal ? "font-black uppercase tracking-tighter" :
                            isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-200" :
                                "font-heading"
                    )}>
                        Pioneering Healthcare Excellence
                    </h1>
                    <p className={clsx(
                        "text-lg leading-relaxed max-w-2xl mx-auto",
                        isMinimal ? "font-bold uppercase opacity-100" : "opacity-90 font-body"
                    )}>
                        Grandview Medical Center has been a beacon of hope and healing for over 25 years.
                        We combine cutting-edge technology with compassionate care.
                    </p>
                </div>
                {/* Background Pattern */}
                {!isMinimal && !isDark && (
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')]"></div>
                )}
            </div>

            {/* Mission & Vision */}
            <div className="container mx-auto px-6 py-16 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className={clsx(
                            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider",
                            isMinimal ? "bg-black text-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]" :
                                isDark ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" :
                                    "bg-secondary text-secondary-foreground"
                        )}>
                            <Target size={16} /> Our Mission
                        </div>
                        <h2 className={clsx("text-3xl font-bold", isMinimal ? "uppercase font-black" : isDark ? "text-white" : "font-heading")}>To Enhance the Quality of Life</h2>
                        <p className={clsx(
                            "leading-relaxed",
                            isMinimal ? "text-black font-medium" : isDark ? "text-slate-400" : "text-muted-foreground"
                        )}>
                            We are dedicated to providing the highest standard of medical care to our community.
                            Our patient-centric approach ensures that every individual receives personalized attention
                            and the best possible treatment outcomes.
                        </p>
                        <ul className="space-y-3 pt-4">
                            {[
                                "Patient-First Philosophy",
                                "Continuous Medical Innovation",
                                "Compassionate Care Standards"
                            ].map((item, i) => (
                                <li key={i} className={clsx("flex items-center gap-3 font-medium", isDark ? "text-slate-300" : "")}>
                                    <ShieldCheck className={isMinimal ? "text-black" : isDark ? "text-cyan-400" : "text-green-500"} /> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={clsx(
                        "relative h-[400px] overflow-hidden",
                        isMinimal ? "border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] grayscale" :
                            isDark ? "rounded-2xl border border-white/10 shadow-lg" :
                                "rounded-2xl shadow-2xl skew-x-1 hover:skew-x-0 transition-transform duration-700"
                    )}>
                        <img
                            src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2128&auto=format&fit=crop"
                            alt="Hospital Building"
                            className="object-cover w-full h-full"
                        />
                        {/* Overlay for Dark mode to blend image better */}
                        {isDark && <div className="absolute inset-0 bg-slate-900/20 mix-blend-overlay"></div>}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <StatsSection
                patientCount="50k+"
                doctorCount="120+"
                serviceCount="40+"
                experience="25 Years"
            />

            {/* Leadership */}
            <div className="container mx-auto px-6 py-16 relative z-10">
                <h2 className={clsx("text-3xl font-bold text-center mb-12", isMinimal ? "font-black uppercase" : isDark ? "text-white" : "font-heading")}>Medical Leadership</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Dr. James Wilson", role: "Chief Medical Officer", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop" },
                        { name: "Dr. Sarah Jenkins", role: "Head of Surgery", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop" },
                        { name: "Dr. Emily Chen", role: "Pediatric Director", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2070&auto=format&fit=crop" }
                    ].map((leader, i) => (
                        <div key={i} className={clsx("text-center group p-6 rounded-2xl transition", isDark ? "hover:bg-white/5" : "")}>
                            <div className={clsx(
                                "w-40 h-40 mx-auto overflow-hidden mb-4 transition-colors",
                                isMinimal ? "rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grayscale" :
                                    isDark ? "rounded-full border-4 border-white/10 group-hover:border-cyan-500/50" :
                                        "rounded-full border-4 border-border group-hover:border-primary"
                            )}>
                                <img src={leader.img} alt={leader.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className={clsx("text-xl font-bold transition-colors", isDark ? "text-white group-hover:text-cyan-400" : "")}>{leader.name}</h3>
                            <p className={clsx("text-sm", isMinimal ? "text-black font-bold uppercase" : isDark ? "text-slate-400" : "text-muted-foreground")}>{leader.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
