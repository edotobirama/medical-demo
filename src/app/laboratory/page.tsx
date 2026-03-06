'use client';

import { Microscope, FlaskConical, Droplets, TestTube, Dna, FileSearch, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LaboratoryPage() {
    return (
        <div className="min-h-screen bg-background">
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-violet-500/10 to-transparent"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-purple-500/15 rounded-2xl flex items-center justify-center">
                            <Microscope size={32} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Diagnostics</p>
                            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">Advanced Laboratory</h1>
                        </div>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        State-of-the-art pathology and diagnostic laboratory with fully automated systems for fast, precise results.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold text-foreground mb-8">Lab Services</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Droplets, title: 'Blood Analysis', desc: 'Complete blood count, metabolic panels, and specialized tests.' },
                        { icon: FlaskConical, title: 'Clinical Chemistry', desc: 'Liver, kidney, and thyroid function testing with automated analyzers.' },
                        { icon: Dna, title: 'Molecular Diagnostics', desc: 'PCR-based testing for genetic conditions and infectious diseases.' },
                        { icon: TestTube, title: 'Urinalysis', desc: 'Comprehensive urine testing for kidney and metabolic screening.' },
                        { icon: FileSearch, title: 'Histopathology', desc: 'Tissue examination and biopsy analysis by expert pathologists.' },
                        { icon: Microscope, title: 'Microbiology', desc: 'Culture and sensitivity testing for infection identification.' },
                    ].map((s, i) => (
                        <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-purple-500/20 transition-all group">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <s.icon size={24} className="text-purple-500" />
                            </div>
                            <h3 className="text-lg font-bold text-card-foreground mb-2">{s.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="container mx-auto px-6 pb-20">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-10 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Get Your Lab Tests Done</h2>
                    <p className="text-white/80 mb-6 max-w-lg mx-auto">Walk-in or book an appointment for any lab test. Results delivered digitally.</p>
                    <Link href="/book" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-white/90 transition-all">
                        Book Appointment <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
