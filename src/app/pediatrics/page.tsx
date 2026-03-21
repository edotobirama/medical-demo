'use client';

import { Stethoscope, Baby, Syringe, Heart, Brain, Thermometer, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function PediatricsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="h-24"></div>
            {/* Gentle Hero */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/services/pediatrics_premium.png" 
                        alt="Pediatrics" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left duration-700">
                            <div className="w-16 h-16 bg-primary/15 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-primary/20">
                                <Baby size={32} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-primary uppercase tracking-widest">A Healthier Future</p>
                                <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Gentle <span className="text-primary font-serif italic text-6xl">Pediatrics</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left duration-1000 delay-200">
                            Where every little smile matters. Our pediatric center combines expert medical care with a warm, playful environment designed to make children feel safe, happy, and healthy.
                        </p>
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                            <Link href="/book" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                Book Child's Visit <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pediatric Services Grid */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-center md:text-left">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Care for Every Milestone</h2>
                        <p className="text-muted-foreground max-w-xl">We provide specialized healthcare tailored to the unique physiological and emotional needs of infants and children.</p>
                    </div>
                    <div className="flex justify-center gap-2">
                        <div className="px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">Child-Friendly Labs</div>
                        <div className="px-5 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">Vaccination Hub</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Baby, title: 'Well-Baby Checkups', desc: 'Detailed assessments of growth, nutrition, and psychological development.' },
                        { icon: Syringe, title: 'Safe Vaccinations', desc: 'Stress-free immunization environment using pain-management techniques.' },
                        { icon: Heart, title: 'Pediatric Cardiology', desc: 'Specialized heart care for congenital and acquired conditions in children.' },
                        { icon: Brain, title: 'Developmental Milestones', desc: 'Early detection and support for neurodevelopmental and behavioral growth.' },
                        { icon: Thermometer, title: 'Urgent Child Care', desc: 'Rapid treatment for acute seasonal illnesses, fevers, and minor injuries.' },
                        { icon: Stethoscope, title: 'Adolescent Medicine', desc: 'Confidential care addressing the unique health challenges of teenagers.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-card border border-border p-10 rounded-[3rem] hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-colors"></div>
                            <div className="w-16 h-16 bg-primary/10 rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                                <s.icon size={32} className="text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3">{s.title}</h3>
                            <p className="text-muted-foreground leading-relaxed italic">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Premium CTA */}
            <section className="container mx-auto px-6 pb-24">
                <div className="relative rounded-[4rem] overflow-hidden group">
                    <div className="absolute inset-0">
                        <Image 
                            src="/images/services/pediatrics_premium.png" 
                            alt="Background" 
                            fill 
                            className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-primary/80 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-12 lg:p-24 text-center">
                        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">Because Their <span className="font-serif italic underline decoration-primary/50">Discovery</span> Matters</h2>
                        <p className="text-primary-foreground/90 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
                            We don't just treat symptoms; we nurture growth. Book a consultation with our world-class pediatricians and give your child the best foundation.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-3 px-12 py-5 bg-background text-primary font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-primary/20 text-lg">
                            Schedule Appointment <ArrowRight size={24} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
