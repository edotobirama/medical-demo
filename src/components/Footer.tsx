import Link from "next/link";
import { Activity, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-card text-muted-foreground py-12 border-t border-border">
            <div className="container grid md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-2xl font-bold text-foreground font-heading">
                        <Activity className="text-primary" />
                        <span>Grandview Medical</span>
                    </div>
                    <p className="text-sm leading-relaxed font-body">
                        Leading the region in advanced medical care and compassionate patient support.
                    </p>
                </div>

                <div>
                    <h3 className="text-foreground font-semibold mb-4 text-lg font-heading">Quick Links</h3>
                    <ul className="space-y-2 text-sm font-body">
                        <li><Link href="/about" className="hover:text-primary transition">Our Departments</Link></li>
                        <li><Link href="/doctors" className="hover:text-primary transition">Find a Doctor</Link></li>
                        <li><Link href="/book" className="hover:text-primary transition">Book Appointment</Link></li>
                        <li><Link href="/patient" className="hover:text-primary transition">Patient Portal</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-foreground font-semibold mb-4 text-lg font-heading">Hospital</h3>
                    <ul className="space-y-2 text-sm font-body">
                        <li><Link href="#" className="hover:text-primary transition">Visiting Hours</Link></li>
                        <li><Link href="#" className="hover:text-primary transition">Insurance Info</Link></li>
                        <li><Link href="#" className="hover:text-primary transition">Parking & Maps</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-foreground font-semibold mb-4 text-lg font-heading">Emergency</h3>
                    <ul className="space-y-3 text-sm font-body">
                        <li className="flex items-center gap-3">
                            <MapPin size={18} className="text-primary" />
                            <span>1 Grandview Plaza, Metro City</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-primary" />
                            <span>Emergency: 911</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-primary" />
                            <span>Desks: +1 (555) 000-8888</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-primary" />
                            <span>contact@grandviewhealth.org</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-border text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Grandview Medical Center. All rights reserved.
            </div>
        </footer>
    );
}
