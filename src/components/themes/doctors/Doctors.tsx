"use client";

import { useTheme } from "@/context/ThemeContext";
import DoctorsModern from "./DoctorsModern";
import DoctorsClassic from "./DoctorsClassic";
import DoctorsMinimal from "./DoctorsMinimal";
import DoctorsPlayful from "./DoctorsPlayful";
import DoctorsCyberpunk from "./DoctorsCyberpunk";
import DoctorsNature from "./DoctorsNature";
import DoctorsCorporate from "./DoctorsCorporate";

export default function Doctors({ doctors = [] }: { doctors?: any[] }) {
    const { theme } = useTheme();

    switch (theme) {
        case "modern":
            return <DoctorsModern doctors={doctors} />;
        case "classic":
            return <DoctorsClassic doctors={doctors} />;
        case "minimal":
            return <DoctorsMinimal doctors={doctors} />;
        case "playful":
            return <DoctorsPlayful doctors={doctors} />;
        case "cyberpunk":
            return <DoctorsCyberpunk doctors={doctors} />;
        case "nature":
            return <DoctorsNature doctors={doctors} />;
        case "corporate":
            return <DoctorsCorporate doctors={doctors} />;
        default:
            return <DoctorsModern doctors={doctors} />;
    }
}
