"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Activity, Radio, Crosshair } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroCyberpunk() {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setGlitch(true);
            setTimeout(() => setGlitch(false), 200);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[90vh] bg-[#050505] text-[#00f3ff] overflow-hidden font-mono selection:bg-[#ff00ff] selection:text-white">
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#00f3ff 1px, transparent 1px), linear-gradient(90deg, #00f3ff 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)'
                }}
            />
            {/* Scanlines */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[linear-gradient(to_bottom,transparent_3px,#000_3px)] bg-[size:100%_4px] opacity-20" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

            <div className="container relative z-20 mx-auto px-6 h-full flex flex-col justify-center pt-24">

                {/* HUD Header */}
                <div className="flex justify-between items-center border-b border-[#00f3ff]/30 pb-2 mb-12">
                    <div className="flex gap-4 text-xs font-bold tracking-widest">
                        <span className="text-[#ff00ff]">SYS.ONLINE</span>
                        <span>NET.SECURE</span>
                        <span>V.2.0.77</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`w-8 h-2 ${i > 3 ? 'bg-[#ff00ff]' : 'bg-[#00f3ff]'} skew-x-[-20deg]`} />
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center gap-2 border border-[#ff00ff] text-[#ff00ff] px-4 py-1 text-xs uppercase tracking-[0.2em] bg-[#ff00ff]/10">
                            <Zap size={12} /> Neural Link Active
                        </div>

                        <h1 className={`text-6xl lg:text-8xl font-black uppercase leading-none tracking-tighter ${glitch ? 'translate-x-1 text-[#ff00ff]' : ''} transition-all duration-75`}>
                            Bio<span className="text-white">Tech</span><br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff]">Evolution</span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-lg leading-relaxed border-l-2 border-[#00f3ff] pl-4">
                            {'>'} INITIATING ADVANCED DIAGNOSTICS...<br />
                            {'>'} OPTIMIZING RECOVERY PROTOCOLS...<br />
                            {'>'} UPGRADING HUMAN POTENTIAL.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8">
                            <Link href="/book" className="relative group px-8 py-4 bg-[#00f3ff] text-black font-black uppercase tracking-wider hover:bg-[#ff00ff] transition-colors clip-path-polygon">
                                <span className="absolute inset-0 border-2 border-white mix-blend-overlay opacity-50"></span>
                                Start Sequence
                            </Link>

                            <Link href="/doctors" className="px-8 py-4 border border-[#00f3ff] text-[#00f3ff] font-bold uppercase tracking-wider hover:bg-[#00f3ff]/10 hover:shadow-[0_0_20px_#00f3ff] transition-all flex items-center gap-2">
                                <Crosshair size={18} /> Locate Specialists
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Hologram UI */}
                    <div className="relative hidden lg:block">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative w-full h-[500px] border border-[#00f3ff]/20 bg-[#00f3ff]/5 backdrop-blur-sm p-2"
                            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)' }}
                        >
                            {/* Decorative Corners */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f3ff]" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f3ff]" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f3ff]" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f3ff]" />

                            <div className="h-full w-full flex flex-col p-6 relative overflow-hidden">
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#00f3ff]/30" />
                                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#00f3ff]/30" />

                                {/* Rotating Ring */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-dashed border-[#ff00ff]/50 rounded-full animate-spin-slow" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-[#00f3ff] rounded-full animate-pulse opacity-50" />

                                <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white animate-pulse" />

                                <div className="absolute top-4 right-4 text-xs font-mono text-[#00f3ff]">
                                    CPU: 98%<br />
                                    MEM: 64TB<br />
                                    BIO: STABLE
                                </div>

                                <div className="mt-auto flex gap-4">
                                    <div className="flex-1 bg-[#00f3ff]/10 border border-[#00f3ff]/30 p-2">
                                        <div className="text-[10px] text-slate-400">PATIENT STATUS</div>
                                        <div className="h-1 w-full bg-[#333] mt-1"><div className="h-full w-[80%] bg-[#00f3ff] animate-pulse" /></div>
                                    </div>
                                    <div className="flex-1 bg-[#ff00ff]/10 border border-[#ff00ff]/30 p-2">
                                        <div className="text-[10px] text-slate-400">THREAT LEVEL</div>
                                        <div className="h-1 w-full bg-[#333] mt-1"><div className="h-full w-[10%] bg-[#ff00ff]" /></div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
