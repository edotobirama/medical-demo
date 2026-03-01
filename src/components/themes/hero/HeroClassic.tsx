"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Consistent import

export default function HeroClassic() {
    return (
        <section className="relative min-h-screen flex flex-col lg:flex-row bg-[#FDFBF7] text-[#1a1a1a] font-serif overflow-hidden">
            {/* Left Content - 40% */}
            <div className="lg:w-[45%] relative z-10 flex flex-col justify-center px-8 lg:px-20 pt-32 pb-20 lg:py-0 border-r border-[#1a1a1a]/10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >


                    <h1 className="text-6xl lg:text-8xl font-medium leading-[0.95] tracking-tight mb-8">
                        Grand<br />
                        <span className="italic font-light">View.</span>
                    </h1>

                    <p className="text-lg lg:text-xl font-sans font-light text-[#1a1a1a]/70 max-w-md leading-relaxed mb-12">
                        Impeccable care for the discerning patient. Where medical excellence meets uncompromising luxury and privacy.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 font-sans">
                        <Link href="/book" className="group flex items-center justify-between w-full sm:w-auto gap-12 px-8 py-5 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-all duration-300">
                            <span className="text-sm font-medium tracking-wide uppercase">Book Appointment</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                        </Link>

                        <Link href="/doctors" className="group flex items-center justify-between w-full sm:w-auto gap-8 px-8 py-5 border border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a]/5 transition-all duration-300">
                            <span className="text-sm font-medium tracking-wide uppercase">Our Specialists</span>
                        </Link>
                    </div>

                    <div className="mt-20 pt-8 border-t border-[#1a1a1a]/10 flex justify-between items-end font-sans">
                        <div>
                            <div className="text-3xl font-serif">4.9</div>
                            <div className="text-xs text-[#1a1a1a]/50 uppercase tracking-wider mt-1">Patient Satisfaction</div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-serif">15k</div>
                            <div className="text-xs text-[#1a1a1a]/50 uppercase tracking-wider mt-1">Lives Impacted</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Image - 60% */}
            <div className="lg:w-[55%] relative h-[50vh] lg:h-auto bg-[#e5e5e5]">
                <Image
                    src="/images/hero-hospital.png"
                    alt="Grandview Interior"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-[1.5s] ease-in-out"
                    priority
                />
                <div className="absolute inset-0 bg-[#1a1a1a]/10 pointer-events-none" />

                {/* Floating Quote Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="absolute bottom-56 left-0 z-20 bg-[#FDFBF7]/95 backdrop-blur-sm p-6 md:p-8 max-w-[calc(100%-2rem)] lg:max-w-sm shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-r-4 border-[#1a1a1a]"
                >
                    <p className="font-serif italic text-xl leading-relaxed text-[#1a1a1a]">
                        "Medicine is not just a science; it is an art of healing."
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-8 h-[1px] bg-[#1a1a1a]/30" />
                        <span className="text-xs font-sans uppercase tracking-widest text-[#1a1a1a]/60">Chief of Surgery</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
