"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";

const colors = [
    "bg-red-100 text-red-600",
    "bg-orange-100 text-orange-600",
    "bg-yellow-100 text-yellow-600",
    "bg-green-100 text-green-600",
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
];

export default function ServicesPlayful() {
    return (
        <section className="py-24 bg-transparent font-heading">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="bg-white text-violet-500 px-6 py-2 rounded-full text-sm font-bold shadow-sm inline-block mb-4">
                        We Care About You! 💖
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-800">
                        Top-Notch <span className="text-violet-500">Services</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 1 : -1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-8 rounded-[40px] ${colors[index % colors.length]} shadow-sm border-4 border-white h-full`}
                        >
                            <div className="bg-white/60 w-16 h-16 rounded-3xl flex items-center justify-center mb-6 text-current shadow-sm">
                                <service.icon size={32} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-2xl font-black mb-3 text-slate-900/80">
                                {service.title}
                            </h3>

                            <p className="font-medium opacity-80 leading-snug">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
