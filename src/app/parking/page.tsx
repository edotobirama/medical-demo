import { MapPin, Car, Info, Navigation } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ParkingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar transparent={false} />
            <div className="flex-1 container mx-auto px-6 py-24 max-w-4xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-heading">Parking & Campus Map</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        We provide convenient, secure parking facilities directly attached to our main clinical buildings.
                    </p>
                </div>

                {/* Campus Map Visualization */}
                <div className="mb-16 relative rounded-3xl overflow-hidden shadow-2xl border border-border group">
                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                    <Image
                        src="/images/campus-map.png"
                        alt="3D Illustration of Grandview Medical Center Campus"
                        width={1200}
                        height={600}
                        className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        priority
                    />
                    <div className="absolute bottom-6 left-6 bg-background/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-border/50 z-20 max-w-sm">
                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                            <Navigation size={18} /> Campus Layout
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Explore the layout of our clinical buildings, emergency entrances, and dedicated visitor parking zones above.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                        <Car className="text-blue-500 w-8 h-8 mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-3">Visitor Parking Garage</h2>
                        <ul className="space-y-3 text-muted-foreground">
                            <li className="flex justify-between border-b pb-2">
                                <span>First Hour</span>
                                <span className="font-semibold text-foreground">Free</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span>1 - 4 Hours</span>
                                <span className="font-semibold text-foreground">$5.00</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span>Daily Maximum</span>
                                <span className="font-semibold text-foreground">$15.00</span>
                            </li>
                        </ul>
                        <p className="text-sm mt-4 text-muted-foreground italic">
                            Located at the West Entrance off Grandview Blvd.
                        </p>
                    </div>

                    <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                        <MapPin className="text-emerald-500 w-8 h-8 mb-4" />
                        <h2 className="text-xl font-bold text-foreground mb-3">Valet Services</h2>
                        <p className="text-muted-foreground mb-4">
                            Complementary valet services are available exclusively for disabled patients or those arriving at the Emergency Department. Standard valet is available at the Main Entrance.
                        </p>
                        <div className="bg-secondary p-4 rounded-xl border border-border flex justify-between items-center">
                            <span className="font-semibold text-muted-foreground">Standard Valet Fee</span>
                            <span className="font-bold text-emerald-600 text-lg">$20.00</span>
                        </div>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl flex gap-4 items-start">
                    <Info className="text-amber-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-amber-900 mb-2">Campus Navigation Support</h3>
                        <p className="text-amber-800 text-sm leading-relaxed">
                            Need help finding your department? Our volunteer "Red Coat" ambassadors are stationed at every entrance and parking elevator bay to guide you exactly where you need to be. Wheelchairs are available upon request.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
