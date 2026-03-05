"use client";

import { motion } from "framer-motion";
import { ArrowRight, Activity, ShieldCheck, UserPlus, Play } from "lucide-react";
import Link from "next/link";

export default function HeroModern() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-slate-950 text-white selection:bg-cyan-500/30 font-sans">
            {/* 1. Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                <div className="absolute top-[20%] right-[30%] w-[20vw] h-[20vw] bg-blue-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="container relative z-10 px-6 mx-auto grid lg:grid-cols-2 gap-12 items-center">

                {/* 2. Content Column */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="space-y-8"
                >
                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-200">
                            The Future of Not Waiting.
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
                        Experience healthcare re-imagined. Advanced AI diagnostics meet compassionate human care, all without the wait time.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <Link href="/book" className="group relative px-8 py-4 bg-cyan-500 text-slate-950 font-bold rounded-xl overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center justify-center gap-2">
                                Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>

                    {/* Stats/Trust */}
                    <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5">
                        {[
                            { label: "Wait Time", value: "< 15m", icon: Activity },
                            { label: "Patients", value: "10k+", icon: UserPlus },
                            { label: "Rating", value: "4.9/5", icon: ShieldCheck },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <stat.icon size={16} />
                                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                                </div>
                                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>


                {/* 3. Visual Column - 3D Floating Elements */}
                <div className="relative h-[600px] hidden lg:block perspective-1000">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateX: 10, rotateY: 10 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        className="relative w-full h-full"
                    >
                        {/* Main Glass Card */}
                        <div className="absolute top-10 right-10 w-96 h-[500px] bg-white/5 backdrop-blur-2xl rounded-[32px] border border-white/10 shadow-2xl overflow-hidden z-20 transform transition-transform hover:scale-[1.02] duration-500">
                            {/* Mock UI Header */}
                            <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between">
                                <div className="w-20 h-2 bg-white/10 rounded-full" />
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                </div>
                            </div>
                            {/* Mock UI Content */}
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                        <Activity className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="w-32 h-4 bg-white/10 rounded-md mb-2" />
                                        <div className="w-20 h-3 bg-white/5 rounded-md" />
                                    </div>
                                </div>
                                {/* Animated Graph Pulse */}
                                <div className="h-32 bg-gradient-to-b from-white/5 to-transparent rounded-xl flex items-end justify-between px-2 pb-2">
                                    {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                            className="w-2 bg-cyan-400/50 rounded-full"
                                        />
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4"> <div className="w-2/3 h-2 bg-white/10 rounded-full" /> </div>
                                    <div className="w-full h-12 bg-white/5 rounded-xl flex items-center px-4"> <div className="w-1/2 h-2 bg-white/10 rounded-full" /> </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card 2 */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-40 left-0 w-64 h-80 bg-slate-900/80 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-2xl z-30 p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xs font-bold text-slate-400 uppercase">Heart Rate</span>
                                <Activity className="w-4 h-4 text-rose-500" />
                            </div>
                            <div className="text-5xl font-bold text-white mb-2">72 <span className="text-sm font-medium text-slate-500">BPM</span></div>
                            <div className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Normal Range
                            </div>
                            <div className="mt-8 h-24 w-full relative">
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                    <motion.path
                                        d="M0,50 Q20,50 40,20 T80,50 T120,80 T160,50 T200,30"
                                        fill="none"
                                        stroke="rgba(244, 63, 94, 0.5)"
                                        strokeWidth="3"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                </svg>
                            </div>
                        </motion.div>

                        {/* Decorative Circle */}
                        <div className="absolute top-0 right-[-100px] w-64 h-64 border border-dashed border-white/10 rounded-full animate-spin-slow z-10" style={{ animationDuration: '20s' }} />
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
