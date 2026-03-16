'use client';

import { Clock, Ambulance, Phone, AlertTriangle, HeartPulse, Shield, ArrowRight, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-amber-500/30">
            {/* Critical Hero Section */}
            <section className="relative h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/emergency_premium.png" 
                        alt="24/7 Emergency" 
                        className="w-full h-full object-cover scale-110 opacity-70"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-5 mb-10">
                            <div className="flex -space-x-4">
                                <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/40 relative z-20 border-2 border-slate-950">
                                    <Ambulance size={36} className="text-slate-950" />
                                </div>
                                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/40 relative z-10 border-2 border-slate-950 animate-pulse">
                                    <Zap size={32} className="text-white" />
                                </div>
                            </div>
                            <div className="h-px w-12 bg-amber-500/50"></div>
                            <p className="text-xs font-black text-amber-500 uppercase tracking-[0.4em]">Life-Critical Intake</p>
                        </div>
                        
                        <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter mb-10 uppercase leading-[0.85]">
                            Seconds <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Matter.</span>
                        </h1>
                        
                        <p className="text-2xl text-slate-300 mb-14 leading-relaxed max-w-2xl font-bold italic border-l-4 border-amber-500 pl-8">
                            Zero-wait policy for trauma. Elite surgeons. 24/7 hyper-speed response.
                        </p>
                        
                        <div className="flex flex-wrap gap-8 items-center">
                            <a href="tel:911" className="px-12 py-6 bg-amber-500 text-slate-950 font-black rounded-2xl hover:bg-amber-400 transition-all shadow-3xl shadow-amber-500/30 flex items-center gap-4 uppercase tracking-[0.1em] text-lg hover:scale-105 active:scale-95">
                                <Phone size={24} strokeWidth={3} />
                                Emergency: 911
                            </a>
                            <div className="flex items-center gap-4 px-8 py-5 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-inner">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                                <span className="font-black text-sm tracking-widest uppercase text-white">READY FOR ADMISSION</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Accent */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[180px] -z-10 animate-pulse" />
            </section>

            {/* Trauma Infrastructure Grid */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <div className="max-w-3xl">
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Trauma Level 1 <br />Response Unit</h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">Our Emergency Department is engineered for chaos. From arrival to surgery in under 12 minutes—we are the regional standard for critical survival.</p>
                    </div>
                    <div className="flex gap-6">
                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center min-w-[180px]">
                            <div className="text-5xl font-black text-amber-500 tracking-tighter">8m</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Avg Intake Time</p>
                        </div>
                        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 text-center min-w-[180px]">
                            <div className="text-5xl font-black text-red-500 tracking-tighter">24/7</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Zero Downtime</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { icon: Ambulance, title: 'Rapid Extraction', desc: 'Direct coordination with air and ground paramedics for streamlined trauma handover.' },
                        { icon: Zap, title: 'Swift-Track Triage', desc: 'Eliminating the waiting room. Patients move directly to specialized treatment zones.' },
                        { icon: Shield, title: 'High-Sec Isolation', desc: 'Military-grade infection control and chemical/biological risk management units.' },
                        { icon: Activity, title: 'Advanced Monitoring', desc: 'Real-time telemetry and life-support integration across every intake bay.' },
                        { icon: HeartPulse, title: 'Acute Cardiology', desc: 'Immediate intervention for cardiac events with dedicated onsite cath labs.' },
                        { icon: AlertTriangle, title: 'Crisis Management', desc: 'Multi-specialty trauma teams ready to assemble in sub-120 seconds.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] hover:border-amber-500/50 transition-all duration-500 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/4 -translate-y-1/4">
                                <s.icon size={200} strokeWidth={1} />
                            </div>
                            <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-10 border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-700">
                                <s.icon size={40} className="text-amber-500 group-hover:text-slate-950" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">{s.title}</h3>
                            <p className="text-slate-300 font-medium leading-relaxed text-sm opacity-70 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Warning Call to Action */}
            <section className="container mx-auto px-6 pb-40">
                <div className="relative rounded-[5rem] overflow-hidden group border-4 border-amber-500/20 shadow-4xl bg-black">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/services/emergency_premium.png" 
                            alt="Emergency Care" 
                            className="w-full h-full object-cover opacity-10 grayscale-0 saturat-[0.2] group-hover:scale-105 transition-transform duration-[3000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950"></div>
                    </div>
                    
                    <div className="relative z-10 p-20 lg:p-32 text-center max-w-5xl mx-auto">
                        <div className="inline-block px-5 py-2 bg-amber-500 text-slate-950 text-[12px] font-black tracking-[0.4em] uppercase rounded-full mb-12 animate-pulse">
                            CRITICAL NOTICE
                        </div>
                        <h2 className="text-6xl lg:text-8xl font-black text-white mb-12 uppercase tracking-tighter leading-[0.85]">We Don&#39;t Wait. <br /><span className="text-amber-500">Why Should You?</span></h2>
                        <p className="text-slate-200 text-2xl font-medium mb-16 leading-relaxed opacity-90 max-w-3xl mx-auto">
                            If you are experiencing a medical crisis, do not hesitate. Our trauma center is fully mobilized and standing by.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <a href="tel:911" className="inline-flex items-center gap-4 px-16 py-8 bg-amber-500 text-slate-950 font-black rounded-3xl hover:scale-105 transition-all shadow-3xl hover:bg-amber-400 uppercase tracking-widest text-lg">
                                Call Now: 911
                            </a>
                            <Link href="/book" className="inline-flex items-center gap-4 px-16 py-8 bg-white/5 backdrop-blur-xl text-white font-black rounded-3xl hover:bg-white/10 transition-all border border-white/20 uppercase tracking-widest text-lg">
                                Secure Check-In <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
