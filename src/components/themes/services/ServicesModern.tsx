"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ServicesModern() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold border border-blue-500/20"
                        >
                            Future of Care
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mt-4"
                        >
                            Medical Excellence
                        </motion.h2>
                    </div>
                    <Link href="/services" className="text-white flex items-center gap-2 hover:gap-4 transition-all group">
                        View All Services <ArrowRight className="group-hover:text-blue-400" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Hover Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-[50px] group-hover:bg-blue-500/30 transition-all pointer-events-none -translate-y-1/2 translate-x-1/2" />

                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                                <service.icon size={24} />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                            <p className="text-slate-400 leading-relaxed mb-6">
                                {service.description}
                            </p>

                            <Link href={service.link} className="inline-flex items-center text-sm font-medium text-blue-400 hover:text-white transition-colors">
                                Learn more <ArrowRight size={14} className="ml-1" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
