'use client';

import { HeartPulse, Activity, Stethoscope, Shield, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CardiologyPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/services/cardiology_premium.png" 
                        alt="Cardiology Center" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left duration-700">
                            <div className="w-16 h-16 bg-red-500/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-red-500/20">
                                <HeartPulse size={32} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-red-500 uppercase tracking-widest">Center of Excellence</p>
                                <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Cardiology <span className="text-red-500">Center</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left duration-1000 delay-200">
                            Pioneering the future of heart health. Our cardiology department combines world-class expertise with revolutionary technology to provide comprehensive cardiac solutions.
                        </p>
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                            <Link href="/book" className="px-8 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2">
                                Book a Specialist <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Precision Cardiac Care</h2>
                        <p className="text-muted-foreground max-w-xl">We offer a full spectrum of diagnostic and therapeutic cardiology services using the most advanced medical protocols.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-bold border border-red-500/10">6,000+ Surgeries</div>
                        <div className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-sm font-bold border border-red-500/10">24/7 Support</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Activity, title: 'Advanced ECG & Stress Testing', desc: 'Comprehensive heart rhythm evaluation using the latest digital monitoring systems.' },
                        { icon: HeartPulse, title: 'Digital Echocardiography', desc: 'High-definition 4D ultrasound imaging for unparalleled diagnostic clarity.' },
                        { icon: Stethoscope, title: 'In-Depth Consultation', desc: 'One-on-one sessions with internationally recognized cardiologists.' },
                        { icon: Shield, title: 'Interventional Cardiology', desc: 'Precision catheter-based treatments for complex vascular conditions.' },
                        { icon: Activity, title: 'Cardiac Electrophysiology', desc: 'Specialized diagnosis and treatment for all forms of heart rhythm disorders.' },
                        { icon: HeartPulse, title: 'Heart Failure Program', desc: 'Multi-disciplinary approach to managing chronic heart conditions effectively.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-card border border-border p-8 rounded-3xl hover:border-red-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/5 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl group-hover:bg-red-500/10 transition-colors"></div>
                            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <s.icon size={28} className="text-red-500" />
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
                            src="/images/services/cardiology_premium.png" 
                            alt="Background" 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-red-600/90 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900 to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-12 lg:p-20 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Your Heart Deserves the <span className="italic">Best</span></h2>
                        <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                            Join thousands of patients who trust our Cardiology Center for their lifelong heart health. Advanced diagnostics, expert care, and a heart for every patient.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-red-600 font-bold rounded-2xl hover:scale-105 transition-all shadow-xl">
                            Start Your Journey <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
