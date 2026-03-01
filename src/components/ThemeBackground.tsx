"use strict";
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeBackground() {
    const { theme } = useTheme();

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
            <AnimatePresence mode="wait">
                {theme === "modern" && <ModernBackground key="modern" />}
                {theme === "classic" && <ClassicBackground key="classic" />}
                {theme === "minimal" && <MinimalBackground key="minimal" />}
                {theme === "playful" && <PlayfulBackground key="playful" />}
            </AnimatePresence>
        </div>
    );
}

function ModernBackground() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-blue-50/50 dark:bg-zinc-900"
        >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-70" />
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{
                    x: [0, 50, 0],
                    scale: [1, 1.5, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5
                }}
                className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-[120px]"
            />
        </motion.div>
    );
}

function ClassicBackground() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-[#fdfbf7] dark:bg-[#0f172a]"
        >
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />

            {/* Elegant Gradient Strip */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#f8f5f0] to-transparent" />
        </motion.div>
    );
}

function MinimalBackground() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white dark:bg-black"
        >
            {/* Animated Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#00000008,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#ffffff08,transparent)]"
                />
            </div>

            {/* Scanning Line (Subtle) */}
            <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent"
            />
        </motion.div>
    );
}

function PlayfulBackground() {
    // Random shapes floating
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-fuchsia-50/30 dark:bg-purple-950/20"
        >
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 10, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[10%] w-24 h-24 rounded-2xl bg-violet-200/40 rotate-12 blur-xl"
            />

            <motion.div
                animate={{
                    y: [0, 30, 0],
                    rotate: [0, -20, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[40%] right-[20%] w-32 h-32 rounded-full bg-pink-200/40 blur-xl"
            />

            <motion.div
                animate={{
                    x: [0, 40, 0],
                    y: [0, 20, 0]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] left-[30%] w-40 h-40 rounded-full bg-orange-100/50 blur-xl"
            />
        </motion.div>
    );
}
