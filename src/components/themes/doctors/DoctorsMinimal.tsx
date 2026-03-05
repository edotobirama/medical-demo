"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";

export default function DoctorsMinimal({ doctors = [] }: { doctors?: any[] }) {
    if (!doctors || doctors.length === 0) return null;
    return (
        <section className="bg-white text-black font-mono border-t-4 border-black pb-32 relative z-10">
            <div className="max-w-[1920px] mx-auto border-b-4 border-black bg-black">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 bg-black gap-[4px] border-l-4 border-black overflow-hidden">
                    {doctors.map((doctor, index) => (
                        <div
                            key={index}
                            className="bg-white relative group flex flex-col"
                        >
                            <div className="aspect-[4/5] relative grayscale border-b-4 border-black overflow-hidden">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                                <div className="absolute top-4 left-4 bg-black text-white px-3 py-1 text-xs font-bold w-fit z-10">
                                    ID: {doctor.doctorProfile?.licenseNumber || doctor.id.toString().substring(0, 6)}
                                </div>
                            </div>
                            <div className="p-6 bg-yellow-300 group-hover:bg-black group-hover:text-white transition-colors flex-grow flex flex-col justify-between min-h-[180px]">
                                <div>
                                    <h3 className="text-xl font-bold uppercase mb-1">{doctor.name}</h3>
                                    <p className="text-sm opacity-80 mb-4">{doctor.specialty || doctor.doctorProfile?.specialization}</p>
                                </div>
                                <Link href={`/doctors/${doctor.id}`} className="w-full text-center block border-2 border-black group-hover:border-white py-3 font-bold uppercase hover:bg-white hover:text-black transition-colors md:mt-4">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
