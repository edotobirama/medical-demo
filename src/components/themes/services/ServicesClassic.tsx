"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ServicesClassic() {
    return (
        <section className="py-32 bg-[#F8F9FA] text-[#1a1a1a] font-serif">
            <div className="container mx-auto px-12">
                <div className="border-t border-black mb-12 pt-6 flex justify-between items-start">
                    <span className="text-xs uppercase tracking-[0.2em] font-sans text-gray-500">Departments</span>
                    <h2 className="text-5xl font-medium tracking-tight max-w-lg leading-[1.1]">
                        Curated Medical <br /> Excellence.
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mt-24">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.8 }}
                            className="group cursor-pointer"
                        >
                            <div className="mb-6 flex justify-between items-start border-b border-gray-200 pb-6 group-hover:border-black transition-colors duration-500">
                                <service.icon size={28} strokeWidth={1} className="text-gray-400 group-hover:text-black transition-colors" />
                                <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300" />
                            </div>

                            <h3 className="text-2xl font-normal mb-4 group-hover:underline decoration-1 underline-offset-4 decoration-gray-400">
                                {service.title}
                            </h3>

                            <p className="text-gray-500 font-sans text-sm leading-relaxed max-w-xs">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
