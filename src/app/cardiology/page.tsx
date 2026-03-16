'use client';

import { HeartPulse, Activity, Stethoscope, Shield, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CardiologyPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-red-500/30">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/cardiology_premium.png" 
                        alt="Cardiology Center" 
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-xl shadow-red-600/20">
                                <HeartPulse size={32} className="text-white" />
                            </div>
                            <div className="h-px w-12 bg-red-600/50"></div>
                            <p className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">Cardiovascular Excellence</p>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.9]">
                            The Heart <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">of Grandview</span>
                        </h1>
                        
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
                            Setting the global standard in precision cardiac care. Our elite faculty utilizes revolutionary technology to safeguard your most vital organ.
                        </p>
                        
                        <div className="flex flex-wrap gap-6">
                            <Link href="/book" className="px-10 py-5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-500 transition-all shadow-2xl shadow-red-600/30 flex items-center gap-3 uppercase tracking-wider text-sm">
                                Consult Specialist <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                <Phone className="text-red-500" size={20} />
                                <span className="font-bold text-sm tracking-widest">+1 (800) CARDIO</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Discover More</p>
                    <div className="w-px h-12 bg-gradient-to-b from-red-600 to-transparent"></div>
                </div>
            </section>

            {/* Advanced Diagnostics Grid */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[150px] -z-10"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Elite Cardiac <br />Infrastructure</h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">Our facility integrates AI-driven diagnostics with world-renowned surgical expertise to provide a continuum of care for all cardiac conditions.</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="text-5xl font-black text-red-500 tracking-tighter tracking-widest">99.2%</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clinical Success Rate</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: HeartPulse, title: 'AI-Enhanced ECG', desc: 'Predictive rhythm analysis using deep-learning cardiac monitoring systems.' },
                        { icon: Activity, title: '3D Laser Mapping', desc: 'Intricate electrophysiology mapping for precise arrhythmia treatment.' },
                        { icon: Stethoscope, title: 'Concierge Care', desc: 'Direct access to senior cardiology faculty and personalized health tracking.' },
                        { icon: Shield, title: 'Robotic Surgery', desc: 'Minimally invasive cardiothoracic procedures with robotic precision.' },
                        { icon: HeartPulse, title: 'Genomic Profiling', desc: 'Personalized risk assessment based on cardiovascular genetics.' },
                        { icon: Activity, title: '24/7 Rapid Response', desc: 'Immediate emergency cardiac intervention with sub-30min intake.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:border-red-500/50 transition-all duration-500 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/2 -translate-y-1/2">
                                <s.icon size={160} strokeWidth={1} />
                            </div>
                            <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mb-8 border border-red-600/20 group-hover:bg-red-600 group-hover:text-white transition-all duration-500">
                                <s.icon size={30} className="text-red-500 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{s.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Impact Section */}
            <section className="container mx-auto px-6 pb-40">
                <div className="relative rounded-[4rem] overflow-hidden group border border-white/5 shadow-3xl bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/services/cardiology_premium.png" 
                            alt="Cardiac Excellence" 
                            className="w-full h-full object-cover opacity-30 grayscale group-hover:scale-105 transition-transform duration-[2000ms]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-16 lg:p-24 text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-red-600 text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-10 shadow-lg shadow-red-600/30">
                            The Standard of Care
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">Transforming <br /><span className="text-red-500">Heart Health</span> Daily</h2>
                        <p className="text-slate-300 text-xl font-medium mb-12 leading-relaxed opacity-80">
                            Join over 150,000 patients who have regained their vitality through the Grandview Cardiology Center. Our dedication to your longevity is unwavering.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-sm">
                            Join the Waitlist <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
