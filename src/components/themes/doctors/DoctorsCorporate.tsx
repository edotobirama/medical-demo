"use client";

import { motion } from "framer-motion";
import { doctorsData } from "./DoctorsData";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function DoctorsCorporate() {
    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-12 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Medical Staff</h2>
                        <p className="text-slate-500 mt-1">Board-certified physicians</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {doctorsData.map((doctor, index) => (
                        <div key={index} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="relative h-64 w-full bg-slate-100">
                                <Image
                                    src={doctor.image}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover object-top"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase mb-2">
                                    <ShieldCheck size={12} /> Certified
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">{doctor.name}</h3>
                                <p className="text-slate-500 text-sm mb-4">{doctor.specialty}</p>
                                <button className="w-full py-2 bg-slate-100 text-slate-700 font-semibold rounded hover:bg-blue-600 hover:text-white transition-colors text-sm">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
