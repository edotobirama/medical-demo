'use client';

import { Stethoscope, Baby, Syringe, Heart, Brain, Thermometer, ArrowRight, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function PediatricsPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-purple-500/30">
            {/* Gentle Hero Section */}
            <section className="relative h-[85vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/pediatrics_premium.png" 
                        alt="Pediatrics Center" 
                        className="w-full h-full object-cover scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/20">
                                <Baby size={32} className="text-white" />
                            </div>
                            <div className="h-px w-12 bg-purple-500/50"></div>
                            <p className="text-xs font-black text-purple-400 uppercase tracking-[0.3em]">Nurturing the Future</p>
                        </div>
                        
                        <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.9]">
                            Brighter <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Generations</span>
                        </h1>
                        
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-xl font-medium">
                            World-class medical expertise meeting the gentle care every child deserves. We focus on healing, growth, and the joy of childhood.
                        </p>
                        
                        <div className="flex flex-wrap gap-6">
                            <Link href="/book" className="px-10 py-5 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-500 transition-all shadow-2xl shadow-purple-600/30 flex items-center gap-3 uppercase tracking-wider text-sm">
                                Find a Pediatrician <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                <Star className="text-yellow-400" size={20} />
                                <span className="font-bold text-sm tracking-widest uppercase">KID-APPROVED CARE</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Our Approach</p>
                    <div className="w-px h-12 bg-gradient-to-b from-purple-500 to-transparent"></div>
                </div>
            </section>

            {/* Specialized pediatric Grid */}
            <section className="container mx-auto px-6 py-32 relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] -z-10"></div>
                
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 uppercase tracking-tighter">Compassionate <br />Specialization</h2>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">From newborns to adolescents, our multi-disciplinary team provides expert care in a environment designed specifically for younger patients.</p>
                    </div>
                    <div className="flex flex-col items-end gap-3 text-right">
                        <div className="text-5xl font-black text-indigo-400 tracking-tighter tracking-widest">24/7</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Pediatric Support</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Baby, title: 'Neonatal Intensive Care', desc: 'World-class Level IV NICU specialists for our most vulnerable infants.' },
                        { icon: Syringe, title: 'Painless Immunizations', desc: 'Child-friendly vaccination protocols focusing on comfort and anxiety reduction.' },
                        { icon: Heart, title: 'Pediatric Cardiology', desc: 'Specialized heart care for congenital and acquired cardiac conditions in children.' },
                        { icon: Brain, title: 'Developmental Care', desc: 'Tracking and supporting neurological and milestone development with expert oversight.' },
                        { icon: Thermometer, title: 'Acute Intake', desc: 'Fast-track emergency services tailored specifically for pediatric emergencies.' },
                        { icon: Sparkles, title: 'Play-Based Therapy', desc: 'Integrating healing with play to ensure physical and emotional recovery.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[2.5rem] hover:border-purple-500/50 transition-all duration-500 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/2 -translate-y-1/2">
                                <s.icon size={160} strokeWidth={1} />
                            </div>
                            <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-8 border border-purple-600/20 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                                <s.icon size={30} className="text-purple-400 group-hover:text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">{s.title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm opacity-80 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Caring Call to Action */}
            <section className="container mx-auto px-6 pb-40">
                <div className="relative rounded-[4rem] overflow-hidden group border border-white/5 shadow-3xl bg-slate-900">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="/images/services/pediatrics_premium.png" 
                            alt="Caring Environment" 
                            className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[2000ms] grayscale-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-16 lg:p-24 text-center max-w-4xl mx-auto">
                        <div className="inline-block px-4 py-1.5 bg-indigo-600 text-[10px] font-black tracking-[0.3em] uppercase rounded-full mb-10 shadow-lg shadow-indigo-600/30">
                            A HEALTHY BEGINNING
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 uppercase tracking-tighter leading-[0.9]">Safe <br /><span className="text-purple-400">In Our Hands</span></h2>
                        <p className="text-slate-300 text-xl font-medium mb-12 leading-relaxed opacity-80">
                            We believe every child deserves the best start in life. Our Pediatrics Center provides the foundation for lifelong health and happiness.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-4 px-12 py-6 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all shadow-2xl hover:bg-slate-50 uppercase tracking-widest text-sm">
                            Join the Family <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
