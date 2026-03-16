'use client';

import { ShieldCheck, Activity, Apple, Eye, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PreventiveCarePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Wellness Hero */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/services/preventive_premium.png" 
                        alt="Preventive Care" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left duration-700">
                            <div className="w-16 h-16 bg-emerald-500/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-emerald-500/20">
                                <ShieldCheck size={32} className="text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-500 uppercase tracking-[0.2em]">Longevity First</p>
                                <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Preventive <span className="text-emerald-500">Care</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left duration-1000 delay-200">
                            Invest in your future self. Our preventive care programs utilize advanced diagnostic screenings and personalized wellness strategies to detect risks years before they become problems.
                        </p>
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                            <Link href="/book" className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                Start Your Wellness Plan <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Preventive Programs Grid */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Science-Backed Prevention</h2>
                        <p className="text-muted-foreground max-w-xl">We move beyond routine checkups to provide deep-data health insights and actionable longevity protocols.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-bold border border-emerald-500/10">Personalized AI Plans</div>
                        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-sm font-bold border border-emerald-500/10">Early Detection</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: HeartPulse, title: 'Cardiac Longevity', desc: 'Advanced biomarker testing and non-invasive imaging for cardiovascular health.' },
                        { icon: Activity, title: 'Comprehensive Screening', desc: 'Over 60 diagnostic parameters tracked annually for a complete health snapshot.' },
                        { icon: Eye, title: 'Sensory Health', desc: 'Early-stage screening for vision, hearing, and cognitive function preservation.' },
                        { icon: Apple, title: 'Functional Nutrition', desc: 'DNA-based diet optimization from clinical nutritionists for metabolic health.' },
                        { icon: ShieldCheck, title: 'Oncology Prevention', desc: 'High-precision scans and genetic risk assessments for early cancer detection.' },
                        { icon: Stethoscope, title: 'Metabolic Optimization', desc: 'Glucose monitoring and hormonal balancing for peak physical performance.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-card border border-border p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/5 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <s.icon size={28} className="text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3">{s.title}</h3>
                            <p className="text-muted-foreground leading-relaxed italic">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium CTA */}
            <section className="container mx-auto px-6 pb-24">
                <div className="relative rounded-[3rem] overflow-hidden group">
                    <div className="absolute inset-0">
                        <Image 
                            src="/images/services/preventive_premium.png" 
                            alt="Wellness Background" 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-emerald-600/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-12 lg:p-20 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Prevention is the <span className="italic">Ultimate</span> Cure</h2>
                        <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                            Don't wait for symptoms. Take control of your biological age and long-term vitality with our premium preventive healthcare packages.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-600 font-bold rounded-2xl hover:scale-105 transition-all shadow-xl">
                            Book Your Screening <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
