"use client";

import { motion } from "framer-motion";
import { servicesData } from "./ServicesData";

export default function ServicesCorporate() {
    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6">
                <div className="mb-12 border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Capabilities & Infrastructure
                    </h2>
                    <p className="text-slate-500 mt-2">
                        Comprehensive medical solutions for enterprise-grade healthcare needs.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {servicesData.map((service, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow hover:border-blue-200 group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2 bg-slate-100 rounded-md text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                    <service.icon size={24} />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                                        {service.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
