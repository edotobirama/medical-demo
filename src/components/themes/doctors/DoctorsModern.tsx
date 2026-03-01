"use client";

import { motion } from "framer-motion";
import { doctorsData } from "./DoctorsData";
import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, Calendar } from "lucide-react";

export default function DoctorsModern() {
    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm">World Class Care</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mt-2">Meet Our Specialists</h2>
                    </div>
                    <Link href="/doctors" className="hidden md:flex items-center gap-2 text-white hover:text-blue-400 transition-colors group">
                        View All Doctors <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctorsData.map((doctor, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-4">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                <div className="absolute bottom-0 left-0 p-6 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <h3 className="text-xl font-bold text-white mb-1">{doctor.name}</h3>
                                        <p className="text-blue-300 font-medium text-sm mb-3">{doctor.specialty}</p>
                                        <div className="flex items-center gap-2 text-xs text-white/80">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            {doctor.rating} ({doctor.reviews} reviews)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
