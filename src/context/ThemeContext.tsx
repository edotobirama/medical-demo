"use strict";
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "modern" | "classic" | "minimal" | "playful" | "cyberpunk" | "nature" | "corporate";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("modern");

    useEffect(() => {
        // Load saved theme
        const savedTheme = localStorage.getItem("app-theme") as Theme;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        // Apply theme class to document body
        const root = document.body;

        // Remove all known theme classes
        root.classList.remove(
            "theme-modern", "theme-classic", "theme-minimal", "theme-playful",
            "theme-cyberpunk", "theme-nature", "theme-corporate"
        );

        // Add current theme class
        root.classList.add(`theme-${theme}`);

        // Save to local storage
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
