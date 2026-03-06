'use client';

import { Stethoscope, Baby, Syringe, Heart, Brain, Thermometer, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PediatricsPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-cyan-500/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-sky-500/15 rounded-2xl flex items-center justify-center">
                            <Stethoscope size={32} className="text-sky-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-sky-400 uppercase tracking-wider">Child Healthcare</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Pediatrics</h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        Compassionate, expert healthcare for infants, children, and adolescents. Our pediatric team creates a warm, child-friendly environment for every visit.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">Pediatric Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Baby, title: 'Well-Baby Checkups', desc: 'Routine health assessments and developmental milestone tracking.' },
                        { icon: Syringe, title: 'Vaccinations', desc: 'Complete immunization programs following national schedule guidelines.' },
                        { icon: Heart, title: 'Pediatric Cardiology', desc: 'Diagnosis and treatment of congenital and acquired heart conditions.' },
                        { icon: Brain, title: 'Developmental Screening', desc: 'Early assessment of speech, motor, and cognitive development.' },
                        { icon: Thermometer, title: 'Acute Illness Care', desc: 'Treatment for fevers, infections, allergies, and common childhood illnesses.' },
                        { icon: Stethoscope, title: 'Adolescent Medicine', desc: 'Specialized care for teenagers including nutrition and mental health support.' },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-sky-500/20 transition-all group">
                            <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-sky-500/20 transition-colors">
                                <s.icon size={24} className="text-sky-500" />
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-sky-500 to-cyan-500 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Schedule Your Child&#39;s Visit</h2>
                    <p className="text-white/80 mb-6 max-w-lg mx-auto">Our pediatricians ensure a comfortable, fun experience for your little ones.</p>
                    <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-sky-600 font-bold rounded-xl hover:bg-white/90 transition-all">
                        Book Appointment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
