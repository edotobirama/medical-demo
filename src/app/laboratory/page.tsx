'use client';

import { Microscope, FlaskConical, Droplets, TestTube, Dna, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function LaboratoryPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="h-24"></div>
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image 
                        src="/images/services/laboratory_premium.png" 
                        alt="Advanced Laboratory" 
                        fill 
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6 animate-in fade-in slide-in-from-left duration-700">
                            <div className="w-16 h-16 bg-primary/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-primary/20">
                                <Microscope size={32} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary uppercase tracking-widest">Molecular Precision</p>
                                <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Advanced <span className="text-primary">Laboratory</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-in fade-in slide-in-from-left duration-1000 delay-200">
                            Setting the gold standard in diagnostic accuracy. Our fully automated pathology lab delivers rapid, high-precision results powered by cutting-edge robotics and AI.
                        </p>
                        <div className="flex gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-500">
                            <Link href="/book" className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                                Book a Lab Test <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lab Services Grid */}
            <section className="container mx-auto px-6 py-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-4">Diagnostic Excellence</h2>
                        <p className="text-muted-foreground max-w-xl">From routine screenings to complex genomic testing, our laboratory provides the insights needed for effective treatment.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">1M+ Tests Yearly</div>
                        <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">ISO Certified</div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Droplets, title: 'Precision Blood Analysis', desc: 'Comprehensive hematology and metabolic panels with robotic processing.' },
                        { icon: FlaskConical, title: 'Advanced Biochemistry', desc: 'High-throughput analyzers for hormonal, enzyme, and organ function testing.' },
                        { icon: Dna, title: 'Genomic Diagnostics', desc: 'State-of-the-art PCR and sequencing for genetic and infectious disease mapping.' },
                        { icon: TestTube, title: 'Clinical Microbiology', desc: 'Rapid culture and identification systems for targeted antibiotic therapy.' },
                        { icon: FileSearch, title: 'Digital Histopathology', desc: 'AI-assisted tissue analysis and biopsy evaluation by top pathologists.' },
                        { icon: Microscope, title: 'Toxicology Screenings', desc: 'Highly sensitive detection of substances and environmental toxins.' },
                    ].map((s, i) => (
                        <div key={i} className="group relative bg-card border border-border p-8 rounded-3xl hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <s.icon size={28} className="text-primary" />
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
                            src="/images/services/laboratory_premium.png" 
                            alt="Lab Background" 
                            fill 
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                    </div>
                    
                    <div className="relative z-10 p-12 lg:p-20 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Real Results. <span className="italic">Real Fast.</span></h2>
                        <p className="text-white/80 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
                            Access your test results via our secure patient portal. We combine speed with surgical precision to ensure your treatment starts on the right note.
                        </p>
                        <Link href="/book" className="inline-flex items-center gap-3 px-10 py-5 bg-background text-primary font-bold rounded-2xl hover:scale-105 transition-all shadow-xl">
                            Schedule a Test <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
