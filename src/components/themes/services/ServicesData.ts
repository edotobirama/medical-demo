import { HeartPulse, UserCheck, ShieldCheck, Clock, Microscope, Stethoscope } from "lucide-react";

export const servicesData = [
    {
        icon: HeartPulse,
        title: "Cardiology Center",
        description: "World-class cardiac care featuring groundbreaking diagnostic precision and minimally invasive life-saving procedures.",
        link: "/cardiology",
        color: "red"
    },
    {
        icon: Microscope,
        title: "Advanced Lab",
        description: "Next-generation automated pathology delivering rapid, surgical-grade accuracy for every medical test.",
        link: "/laboratory",
        color: "purple"
    },
    {
        icon: UserCheck,
        title: "Expert Specialists",
        description: "Direct access to an elite network of board-certified consultants across every major medical field.",
        link: "/doctors",
        color: "blue"
    },
    {
        icon: Clock,
        title: "24/7 Emergency",
        description: "Immediate critical care response with Level-1 trauma capabilities and dedicated emergency surgical teams.",
        link: "/emergency",
        color: "orange"
    },
    {
        icon: Stethoscope,
        title: "Pediatrics",
        description: "Compassionate, high-tech healthcare designed exclusively for the unique needs of children and adolescents.",
        link: "/pediatrics",
        color: "sky"
    },
    {
        icon: ShieldCheck,
        title: "Preventive Care",
        description: "Data-driven health screenings and wellness mapping designed to extend your biological vitality and healthspan.",
        link: "/preventive",
        color: "emerald"
    }
];
