"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, Plus } from "lucide-react";
import Link from "next/link";

export default function HeroMinimal() {
    return (
        <section className="relative min-h-[90vh] bg-white text-black font-mono flex flex-col border-b-2 border-black pt-28 lg:pt-32">
            {/* Marquee Top */}
            <div className="border-b-2 border-black overflow-hidden whitespace-nowrap py-3 bg-black text-white">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 10, ease: "linear", repeat: Infinity }}
                    className="inline-block text-sm font-bold tracking-widest uppercase"
                >
                    Wait Times: ER [12m] // Cardiology [2d] // Pediatrics [15m] // Neurology [1d] // Wait Times: ER [12m] // Cardiology [2d] // Pediatrics [15m] // Neurology [1d] //
                </motion.div>
            </div>

            <div className="flex-1 grid lg:grid-cols-[1.5fr_1fr] divide-x-2 divide-black">
                {/* Left: Main Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-between relative">
                    {/* Grid Background */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.05, pointerEvents: 'none' }} />

                    <div className="relative z-10">
                        <div className="inline-block border-2 border-black px-3 py-1 text-xs font-bold uppercase mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            System Status: Operational
                        </div>
                        <h1 className="text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
                            MED<br />ICAL<br />DATA
                        </h1>
                        <p className="text-xl font-bold max-w-lg leading-tight uppercase">
                            Precision diagnosis engine.<br />
                            Wait times optimized.<br />
                            Errors minimized.
                        </p>
                    </div>

                    <div className="relative z-10 pt-12 flex gap-4">
                        <Link href="/book" className="h-16 px-8 bg-black text-white text-lg font-bold uppercase flex items-center justify-center gap-4 hover:bg-transparent hover:text-black border-2 border-black transition-colors">
                            Initialize <Plus />
                        </Link>
                        <Link href="/doctors" className="h-16 w-16 flex items-center justify-center border-2 border-black hover:bg-black hover:text-white transition-colors">
                            <ArrowDownLeft size={32} />
                        </Link>
                    </div>
                </div>

                {/* Right: Info Panels */}
                <div className="divide-y-2 divide-black flex flex-col">
                    <div className="p-8 flex-1 bg-yellow-400 flex flex-col justify-center items-center border-b-2 border-black">
                        <div className="text-8xl font-black">24<span className="text-4xl">H</span></div>
                        <div className="text-sm font-bold uppercase tracking-widest mt-2 border-t-2 border-black pt-2 w-full text-center">Emergency Access</div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-center">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase">Doctors Available</span>
                            <span className="text-4xl font-black">102</span>
                        </div>
                        <div className="w-full h-8 border-2 border-black p-1">
                            <div className="w-[85%] h-full bg-black" />
                        </div>
                    </div>

                    <div className="p-8 flex-1 bg-blue-600 text-white flex flex-col justify-center">
                        <h3 className="text-2xl font-bold uppercase mb-4 leading-none">Latest Protocol</h3>
                        <p className="text-xs leading-relaxed opacity-80">
                            Updates to visitor policy effective immediately. Mask mandate lifted for Zone A.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
