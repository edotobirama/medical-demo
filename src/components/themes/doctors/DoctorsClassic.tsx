"use client";

import { motion } from "framer-motion";
import { doctorsData } from "./DoctorsData";
import Link from "next/link";
import Image from "next/image";

export default function DoctorsClassic() {
    return (
        <section className="py-32 bg-white text-black font-serif">
            <div className="container mx-auto px-12">
                <h2 className="text-6xl text-center mb-24 italic">The Medical Board</h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                    {doctorsData.map((doctor, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative h-[450px] w-full mb-6 overflow-hidden">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-normal mb-1">{doctor.name}</h3>
                                <p className="text-sm font-sans text-gray-500 tracking-widest uppercase">{doctor.specialty}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-20">
                    <Link href="/doctors" className="inline-block border-b border-black pb-1 hover:border-gray-400 transition-colors font-sans text-sm tracking-widest uppercase">
                        View Full Directory
                    </Link>
                </div>
            </div>
        </section>
    );
}
