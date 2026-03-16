'use client';

import { MapPin, Car, Info, Navigation, ArrowRight, ShieldCheck } from "lucide-react";

export default function ParkingPage() {
    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-indigo-500/30">
            {/* Header Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
                
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-8">
                        <Navigation size={16} className="text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Seamless Arrival</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 leading-tight text-white">
                        Navigate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">The Campus</span>
                    </h1>
                    <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        Grandview Medical Center offers premium parking facilities and valet services designed to make your arrival stress-free.
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 pb-40">
                {/* Visual Map/Hero */}
                <div className="relative rounded-[4rem] overflow-hidden group border border-white/5 shadow-3xl bg-slate-900 mb-24">
                    <img 
                        src="/images/campus-map.png" 
                        alt="Campus Map" 
                        className="w-full h-[500px] object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3000ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                    <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">Centralized Access</h2>
                            <p className="text-slate-300 font-medium">Follow digital signage for the North and South parking structures. Direct indoor walkways lead to the Main Surgical Complex and Pediatric Center.</p>
                        </div>
                        <button className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all flex items-center gap-2 uppercase tracking-widest text-xs whitespace-nowrap shadow-xl">
                            Open In Maps <Navigation size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Valet Parking */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] hover:border-indigo-500/50 transition-all duration-500">
                        <div className="w-20 h-20 bg-indigo-600/10 rounded-2xl flex items-center justify-center mb-10 border border-indigo-600/20">
                            <Car size={36} className="text-indigo-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Valet Service</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-6">Available at the Main Entrance 24/7. Complimentary for patients with limited mobility.</p>
                        <div className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl inline-block text-[10px] font-black tracking-widest uppercase">Premium Option</div>
                    </div>

                    {/* Self Parking */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] hover:border-blue-500/50 transition-all duration-500">
                        <div className="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mb-10 border border-blue-600/20">
                            <MapPin size={36} className="text-blue-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">Self Parking</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-6">Over 2,500 slots available in Structure A and B. First 2 hours are complimentary for all visitors.</p>
                        <div className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl inline-block text-[10px] font-black tracking-widest uppercase">General Access</div>
                    </div>

                    {/* Security */}
                    <div className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] hover:border-emerald-500/50 transition-all duration-500 md:col-span-2 lg:col-span-1">
                        <div className="w-20 h-20 bg-emerald-600/10 rounded-2xl flex items-center justify-center mb-10 border border-emerald-600/20">
                            <ShieldCheck size={36} className="text-emerald-400" />
                        </div>
                        <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter">24/7 Security</h3>
                        <p className="text-slate-400 font-medium leading-relaxed mb-6">Our security teams patrol the parking decks hourly. Well-lit walkways and emergency help-points are located at every exit.</p>
                        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl inline-block text-[10px] font-black tracking-widest uppercase">Patient Safety</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
