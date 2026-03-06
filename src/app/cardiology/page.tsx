'use client';

import { HeartPulse, Activity, Stethoscope, Shield, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CardiologyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-pink-500/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center">
                            <HeartPulse size={32} className="text-red-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-400 uppercase tracking-wider">Center of Excellence</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Cardiology Center</h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Comprehensive cardiac care powered by the latest technology. From preventive screenings to complex interventional procedures, our cardiology team provides world-class treatment.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">Our Cardiac Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Activity, title: 'ECG & Stress Testing', desc: 'Electrocardiogram and treadmill tests for heart rhythm evaluation.' },
                        { icon: HeartPulse, title: 'Echocardiography', desc: 'Non-invasive ultrasound imaging of the heart structure and function.' },
                        { icon: Stethoscope, title: 'Cardiac Consultation', desc: 'Expert evaluation by board-certified cardiologists.' },
                        { icon: Shield, title: 'Cardiac Catheterization', desc: 'Minimally invasive diagnostic and interventional procedures.' },
                        { icon: Activity, title: 'Pacemaker Implantation', desc: 'Device therapy for heart rhythm disorders.' },
                        { icon: HeartPulse, title: 'Heart Failure Management', desc: 'Comprehensive care programs for chronic heart conditions.' },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-red-500/20 transition-all group">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                                <s.icon size={24} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Schedule a Cardiac Checkup</h2>
                    <p className="text-white/80 mb-6 max-w-lg mx-auto">Early detection saves lives. Book a cardiac screening with our specialists today.</p>
                    <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-white/90 transition-all">
                        Book Appointment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
