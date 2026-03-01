"use strict";
"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Palette, ChevronUp, ChevronDown, Check } from "lucide-react";

const themes = [
    { id: "modern", name: "Modern", color: "bg-blue-500" },
    { id: "classic", name: "Classic", color: "bg-[#1e293b]" }, // Navy
    { id: "minimal", name: "Minimal", color: "bg-black" },
    { id: "playful", name: "Playful", color: "bg-violet-500" },
    { id: "cyberpunk", name: "Cyber", color: "bg-[#00f3ff]" },
    { id: "nature", name: "Nature", color: "bg-[#4A5D45]" },
    { id: "corporate", name: "Corp", color: "bg-blue-800" },
] as const;

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
            {isOpen && (
                <div className="mb-4 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[200px] animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="p-3 bg-secondary/50 border-b border-border">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-heading">Select Theme</h3>
                    </div>
                    <div className="p-2 space-y-1">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all font-body ${theme === t.id
                                    ? "bg-secondary text-secondary-foreground"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full ${t.color} border border-border`} />
                                    {t.name}
                                </div>
                                {theme === t.id && <Check className="w-4 h-4 text-primary" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-12 w-12 bg-card text-foreground rounded-full shadow-xl border border-border flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200 group"
            >
                <Palette className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </button>
        </div>
    );
}
