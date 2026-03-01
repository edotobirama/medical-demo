"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, Smile } from "lucide-react";
import Image from "next/image";
import Link from "next/link";



export default function HeroPlayful() {
    return (
        <section className="relative min-h-[90vh] bg-[#FFF0F5] text-slate-800 overflow-hidden font-display">
            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#E0B0FF]/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FFB7B2]/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 pt-32 pb-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="lg:w-1/2 text-center lg:text-left space-y-8"
                    >
                        <div className="inline-block px-6 py-2 bg-white rounded-full shadow-lg text-rose-500 font-bold text-sm tracking-wide mb-4 animate-bounce-subtle">
                            ✨ Healing made happy
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-slate-800 leading-tight">
                            Your Health, <br />
                            <span className="text-rose-500 relative inline-block">
                                With a Smile.
                                <svg className="absolute w-full h-3 bottom-1 left-0 text-rose-300 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 font-medium leading-relaxed">
                            No scary waiting rooms here! Just friendly doctors, comfy spaces, and care that feels like a hug.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Link href="/book" className="px-8 py-4 bg-rose-500 text-white rounded-[2rem] font-bold shadow-xl shadow-rose-200 hover:scale-110 hover:shadow-2xl hover:bg-rose-400 transition-all active:scale-95 flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" /> Book a Visit
                            </Link>
                            <Link href="/about" className="px-8 py-4 bg-white text-slate-700 rounded-[2rem] font-bold shadow-lg hover:scale-105 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <Smile className="w-5 h-5 text-yellow-500" /> Meet the Team
                            </Link>
                        </div>
                    </motion.div>

                    {/* Image / Visuals */}
                    <div className="lg:w-1/2 relative h-[500px] w-full">
                        <motion.div
                            variants={{
                                hover: { scale: 1.05 }
                            }}
                            whileHover="hover"
                            className="absolute top-10 left-10 w-64 h-64 bg-white p-4 rounded-[2rem] shadow-2xl rotate-[-6deg] z-20"
                        >
                            <div className="w-full h-full bg-rose-100 rounded-[1.5rem] overflow-hidden relative">
                                <Image src="/images/hero-hospital.png" alt="Happy Doctor" fill className="object-cover" />
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-20 right-10 w-56 h-56 bg-white p-4 rounded-full shadow-2xl z-30"
                        >
                            <div className="w-full h-full bg-cyan-100 rounded-full flex flex-col items-center justify-center text-center p-4">
                                <Heart className="w-12 h-12 text-rose-500 fill-rose-500 mb-2 animate-pulse" />
                                <div className="text-2xl font-black text-slate-700">100%</div>
                                <div className="text-xs font-bold text-slate-500">Care & Love</div>
                            </div>
                        </motion.div>

                        {/* Blobs */}
                        <div className="absolute top-0 right-0 w-full h-full -z-10">
                            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-violet-200 opacity-60">
                                <path transform="translate(100 100)" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.2,-19.2,95.8,-5.3C93.4,8.6,81.8,21.5,70.5,32.4C59.2,43.3,48.2,52.2,36.4,59.3C24.6,66.4,11.9,71.7,-1.8,74.8C-15.5,77.9,-29.9,78.8,-42.6,73.6C-55.3,68.4,-66.3,57.1,-75.1,44.2C-83.9,31.3,-90.5,16.8,-90.3,2.4C-90.1,-12,-83.1,-26.3,-72.9,-37.6C-62.7,-48.9,-49.3,-57.2,-36,-64.9C-22.7,-72.6,-9.5,-79.8,5,-88.4L19.5,-97.1" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
