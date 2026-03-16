'use client';

import { ShieldCheck, Activity, Apple, Eye, HeartPulse, Stethoscope, ArrowRight, Leaf, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PreventiveCarePage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-emerald-500/30">
            {/* Wellness Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/preventive_premium.png" 
                        alt="Preventive Care" 
                        className="w-full h-full object-cover scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20">
                                <Leaf size={32} className="text-slate-950" />
                            </div>
                            <div className="h-px w-12 bg-emerald-500/50"></div>
                            <p className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em]">Longevity & Wellness</p>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.9]">
                            Proactive <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Living</span>
                        </h1>
                        
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
                            The best medicine is the one you never need. Our preventive programs are designed to optimize your health before challenges arise.
                        </p>
                        
                        <div className="flex flex-wrap gap-6">
                            <Link href="/book" className="px-10 py-5 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-3 uppercase tracking-wider text-sm">
                                Start Your Scan <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                <ShieldCheck className="text-emerald-500" size={20} />
                                <span className="font-bold text-sm tracking-widest uppercase">LIFESTYLE OPTIMIZED</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">View Screenings</p>
                    <div className="w-px h-12 bg-gradient-to-b from-emerald-500 to-transparent"></div>
                </div>
            </section>

            {/* Wellness Programs Grid */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] -z-10"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Holistic <br />Prevention</h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">Our clinical team focuses on the root causes of disease, utilizing advanced bio-metric screening and nutritional science.</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="text-5xl font-black text-emerald-500 tracking-tighter tracking-widest">360°</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Health Assessment</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Activity, title: 'Bio-Metric Screening', desc: 'Real-time analysis of vital markers to baseline your current physiological state.' },
                        { icon: HeartPulse, title: 'Cardio Optimization', desc: 'Predictive modeling for vascular health and personalized exercise prescriptions.' },
                        { icon: Apple, title: 'Nutritional Science', desc: 'Data-driven dietary planning to enhance metabolic efficiency and energy.' },
                        { icon: Eye, title: 'Vision & Sensory', desc: 'Advanced monitoring to preserve and enhance your sensory capabilities long-term.' },
                        { icon: ShieldCheck, title: 'Immune Fortification', desc: 'Proactive seasonal defense and long-term immunological support plans.' },
                        { icon: Sparkles, title: 'Bio-Optimized Sleep', desc: 'Neurological assessments to ensure restorative, high-performance sleep cycles.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:border-emerald-500/50 transition-all duration-500 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/2 -translate-y-1/2">
                                <s.icon size={160} strokeWidth={1} />
                            </div>
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500">
                                <s.icon size={30} className="text-emerald-500 group-hover:text-slate-950" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{s.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Vitality Section */}
            <section className="container mx-auto px-6 pb-40">
                <div className="relative rounded-[4rem] overflow-hidden group border border-white/5 shadow-3xl bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/services/preventive_premium.png" 
                            alt="Vitality" 
                            className="w-full h-full object-cover opacity-30 transition-transform duration-[2000ms] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-16 lg:p-24 text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-emerald-600 text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-10 shadow-lg shadow-emerald-600/30">
                            THE ART OF AGING WELL
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">Invest In <br /><span className="text-emerald-500">Your Future Self</span></h2>
                        <p className="text-slate-300 text-xl font-medium mb-12 leading-relaxed opacity-80">
                            Prevention is the ultimate luxury. Our programs empower you with the data and habits needed for a decade of extra health-span.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-sm">
                            Unlock Your Potential <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
