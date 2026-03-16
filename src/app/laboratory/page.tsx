'use client';

import { Microscope, FlaskConical, Droplets, TestTube, Dna, FileSearch, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LaboratoryPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-cyan-500/30">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/laboratory_premium.png" 
                        alt="Advanced Laboratory" 
                        className="w-full h-full object-cover scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20">
                                <Microscope size={32} className="text-slate-950" />
                            </div>
                            <div className="h-px w-12 bg-cyan-500/50"></div>
                            <p className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em]">Precision Diagnostics</p>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.9]">
                            Advanced <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Analytics</span>
                        </h1>
                        
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-xl font-medium">
                            Unlocking biological insights with clinical precision. Our ISO-certified facilities provide the bedrock of data for your medical journey.
                        </p>
                        
                        <div className="flex flex-wrap gap-6">
                            <Link href="/book" className="px-10 py-5 bg-cyan-500 text-slate-950 font-black rounded-2xl hover:bg-cyan-400 transition-all shadow-2xl shadow-cyan-500/30 flex items-center gap-3 uppercase tracking-wider text-sm">
                                Book Lab Test <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                <Activity className="text-cyan-500" size={20} />
                                <span className="font-bold text-sm tracking-widest uppercase">99.9% ACCURACY</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">View Services</p>
                    <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                </div>
            </section>

            {/* Scientific Infrastructure Grid */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] -z-10"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Clinical <br />Intelligence</h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">Equipped with state-of-the-art automated processing units, our lab delivers results with unprecedented speed and surgical accuracy.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-end gap-1">
                            <div className="text-4xl font-black text-cyan-500 tracking-tighter">4-Hour</div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority Turnaround</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Dna, title: 'Genomic Sequencing', desc: 'Precision DNA mapping to identify hereditary markers and personalized medicine paths.' },
                        { icon: Droplets, title: 'Hematology Panels', desc: 'Comprehensive blood component analysis using laser-flow cytometry.' },
                        { icon: FlaskConical, title: 'Biochemical Profiling', desc: 'Mass-spectrometry based screening for metabolic and hormonal imbalances.' },
                        { icon: TestTube, title: 'Toxicology Screening', desc: 'Rapid, forensic-grade identification of pharmaceutical and environmental toxins.' },
                        { icon: FileSearch, title: 'Pathology Reports', desc: 'Detailed histopathological reviews by board-certified clinical pathologists.' },
                        { icon: ShieldCheck, title: 'ISO 15189 Verified', desc: 'Adhering to the highest global standards for medical laboratory quality.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:border-cyan-500/50 transition-all duration-500 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/2 -translate-y-1/2">
                                <s.icon size={160} strokeWidth={1} />
                            </div>
                            <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all duration-500">
                                <s.icon size={30} className="text-cyan-500 group-hover:text-slate-950" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{s.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Result-Driven Section */}
            <section className="container mx-auto px-6 pb-40">
                <div className="relative rounded-[4rem] overflow-hidden group border border-white/5 shadow-3xl bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/services/laboratory_premium.png" 
                            alt="Lab Results" 
                            className="w-full h-full object-cover opacity-20 transition-transform duration-[2000ms] group-hover:scale-105 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-16 lg:p-24 text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-cyan-500 text-slate-950 text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-10 shadow-lg shadow-cyan-500/30">
                            DATA-DRIVEN WELLNESS
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">Insights That <br /><span className="text-cyan-500">Save Lives</span></h2>
                        <p className="text-slate-300 text-xl font-medium mb-12 leading-relaxed opacity-80">
                            Our laboratory processed over 1.2 million samples last year, providing the critical data needed for successful treatments across all Grandview departments.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-sm">
                            Schedule Your Screening <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
