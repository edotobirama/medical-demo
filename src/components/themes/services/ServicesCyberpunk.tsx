"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import { Cpu } from "lucide-react";

export default function ServicesCyberpunk() {
    return (
        <section className="py-24 bg-[#050505] text-[#00f3ff] font-mono relative border-t border-[#00f3ff]/30">
            {/* Grid Layoout */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex items-center gap-4 mb-16 border-b-2 border-[#ff00ff] pb-4 inline-block pr-12">
                    <Cpu className="animate-pulse" />
                    <h2 className="text-3xl font-bold uppercase tracking-widest text-shadow-[0_0_10px_#00f3ff]">
                        System Modules
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className="relative group bg-[#00f3ff]/5 border border-[#00f3ff]/30 p-6 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff] transition-all overflow-hidden clip-path-polygon"
                        >
                            {/* Corner Accents */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-transparent border-r-[#00f3ff]/50 group-hover:border-r-[#ff00ff] transition-colors" />

                            <div className="flex items-start gap-4 mb-4">
                                <service.icon className="text-[#ff00ff] group-hover:drop-shadow-[0_0_8px_#ff00ff] transition-all" size={24} />
                                <h3 className="text-xl font-bold uppercase tracking-wider text-white group-hover:text-[#00f3ff]">
                                    {service.title}
                                </h3>
                            </div>

                            <p className="text-[#00f3ff]/70 text-sm leading-relaxed border-l-2 border-[#00f3ff]/20 pl-4">
                                {'>'} {service.description}
                            </p>

                            <div className="absolute bottom-2 right-2 text-[10px] text-[#00f3ff]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                :: EXEC_V.{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
