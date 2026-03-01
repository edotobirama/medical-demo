"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import Link from "next/link";

export default function ServicesMinimal() {
    return (
        <section className="border-t-4 border-black bg-white text-black font-mono">

            {/* Ticker Tape */}
            <div className="border-b-4 border-black py-3 overflow-hidden whitespace-nowrap bg-yellow-400">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="inline-block"
                >
                    {[...Array(10)].map((_, i) => (
                        <span key={i} className="text-lg font-bold uppercase tracking-widest mx-8">
                            /// AVAILABLE 24/7 /// EMERGENCY UNIT READY /// BOOK NOW ///
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3">
                {servicesData.map((service, index) => (
                    <div
                        key={index}
                        className="border-b-4 border-r-4 border-black p-8 hover:bg-black hover:text-white transition-colors duration-200 group relative min-h-[300px] flex flex-col justify-between"
                        style={{ borderRightWidth: (index + 1) % 3 === 0 ? '0px' : '4px' }} // Quick fix for right borders on desktop
                    >
                        <div>
                            <div className="flex justify-between items-start mb-8">
                                <span className="text-4xl font-black">0{index + 1}</span>
                                <service.icon size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold uppercase mb-4 tracking-tighter">
                                {service.title}
                            </h3>
                        </div>

                        <div>
                            <p className="text-sm border-t-2 border-current pt-4 font-bold max-w-[80%]">
                                {service.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
