"use client";

import { motion } from "framer-motion";
import { doctorsData } from "./DoctorsData";
import Image from "next/image";
import { ScanFace, Activity } from "lucide-react";

export default function DoctorsCyberpunk() {
    return (
        <section className="py-24 bg-[#050505] text-[#00f3ff] font-mono border-t border-[#00f3ff]/30">
            <div className="container mx-auto px-6">
                <div className="flex items-center gap-4 mb-16 justify-center">
                    <ScanFace size={32} className="animate-pulse" />
                    <h2 className="text-3xl font-bold uppercase tracking-[0.2em] text-shadow-[0_0_10px_#00f3ff]">
                        Personnel Database
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctorsData.map((doctor, index) => (
                        <div key={index} className="bg-[#00f3ff]/5 border border-[#00f3ff]/30 p-2 relative group hover:border-[#ff00ff] hover:bg-[#ff00ff]/5 transition-colors">
                            {/* Augmented Reality Corners */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f3ff]" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00f3ff]" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00f3ff]" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f3ff]" />

                            <div className="relative h-[300px] w-full mb-4 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_2px)] bg-[size:100%_4px] opacity-30 pointer-events-none" />
                            </div>

                            <div className="px-2 pb-2">
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#ff00ff]">{doctor.name}</h3>
                                <p className="text-xs text-[#00f3ff]/70 mb-3 ml-2 border-l border-[#00f3ff]/50 pl-2">
                                    SPEC: {doctor.specialty}<br />
                                    STATUS: {doctor.availability.toUpperCase()}
                                </p>
                                <button className="w-full py-2 border border-[#00f3ff] text-[#00f3ff] text-xs font-bold uppercase hover:bg-[#00f3ff] hover:text-black transition-colors flex items-center justify-center gap-2">
                                    <Activity size={12} /> Initiate Contact
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
