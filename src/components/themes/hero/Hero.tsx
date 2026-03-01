"use client";

import { useTheme } from "@/context/ThemeContext";
import HeroModern from "./HeroModern";
import HeroClassic from "./HeroClassic";
import HeroMinimal from "./HeroMinimal";
import HeroCyberpunk from "./HeroCyberpunk";
import HeroNature from "./HeroNature";
import HeroCorporate from "./HeroCorporate";
import HeroPlayful from "./HeroPlayful";

export default function Hero() {
    const { theme } = useTheme();

    switch (theme) {
        case "modern":
            return <HeroModern />;
        case "classic":
            return <HeroClassic />;
        case "minimal":
            return <HeroMinimal />;
        case "playful":
            return <HeroPlayful />;
        case "cyberpunk":
            return <HeroCyberpunk />;
        case "nature":
            return <HeroNature />;
        case "corporate":
            return <HeroCorporate />;
        default:
            return <HeroModern />;
    }
}
