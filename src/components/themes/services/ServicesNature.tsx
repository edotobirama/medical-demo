"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";
import { Flower } from "lucide-react";

export default function ServicesNature() {
    return (
        <section className="py-24 bg-[#F1F0E8] text-[#2C362B] font-sans">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <Flower className="mx-auto mb-4 text-[#6B8E23]" />
                    <h2 className="text-4xl font-serif italic text-[#3A4A36]">
                        Holistic Offerings
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className="bg-[#E5E9DF] p-8 rounded-tr-[50px] rounded-bl-[50px] hover:bg-[#D4E09B] transition-colors duration-500 group shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-[#F1F0E8] rounded-full flex items-center justify-center mb-6 text-[#4A5D45] group-hover:text-[#2C362B] group-hover:bg-white transition-colors">
                                <service.icon size={24} />
                            </div>

                            <h3 className="text-2xl font-serif text-[#2C362B] mb-3">
                                {service.title}
                            </h3>

                            <p className="text-[#5C635A] text-lg leading-relaxed group-hover:text-[#3A4A36]">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
