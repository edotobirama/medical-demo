"use client";

import { motion } from "framer-motion";
import { ChevronRight, BarChart3, Globe, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HeroCorporate() {
    return (
        <section className="relative min-h-[90vh] bg-slate-50 text-slate-900 font-sans border-b border-slate-200">
            <div className="container mx-auto px-6 h-full pt-16 lg:pt-24">

                <div className="flex flex-col items-start max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <span className="bg-blue-600/10 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold border border-blue-200">
                            Grandview Enterprise Solutions
                        </span>
                    </motion.div>

                    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                        Scalable Healthcare Infrastructure <br />
                        <span className="text-blue-600">For Modern Lives.</span>
                    </h1>

                    <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
                        Grandview Medical provides enterprise-grade diagnostic precision and secure patient management delivery. Optimized for efficiency and reliability.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-16">
                        <Link href="/book" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition-colors flex items-center gap-2">
                            Schedule Consultation <ChevronRight size={16} />
                        </Link>
                        <Link href="/about" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-md border border-slate-300 shadow-sm transition-colors">
                            View Documentation
                        </Link>
                    </div>
                </div>

                {/* Dashboard / Metrics Visualization */}
                <div className="w-full bg-white rounded-t-xl shadow-[0_-20px_60px_rgba(0,0,0,0.05)] border border-slate-200 overflow-hidden relative">
                    <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                            <div className="w-3 h-3 rounded-full bg-slate-300" />
                        </div>
                        <div className="flex-1 text-center text-xs font-mono text-slate-400">grandview-dashboard.sys</div>
                    </div>

                    <div className="p-8 grid md:grid-cols-3 gap-8">
                        <div className="p-6 border border-slate-100 rounded-lg bg-slate-50/50">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4"><BarChart3 size={20} /></div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">99.9%</div>
                            <div className="text-sm text-slate-500">Uptime Reliability</div>
                        </div>
                        <div className="p-6 border border-slate-100 rounded-lg bg-slate-50/50">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4"><Globe size={20} /></div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">Global</div>
                            <div className="text-sm text-slate-500">Network Coverage</div>
                        </div>
                        <div className="p-6 border border-slate-100 rounded-lg bg-slate-50/50">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4"><Shield size={20} /></div>
                            <div className="text-2xl font-bold text-slate-900 mb-1">Secure</div>
                            <div className="text-sm text-slate-500">HIPAA Compliant</div>
                        </div>
                    </div>

                    {/* Mock Graph */}
                    <div className="h-64 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-around px-8">
                            {[40, 60, 45, 80, 55, 90, 70, 85, 60, 95].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                    className="w-8 bg-blue-500/20 rounded-t-sm"
                                />
                            ))}
                        </div>
                        {/* Trend Line Overlay */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                            <motion.path
                                d="M0,200 L100,120 L200,150 L300,80 L400,130 L500,60 L600,100 L700,70 L800,120 L900,50 L1200,50"
                                fill="none"
                                stroke="#2563EB"
                                strokeWidth="3"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );
}
