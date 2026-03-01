import { HeartPulse, UserCheck, ShieldCheck, Clock, Microscope, Stethoscope } from "lucide-react";

export const servicesData = [
    {
        icon: HeartPulse,
        title: "Cardiology Center",
        description: "Advanced heart care with cutting-edge diagnostics and minimally invasive procedures.",
        link: "/services/cardiology"
    },
    {
        icon: Microscope,
        title: "Advanced Lab",
        description: "High-precision automated pathology for rapid and accurate test results.",
        link: "/services/laboratory"
    },
    {
        icon: UserCheck,
        title: "Expert Specialists",
        description: "Access to top-tier consultants across 25+ medical specialties.",
        link: "/doctors"
    },
    {
        icon: Clock,
        title: "24/7 Emergency",
        description: "Always-ready critical care unit with rapid response teams.",
        link: "/emergency"
    },
    {
        icon: Stethoscope,
        title: "Pediatrics",
        description: "Compassionate care for infants, children, and adolescents.",
        link: "/services/pediatrics"
    },
    {
        icon: ShieldCheck,
        title: "Preventive Care",
        description: "Comprehensive health screenings to catch issues before they start.",
        link: "/services/preventive"
    }
];
