"use client";

import { useTheme } from "@/context/ThemeContext";
import DoctorsModern from "./DoctorsModern";
import DoctorsClassic from "./DoctorsClassic";
import DoctorsMinimal from "./DoctorsMinimal";
import DoctorsPlayful from "./DoctorsPlayful";
import DoctorsCyberpunk from "./DoctorsCyberpunk";
import DoctorsNature from "./DoctorsNature";
import DoctorsCorporate from "./DoctorsCorporate";

export default function Doctors() {
    const { theme } = useTheme();

    switch (theme) {
        case "modern":
            return <DoctorsModern />;
        case "classic":
            return <DoctorsClassic />;
        case "minimal":
            return <DoctorsMinimal />;
        case "playful":
            return <DoctorsPlayful />;
        case "cyberpunk":
            return <DoctorsCyberpunk />;
        case "nature":
            return <DoctorsNature />;
        case "corporate":
            return <DoctorsCorporate />;
        default:
            return <DoctorsModern />;
    }
}
