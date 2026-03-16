'use client';

import { Clock, Users, ShieldAlert, ArrowRight, HeartPulse } from "lucide-react";
import Link from 'next/link';

export default function VisitingHoursPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
                
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-8">
                        <Clock size={16} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-400">Patient Support Schedule</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight text-white">
                        Connecting <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Care & Family</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        We believe presence is a vital part of the healing journey. Please review our curated guidelines for visitations across Grandview Medical.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 pb-32">
                <div className="grid md:grid-cols-2 gap-10">
                    {/* General Wards */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] hover:border-blue-500/50 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-600/20">
                            <Users size={32} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">General Wards</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Morning Session</span>
                                <span className="text-white font-black">09:00 AM - 12:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Afternoon Session</span>
                                <span className="text-white font-black">03:00 PM - 08:00 PM</span>
                            </div>
                        </div>
                        <p className="mt-8 text-slate-500 text-sm font-medium italic">
                            * Limit of 2 visitors per patient at any given time.
                        </p>
                    </div>

                    {/* Specialized Units */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] hover:border-red-500/50 transition-all duration-500">
                        <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-8 border border-red-600/20">
                            <HeartPulse size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Specialized Units</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">ICU / CCU</span>
                                <span className="text-white font-black">Consult Staff</span>
                            </div>
                            <div className="flex justify-between items-center py-4 border-b border-white/5">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Pediatrics</span>
                                <span className="text-white font-black">24/7 (Guardians)</span>
                            </div>
                        </div>
                        <p className="mt-8 text-slate-500 text-sm font-medium italic">
                            * Strict infection control protocols apply in these zones.
                        </p>
                    </div>
                </div>

                {/* Important Notes */}
                <div className="mt-16 bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                        <ShieldAlert size={40} className="text-amber-500" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Vital Health Notice</h3>
                        <p className="text-slate-400 font-medium leading-relaxed">
                            For the safety of our patients, anyone experiencing cough, cold, or fever symptoms is requested to postpone their visit. Children under 12 must be accompanied by an adult.
                        </p>
                    </div>
                    <Link href="/contact" className="px-8 py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-slate-100 transition-all flex-shrink-0 uppercase tracking-widest text-xs">
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
