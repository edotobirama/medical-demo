"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function DoctorsPlayful({ doctors = [] }: { doctors?: any[] }) {
    if (!doctors || doctors.length === 0) return null;
    return (
        <section className="py-24 bg-transparent font-heading">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-black text-center mb-16 text-slate-800">
                    Friendly Faces <span className="text-pink-500">Ready to Help!</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor, index) => (
                        <div key={index} className="text-center group">
                            <div className="relative w-48 h-48 mx-auto mb-6">
                                <div className="absolute inset-0 bg-violet-200 rounded-full animate-pulse-slow" style={{ animationDelay: `${index * 0.5}s` }} />
                                <div className="absolute inset-2 overflow-hidden rounded-full border-4 border-white shadow-lg">
                                    <Image
                                        src={doctor.image}
                                        alt={doctor.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md text-2xl">
                                    👋
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 group-hover:text-violet-600 transition-colors">
                                {doctor.name}
                            </h3>
                            <p className="text-slate-500 font-medium">{doctor.specialty || doctor.doctorProfile?.specialization}</p>
                            <Link href={`/doctors/${doctor.id}`} className="inline-block mt-4 px-6 py-2 bg-violet-100 text-violet-600 rounded-full font-bold hover:bg-violet-500 hover:text-white transition-all transform hover:scale-105 active:scale-95">
                                View Profile
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
