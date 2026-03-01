"use client";

import { motion } from "framer-motion";

import { useTheme } from "@/context/ThemeContext";

export default function StatsSection({
    patientCount = "10k+",
    doctorCount = "50+",
    serviceCount = "25+",
    experience = "25+"
}: {
    patientCount?: string,
    doctorCount?: string,
    serviceCount?: string,
    experience?: string
}) {
    const { theme } = useTheme();
    const isMinimal = theme === 'minimal';
    const isModern = theme === 'modern';

    const stats = [
        { label: 'Registered Patients', val: patientCount },
        { label: 'Expert Doctors', val: doctorCount },
        { label: 'Medical Services', val: serviceCount },
        { label: 'Experience Years', val: experience }
    ];


    return (
        <div className="container mx-auto px-6 relative z-20">
            <div className={`
                bg-card rounded-lg p-8 mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-0 divide-y md:divide-y-0 md:divide-x divide-border border border-border bg-white dark:bg-slate-900
                ${isMinimal
                    ? 'mt-0 border-2 border-black rounded-none shadow-none divide-black'
                    : isModern ? 'shadow-xl mt-8 md:-mt-12' : 'shadow-xl mt-8 md:-mt-32'}
            `}>
                {stats.map((stat, i) => (
                    <div key={i} className="px-6 text-center">
                        <div className="text-3xl font-bold text-slate-900 dark:text-white font-heading">{stat.val}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
