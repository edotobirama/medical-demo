'use client';

import { Clock, Ambulance, Phone, AlertTriangle, HeartPulse, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function EmergencyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="h-24"></div>
            {/* Critical Hero */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/services/emergency_premium.png" 
                        alt="24/7 Emergency" 
                        fill 
                        className="object-cover scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left duration-700">
                            <div className="w-16 h-16 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-primary/30 animate-pulse">
                                <Clock size={32} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Seconds Count</p>
                                <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter">24/7 <span className="text-primary">Emergency</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed font-medium animate-in fade-in slide-in-from-left duration-1000 delay-200">
                            Elite trauma response units ready at a moment's notice. Our level-1 trauma facility is equipped with specialized surgical teams and rapid-response technology to save lives when it matters most.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                            <a href="tel:911" className="px-10 py-5 bg-primary text-primary-foreground font-black rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 text-lg group">
                                <Phone size={24} className="group-hover:animate-bounce" /> Call 911 Now
                            </a>
                            <div className="flex items-center gap-3 bg-primary/10 backdrop-blur-md border border-primary/20 rounded-2xl px-6 py-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-foreground font-bold whitespace-nowrap">Average Wait: &lt; 5 Mins</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Grid */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-foreground mb-4 font-heading">Battle-Tested Capabilities</h2>
                        <p className="text-muted-foreground max-w-xl text-lg">Our infrastructure is designed for speed, safety, and superior clinical outcomes in the most demanding situations.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center p-4 bg-primary/5 rounded-2xl border border-primary/10 min-w-[120px]">
                            <span className="text-2xl font-black text-primary">Level 1</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">Trauma Center</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-primary/5 rounded-2xl border border-primary/10 min-w-[120px]">
                            <span className="text-2xl font-black text-primary">30+</span>
                            <span className="text-xs font-bold text-muted-foreground uppercase">ER Bays</span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Ambulance, title: 'Smart Ambulance Fleet', desc: 'GPS-synced mobile ICUs with advanced telemetry for en-route stabilization.' },
                        { icon: AlertTriangle, title: 'Rapid Trauma Unit', desc: 'Multidisciplinary teams including neurosurgeons and orthopedic leads on-site 24/7.' },
                        { icon: HeartPulse, title: 'Chest Pain Center', desc: 'Direct-to-lab protocols for cardiac arrests, bypassing standard triage for speed.' },
                        { icon: Clock, title: 'AI Triage System', desc: 'Digital prioritization based on vital signs to ensure critical patients are seen first.' },
                        { icon: Shield, title: 'Pediatric ER Zone', desc: 'A separate, specialized wing for children with pediatric trauma experts.' },
                        { icon: HeartPulse, title: 'Code Stroke Response', desc: 'Integrated imaging and neurology consultation initiated within 10 minutes.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-card border border-border p-8 rounded-[2rem] hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                <s.icon size={28} className="text-primary group-hover:text-primary-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold text-card-foreground mb-3">{s.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium CTA */}
            <section className="container mx-auto px-6 pb-24">
                <div className="relative rounded-[3.5rem] overflow-hidden group">
                    <div className="absolute inset-0">
                        <Image 
                            src="/images/services/emergency_premium.png" 
                            alt="ER Background" 
                            fill 
                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-background/90"></div>
                    </div>
                    
                    <div className="relative z-10 p-16 lg:p-28 text-center">
                        <div className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-sm font-black uppercase tracking-widest mb-8 shadow-lg animate-pulse">
                            Immediate Action Required?
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black text-foreground mb-8 tracking-tighter">Trust the <span className="italic text-primary underline decoration-primary/30 underline-offset-8">Fastest</span> Response</h2>
                        <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-xl leading-relaxed font-medium">
                            Located conveniently at the heart of the city with dedicated helicopter access. We don't just treat emergencies; we master them.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <a href="tel:911" className="inline-flex items-center gap-3 px-12 py-6 bg-primary text-primary-foreground font-black rounded-[2rem] hover:scale-105 transition-all shadow-2xl shadow-primary/50 text-xl">
                                <Phone size={28} /> Emergency 911
                            </a>
                            <Link href="/book" className="inline-flex items-center gap-3 px-10 py-6 bg-background text-primary border-2 border-primary/20 backdrop-blur-md font-bold rounded-[2rem] hover:bg-muted transition-all text-xl">
                                Book Clinic Visit <ArrowRight size={24} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
