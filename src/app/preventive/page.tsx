'use client';

import { ShieldCheck, Activity, Apple, Eye, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PreventiveCarePage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-green-500/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-emerald-500/15 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={32} className="text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Stay Healthy</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Preventive Care</h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Proactive health screenings and wellness programs designed to detect risks early and keep you healthy for years to come.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">Preventive Programs</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: HeartPulse, title: 'Cardiac Screening', desc: 'ECG, lipid profiles, and blood pressure monitoring for heart health.' },
                        { icon: Activity, title: 'Full Body Checkup', desc: 'Comprehensive annual health assessment covering 60+ parameters.' },
                        { icon: Eye, title: 'Vision & Hearing', desc: 'Early detection screenings for vision and hearing impairments.' },
                        { icon: Apple, title: 'Nutrition Counseling', desc: 'Personalized diet plans from certified clinical nutritionists.' },
                        { icon: ShieldCheck, title: 'Cancer Screening', desc: 'Mammography, Pap smear, PSA tests, and colonoscopy referrals.' },
                        { icon: Stethoscope, title: 'Diabetes Prevention', desc: 'HbA1c testing, glucose monitoring, and lifestyle modification guidance.' },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-emerald-500/20 transition-all group">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                                <s.icon size={24} className="text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Prevention is Better Than Cure</h2>
                    <p className="text-white/80 mb-6 max-w-lg mx-auto">Schedule a preventive health screening today and take charge of your well-being.</p>
                    <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-emerald-600 font-bold rounded-xl hover:bg-white/90 transition-all">
                        Book Appointment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
