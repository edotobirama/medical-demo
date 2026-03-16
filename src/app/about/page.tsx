'use client';

import { ShieldCheck, Users, Target, Award, ArrowRight, Activity, HeartPulse } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Legacy & Future Hero */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/hero-hospital.png" 
                        alt="Grandview Legacy" 
                        className="w-full h-full object-cover scale-105 opacity-40 shadow-inner"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                                <Award size={32} className="text-white" />
                            </div>
                            <div className="h-px w-12 bg-blue-600/50"></div>
                            <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">Established 1974</p>
                        </div>
                        
                        <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter mb-10 uppercase leading-[0.85]">
                            Defining <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 text-shadow-glow">Modern Care.</span>
                        </h1>
                        
                        <p className="text-2xl text-slate-300 mb-14 leading-relaxed max-w-2xl font-medium">
                            For half a century, Grandview Medical Center has been at the vanguard of clinical excellence, combining human empathy with exponential technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>
                
                <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
                    <div>
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Our North Star</h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed mb-10">
                            Our mission is to democratize elite-level healthcare. We combine the world&#39;s leading medical specialists with AI-driven infrastructure to ensure that every patient receives a bespoke, high-precision recovery roadmap.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:border-blue-500/30 transition-all">
                                <Target size={32} className="text-blue-500 mb-4" />
                                <h4 className="text-lg font-black uppercase mb-2">Precision</h4>
                                <p className="text-slate-500 text-sm">Eliminating medical ambiguity through data.</p>
                            </div>
                            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] hover:border-indigo-500/30 transition-all">
                                <Users size={32} className="text-indigo-500 mb-4" />
                                <h4 className="text-lg font-black uppercase mb-2">Empathy</h4>
                                <p className="text-slate-500 text-sm">Putting the human story back into clinical data.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[4rem] p-1 shadow-3xl overflow-hidden group">
                           <img 
                                src="/images/team-doctors.png" 
                                alt="Our Team" 
                                className="w-full h-full object-cover rounded-[3.8rem] grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                           />
                        </div>
                        <div className="absolute -bottom-10 -right-10 bg-slate-900 border border-white/10 p-10 rounded-[3rem] shadow-3xl">
                            <div className="text-5xl font-black text-blue-500 tracking-tighter">15k+</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lives Transformed Yearly</p>
                        </div>
                    </div>
                </div>

                {/* Accreditations */}
                <div className="text-center">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-12">Global Health Accreditations</h3>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all hover:opacity-100">
                        {/* Placeholder for Logos */}
                        <div className="text-2xl font-black text-white px-6">JCI GOLD</div>
                        <div className="text-2xl font-black text-white px-6">ISO 9001</div>
                        <div className="text-2xl font-black text-white px-6">MAGNET</div>
                        <div className="text-2xl font-black text-white px-6">CDC PLATINUM</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
