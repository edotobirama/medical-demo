"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function DoctorsNature({ doctors = [] }: { doctors?: any[] }) {
    if (!doctors || doctors.length === 0) return null;
    return (
        <section className="py-24 bg-[#F1F0E8] text-[#2C362B]">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-serif text-center mb-16 text-[#3A4A36]">
                    Our Healers
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {doctors.map((doctor, index) => (
                        <Link href={`/doctors/${doctor.id}`} key={index} className="block group text-center cursor-pointer">
                            <div className="relative h-[350px] w-full rounded-t-[100px] rounded-b-[20px] overflow-hidden mb-6 shadow-md border-[6px] border-[#E5E9DF] group-hover:border-[#D4E09B] transition-colors">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-serif font-bold text-[#2C362B] mb-1">{doctor.name}</h3>
                            <p className="text-[#6B8E23] font-medium">{doctor.specialty || doctor.doctorProfile?.specialization}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
