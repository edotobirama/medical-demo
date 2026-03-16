"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const colorMap: any = {
    red: "from-red-600/20 text-red-400 border-red-500/20 group-hover:border-red-500/40",
    purple: "from-purple-600/20 text-purple-400 border-purple-500/20 group-hover:border-purple-500/40",
    blue: "from-blue-600/20 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40",
    orange: "from-orange-600/20 text-orange-400 border-orange-500/20 group-hover:border-orange-500/40",
    sky: "from-sky-600/20 text-sky-400 border-sky-500/20 group-hover:border-sky-500/40",
    emerald: "from-emerald-600/20 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/40",
};

const iconBgMap: any = {
    red: "bg-red-500/20 text-red-500",
    purple: "bg-purple-500/20 text-purple-500",
    blue: "bg-blue-500/20 text-blue-500",
    orange: "bg-orange-500/20 text-orange-500",
    sky: "bg-sky-500/20 text-sky-500",
    emerald: "bg-emerald-500/20 text-emerald-500",
};

const linkMap: any = {
    red: "text-red-400",
    purple: "text-purple-400",
    blue: "text-blue-400",
    orange: "text-orange-400",
    sky: "text-sky-400",
    emerald: "text-emerald-400",
};

const imageMap: any = {
    "/cardiology": "/images/services/cardiology_premium.png",
    "/laboratory": "/images/services/laboratory_premium.png",
    "/doctors": "/images/services/specialists_premium.png",
    "/emergency": "/images/services/emergency_premium.png",
    "/pediatrics": "/images/services/pediatrics_premium.png",
    "/preventive": "/images/services/preventive_premium.png",
};

export default function ServicesModern() {
    return (
        <section className="py-24 bg-transparent relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20"
                        >
                            Specialized Medicine
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-500 mt-6 tracking-tighter"
                        >
                            Centers of <span className="italic">Excellence</span>
                        </motion.h2>
                    </div>
                    <Link href="/services" className="text-white flex items-center gap-2 hover:gap-4 transition-all group font-bold">
                        Browse Full Directory <ArrowRight className="group-hover:text-blue-400" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                            className={`group relative p-10 rounded-[2.5rem] bg-white/5 border backdrop-blur-md transition-all duration-500 overflow-hidden ${colorMap[service.color] || "border-white/10"}`}
                        >
                            {/* Background Image on Hover */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
                                <Image 
                                    src={imageMap[service.link] || "/images/services/cardiology.png"} 
                                    alt={service.title} 
                                    fill 
                                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/60`}></div>
                            </div>

                            {/* Hover Glow */}
                            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${colorMap[service.color]} rounded-full blur-[80px] group-hover:blur-[100px] transition-all pointer-events-none -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40`} />

                            <div className={`w-14 h-14 ${iconBgMap[service.color]} rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                                <service.icon size={28} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">{service.title}</h3>
                            <p className="text-slate-400 leading-relaxed mb-8 text-lg font-medium group-hover:text-white/80 transition-colors">
                                {service.description}
                            </p>

                            <Link href={service.link} className={`inline-flex items-center text-base font-bold ${linkMap[service.color]} hover:underline underline-offset-8 decoration-2 transition-all`}>
                                Explore Center <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
