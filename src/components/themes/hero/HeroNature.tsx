"use client";

import { motion } from "framer-motion";
import { Leaf, Sun, Wind, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroNature() {
    return (
        <section className="relative min-h-[90vh] bg-[#F1F0E8] text-[#2C362B] font-sans selection:bg-[#8FBC8F] selection:text-white overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>

            {/* Organic Shape Background */}
            <div className="absolute right-0 top-0 w-[50vw] h-screen bg-[#E5E9DF] rounded-bl-[200px] -z-10 hidden lg:block" />

            <div className="container mx-auto px-6 h-full pt-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-2 text-[#6B8E23] font-medium tracking-wide uppercase text-sm">
                            <Leaf className="w-4 h-4" /> Holistic Healing Center
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-serif text-[#2C362B] leading-tight">
                            Restore Your <br />
                            <span className="italic relative z-10">
                                Vitality.
                                <span className="absolute bottom-2 left-0 w-full h-3 bg-[#D4E09B] -z-10 rounded-full opacity-60"></span>
                            </span>
                        </h1>

                        <p className="text-[#5C635A] text-xl leading-relaxed max-w-md">
                            Healthcare rooted in nature, backed by science. We treat the whole person, not just the symptoms, in an environment designed for peace.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 pt-4">
                            <Link href="/book" className="group px-8 py-4 bg-[#4A5D45] text-[#F1F0E8] rounded-full font-medium hover:bg-[#3A4A36] transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_rgba(74,93,69,0.2)] hover:shadow-[0_15px_30px_rgba(74,93,69,0.3)] hover:-translate-y-1">
                                Begin Wellness <Sun className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                            </Link>
                            <Link href="/doctors" className="px-8 py-4 border-2 border-[#4A5D45] text-[#4A5D45] rounded-full font-medium hover:bg-[#4A5D45] hover:text-[#F1F0E8] transition-all flex items-center justify-center gap-3">
                                Explore Treatments
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Images */}
                    <div className="relative h-[600px] w-full">
                        <motion.div
                            initial={{ clipPath: 'inset(10% 10% 10% 10% round 200px 200px 0 0)' }}
                            animate={{ clipPath: 'inset(0% 0% 0% 0% round 200px 200px 0 0)' }}
                            transition={{ duration: 1.5, ease: "circOut" }}
                            className="absolute inset-0 z-10"
                        >
                            <Image
                                src="/images/hero-hospital.png"
                                alt="Peaceful Atrium"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover object-center grayscale-[20%] sepia-[10%]"
                            />
                            <div className="absolute inset-0 bg-[#4A5D45]/10 mix-blend-multiply" />
                        </motion.div>

                        {/* Floating Element */}
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-12 -left-12 z-20 bg-[#FDFBF7] p-8 rounded-tr-[50px] rounded-bl-[50px] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-[#E5E9DF] max-w-xs"
                        >
                            <Wind className="w-8 h-8 text-[#A6B08E] mb-4" />
                            <h3 className="font-serif text-xl mb-2 text-[#2C362B]">Pure Air Quality</h3>
                            <p className="text-sm text-[#5C635A]">Our facilities utilize biophilic filtration systems for restorative breathing.</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
