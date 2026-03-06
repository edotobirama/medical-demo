'use client';

import { Clock, Ambulance, Phone, AlertTriangle, HeartPulse, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function EmergencyPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-500/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-orange-500/15 rounded-2xl flex items-center justify-center animate-pulse">
                            <Clock size={32} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-orange-400 uppercase tracking-wider">Always Ready</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">24/7 Emergency</h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Our emergency department is staffed around the clock with trauma surgeons, critical care specialists, and emergency physicians, ensuring rapid response when minutes matter most.
                    </p>

                    {/* Emergency Hotline */}
                    <div className="mt-8 inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-6 py-4">
                        <Phone size={24} className="text-red-500" />
                        <div>
                            <p className="text-sm text-muted-foreground">Emergency Hotline</p>
                            <p className="text-2xl font-bold text-red-500">911</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">Emergency Capabilities</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Ambulance, title: 'Ambulance Services', desc: 'GPS-tracked ambulances with paramedic teams for rapid patient transport.' },
                        { icon: AlertTriangle, title: 'Trauma Center', desc: 'Level-1 trauma facility equipped for severe injuries and multi-system trauma.' },
                        { icon: HeartPulse, title: 'Cardiac Emergency', desc: 'Dedicated chest pain unit with immediate access to catheterization lab.' },
                        { icon: Clock, title: 'Triage System', desc: 'Computerized triage for rapid patient assessment and priority-based treatment.' },
                        { icon: Shield, title: 'Pediatric Emergency', desc: 'Child-friendly emergency unit staffed with pediatric emergency specialists.' },
                        { icon: HeartPulse, title: 'Stroke Response', desc: 'Code Stroke protocol with CT imaging and neurology consult within minutes.' },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-orange-500/20 transition-all group">
                            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                <s.icon size={24} className="text-orange-500" />
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">In an Emergency?</h2>
                    <p className="text-white/80 mb-6 max-w-lg mx-auto">Call our emergency hotline immediately or visit our emergency department. We are open 24 hours, 7 days a week.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:911" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-white/90 transition-all">
                            <Phone size={18} /> Call 911
                        </a>
                        <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 text-white border border-white/30 font-bold rounded-xl hover:bg-white/30 transition-all">
                            Book Appointment <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
