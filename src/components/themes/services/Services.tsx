"use client";

import { useTheme } from "@/context/ThemeContext";
import ServicesModern from "./ServicesModern";
import ServicesClassic from "./ServicesClassic";
import ServicesMinimal from "./ServicesMinimal";
import ServicesPlayful from "./ServicesPlayful";
import ServicesCyberpunk from "./ServicesCyberpunk";
import ServicesNature from "./ServicesNature";
import ServicesCorporate from "./ServicesCorporate";

export default function Services() {
    const { theme } = useTheme();

    switch (theme) {
        case "modern":
            return <ServicesModern />;
        case "classic":
            return <ServicesClassic />;
        case "minimal":
            return <ServicesMinimal />;
        case "playful":
            return <ServicesPlayful />;
        case "cyberpunk":
            return <ServicesCyberpunk />;
        case "nature":
            return <ServicesNature />;
        case "corporate":
            return <ServicesCorporate />;
        default:
            return <ServicesModern />;
    }
}
