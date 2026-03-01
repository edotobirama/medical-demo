"use strict";
"use client";

import React from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ThemeBackground from "@/components/ThemeBackground";

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ThemeBackground />
            {children}
            <ThemeSwitcher />
        </ThemeProvider>
    );
}
