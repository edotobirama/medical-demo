"use client";

import Navbar from '@/components/Navbar';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import clsx from 'clsx';

export default function ContactPage() {
    const { theme } = useTheme();
    const isMinimal = theme === 'minimal';
    const isDark = ['modern', 'cyberpunk'].includes(theme);
    const isNature = theme === 'nature';
    const isPlayful = theme === 'playful';

    return (
        <div className={clsx(
            "min-h-screen pb-24 font-sans transition-colors duration-300 relative overflow-hidden",
            isMinimal ? "bg-white text-black font-mono" :
                isDark ? "bg-slate-950 text-white selection:bg-cyan-500/30" :
                    isNature ? "bg-[#F1F0E8] text-[#2C362B]" :
                        isPlayful ? "bg-rose-50 text-rose-900" :
                            "bg-background text-foreground"
        )}>
            <Navbar />

            {/* Modern Background Blobs */}
            {isDark && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-[20%] right-[30%] w-[20vw] h-[20vw] bg-blue-500/10 rounded-full blur-[80px]" />
                </div>
            )}

            {/* Hero */}
            <div className={clsx(
                "pt-32 pb-20 px-6 text-center transition-colors relative z-10",
                isMinimal ? "bg-white border-b-4 border-black" :
                    isDark ? "bg-transparent text-white" :
                        isNature ? "bg-[#4A5D45] text-[#F1F0E8]" :
                            isPlayful ? "bg-rose-200 text-rose-900" :
                                "bg-slate-900 text-white"
            )}>
                <h1 className={clsx(
                    "text-4xl md:text-5xl font-bold mb-4",
                    isMinimal ? "font-black uppercase tracking-tighter" :
                        isDark ? "bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-200" :
                            "font-heading"
                )}>
                    Get in Touch
                </h1>
                <p className={clsx(
                    "max-w-2xl mx-auto text-lg",
                    isMinimal ? "font-bold text-black" :
                        isDark ? "text-slate-400" :
                            isNature ? "text-[#E5E9DF]" :
                                "text-slate-300"
                )}>
                    We are here to help. Reach out to us for appointments, inquiries, or emergency services.
                </p>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Phone, title: "Phone", text: "+1 (555) 123-4567", sub: "24/7 Emergency Line" },
                        { icon: Mail, title: "Email", text: "contact@grandview.com", sub: "Response within 2 hours" },
                        { icon: MapPin, title: "Location", text: "123 Medical Plaza", sub: "New York, NY 10001" }
                    ].map((item, i) => (
                        <div key={i} className={clsx(
                            "rounded-2xl p-8 text-center transition-transform hover:-translate-y-1",
                            isMinimal ? "bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" :
                                isDark ? "bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]" :
                                    isNature ? "bg-white/80 shadow-md text-[#2C362B]" :
                                        isPlayful ? "bg-white/80 shadow-md text-rose-900 border-2 border-rose-100" :
                                            "bg-card border border-border shadow-lg"
                        )}>
                            <div className={clsx(
                                "w-12 h-12 flex items-center justify-center mx-auto mb-4 rounded-xl",
                                isMinimal ? "bg-black text-white rounded-none" :
                                    isDark ? "bg-cyan-500/10 text-cyan-400" :
                                        isNature ? "bg-[#4A5D45]/10 text-[#4A5D45]" :
                                            isPlayful ? "bg-rose-100 text-rose-500" :
                                                "bg-primary/10 text-primary"
                            )}>
                                <item.icon size={24} />
                            </div>
                            <h3 className={clsx("text-xl font-bold mb-2", isDark ? "text-white" : "")}>{item.title}</h3>
                            <p className={clsx("text-lg font-semibold", isDark ? "text-slate-200" : "")}>{item.text}</p>
                            <p className={clsx("text-sm",
                                isMinimal ? "text-black opacity-70" :
                                    isDark ? "text-slate-400" :
                                        isNature ? "opacity-80" :
                                            "text-muted-foreground"
                            )}>{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Map Placeholder */}
                    <div className={clsx(
                        "rounded-2xl h-[400px] w-full flex items-center justify-center font-bold",
                        isMinimal ? "bg-zinc-100 border-4 border-black rounded-none text-black uppercase tracking-widest" :
                            isDark ? "bg-white/5 border border-white/10 backdrop-blur text-slate-500" :
                                isNature ? "bg-[#E5E9DF] text-[#4A5D45]" :
                                    "bg-muted text-muted-foreground border border-border"
                    )}>
                        Interactive Map Integration
                    </div>

                    {/* Form */}
                    <div className={clsx(
                        "p-8 rounded-2xl",
                        isMinimal ? "bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" :
                            isDark ? "bg-white/5 border border-white/10 backdrop-blur-md" :
                                isNature ? "bg-white shadow-md" :
                                    isPlayful ? "bg-white shadow-md border-2 border-rose-100" :
                                        "bg-card shadow-sm border border-border"
                    )}>
                        <h2 className={clsx("text-2xl font-bold mb-6", isMinimal ? "uppercase font-black" : isDark ? "text-white" : "")}>Send us a Message</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "")}>First Name</label>
                                    <input type="text" className={clsx("w-full p-3 outline-none transition",
                                        isMinimal ? "border-2 border-black rounded-none focus:bg-yellow-100 placeholder:text-black/50" :
                                            isDark ? "bg-slate-950/50 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600" :
                                                isNature ? "bg-[#F1F0E8] border-none rounded-lg focus:ring-2 focus:ring-[#4A5D45]" :
                                                    isPlayful ? "bg-rose-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300" :
                                                        "rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                                    )} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "")}>Last Name</label>
                                    <input type="text" className={clsx("w-full p-3 outline-none transition",
                                        isMinimal ? "border-2 border-black rounded-none focus:bg-yellow-100 placeholder:text-black/50" :
                                            isDark ? "bg-slate-950/50 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600" :
                                                isNature ? "bg-[#F1F0E8] border-none rounded-lg focus:ring-2 focus:ring-[#4A5D45]" :
                                                    isPlayful ? "bg-rose-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300" :
                                                        "rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                                    )} placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "")}>Email Address</label>
                                <input type="email" className={clsx("w-full p-3 outline-none transition",
                                    isMinimal ? "border-2 border-black rounded-none focus:bg-yellow-100 placeholder:text-black/50" :
                                        isDark ? "bg-slate-950/50 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600" :
                                            isNature ? "bg-[#F1F0E8] border-none rounded-lg focus:ring-2 focus:ring-[#4A5D45]" :
                                                isPlayful ? "bg-rose-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300" :
                                                    "rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                                )} placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className={clsx("text-sm font-medium", isDark ? "text-slate-300" : "")}>Message</label>
                                <textarea className={clsx("w-full p-3 outline-none transition h-32",
                                    isMinimal ? "border-2 border-black rounded-none focus:bg-yellow-100 placeholder:text-black/50" :
                                        isDark ? "bg-slate-950/50 border border-white/10 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-slate-600" :
                                            isNature ? "bg-[#F1F0E8] border-none rounded-lg focus:ring-2 focus:ring-[#4A5D45]" :
                                                isPlayful ? "bg-rose-50 border-none rounded-xl focus:ring-2 focus:ring-rose-300" :
                                                    "rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary"
                                )} placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="button" className={clsx(
                                "w-full py-4 font-bold transition flex items-center justify-center gap-2",
                                isMinimal ? "bg-black text-white rounded-none hover:bg-yellow-400 hover:text-black border-2 border-black uppercase" :
                                    isDark ? "bg-cyan-500 text-slate-950 rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:scale-[1.02]" :
                                        isNature ? "bg-[#4A5D45] text-[#F1F0E8] rounded-xl hover:bg-[#2C362B]" :
                                            isPlayful ? "bg-rose-400 text-white rounded-full hover:bg-rose-500 hover:scale-105" :
                                                "bg-primary text-primary-foreground rounded-xl hover:opacity-90"
                            )}>
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
