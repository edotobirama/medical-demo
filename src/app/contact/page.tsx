'use client';

import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { sendContactMessage } from '@/lib/actions';
import { useActionState } from 'react';

export default function ContactPage() {
    const [state, formAction, isPending] = useActionState(sendContactMessage, null);

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
                
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-8">
                        <Mail size={16} className="text-blue-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-400">Concierge Support</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight text-white">
                        Reach Out <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">To Grandview</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Our clinical coordinators are available 24/7 to assist with your medical inquiries and global consultations.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 pb-40">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Contact Info */}
                    <div className="space-y-10">
                        <div className="p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <Phone size={28} className="text-blue-500 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Emergency Intake</h4>
                                    <p className="text-2xl font-black text-white">+1 (800) GRANDVIEW</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Mail size={28} className="text-indigo-500 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">General Inquiries</h4>
                                    <p className="text-2xl font-black text-white">care@grandview.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] hover:border-emerald-500/30 transition-all group">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-emerald-600/10 rounded-2xl flex items-center justify-center border border-emerald-600/20 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <MapPin size={28} className="text-emerald-500 group-hover:text-white" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Flagship Hospital</h4>
                                    <p className="text-xl font-bold text-white">700 Medical Dr, Grandview Heights</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 lg:p-16 rounded-[4rem] group hover:border-blue-500/20 transition-all shadow-3xl">
                        {state?.success ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-10 shadow-3xl shadow-emerald-500/20">
                                    <CheckCircle size={48} className="text-white" />
                                </div>
                                <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Message Transmitted</h3>
                                <p className="text-slate-400 font-medium">Our clinical team will analyze your request and respond via secure channel within 2 hours.</p>
                                <button onClick={() => window.location.reload()} className="mt-12 text-blue-500 font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all">
                                    Send Another Inquiry <ArrowRight size={16} />
                                </button>
                            </div>
                        ) : (
                            <form action={formAction} className="space-y-8">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-10">Secure Gateway</h3>
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                                        <input 
                                            name="name" 
                                            type="text" 
                                            required 
                                            placeholder="John Doe" 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                        <input 
                                            name="email" 
                                            type="email" 
                                            required 
                                            placeholder="john@example.com" 
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Clinical Service</label>
                                    <select 
                                        name="subject" 
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium appearance-none"
                                    >
                                        <option value="Cardiology">Cardiology Center</option>
                                        <option value="Laboratory">Advanced Laboratory</option>
                                        <option value="Emergency">24/7 Emergency</option>
                                        <option value="General">General Inquiries</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Detailed Inquiry</label>
                                    <textarea 
                                        name="message" 
                                        required 
                                        rows={6} 
                                        placeholder="How can our specialists assist you today?" 
                                        className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium resize-none"
                                    />
                                </div>
                                <button 
                                    disabled={isPending}
                                    type="submit" 
                                    className="w-full py-6 bg-white text-slate-950 font-black rounded-3xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-2xl uppercase tracking-widest text-sm disabled:opacity-50"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Analysing Message...
                                        </>
                                    ) : (
                                        <>
                                            Transmit Securely <ArrowRight size={20} strokeWidth={3} />
                                        </>
                                    )}
                                </button>
                                {state?.error && (
                                    <p className="text-red-500 text-xs font-bold text-center mt-4">Failed to transmit. Please verify your connection.</p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
