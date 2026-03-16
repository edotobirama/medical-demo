'use client';

import { ShieldCheck, FileText, CheckCircle2, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";

export default function InsuranceInfoPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-emerald-500/30">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-600/10 blur-[120px] rounded-full -z-10"></div>
                
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full mb-8">
                        <ShieldCheck size={16} className="text-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Financial Transparency</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight text-white">
                        Coverage <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Without Limits</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Grandview Medical Center partners with global health providers to ensure that elite medical care remains accessible to all.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 pb-40">
                {/* Providers Grid */}
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 lg:p-16 rounded-[4rem] group hover:border-emerald-500/20 transition-all shadow-3xl mb-16">
                    <div className="flex items-center gap-6 mb-12">
                        <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-600/20">
                            <ShieldCheck size={32} className="text-emerald-500" />
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Accepted Providers</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['Medicare / Medicaid', 'BlueCross BlueShield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Humana', 'Kaiser Permanente', 'Anthem'].map((provider) => (
                            <div key={provider} className="flex items-center justify-center p-6 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-center group/card">
                                <span className="text-slate-400 font-bold text-sm tracking-wide group-hover/card:text-white transition-colors uppercase">{provider}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center p-8 bg-black/40 rounded-3xl border border-white/5 italic text-slate-500 text-sm">
                        *If your specific plan is not listed, our concierge billing team can assist with out-of-network authorizations.
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Self Pay */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] hover:border-blue-500/50 transition-all duration-500">
                        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-600/20">
                            <DollarSign size={32} className="text-blue-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Self-Pay Models</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10">Transparent, predictable pricing for elective and non-insured clinical pathways. Flexible 0% interest financing available.</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-blue-500 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                            Financial Consulting <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Counselor */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] hover:border-emerald-500/50 transition-all duration-500">
                        <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-600/20">
                            <FileText size={32} className="text-emerald-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Secure Billing</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-10">Direct coordination with our senior financial counsellors to simplify your medical billing experience.</p>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-emerald-500 font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                            Speak with a Counselor <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
