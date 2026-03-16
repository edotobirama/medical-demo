import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ShieldCheck, Clock, Star, ArrowRight, Info, Users, Hourglass } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 0; // Ensure fresh data on every request

export default async function DoctorsPage() {
    const doctors = await prisma.doctorProfile.findMany({
        where: { isAvailable: true },
        include: {
            user: true,
            slots: {
                where: { status: 'AVAILABLE', startTime: { gt: new Date() } },
                orderBy: { startTime: 'asc' },
                take: 1
            },
            waitlistEntries: {
                where: { status: 'WAITING' }
            }
        }
    });

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Ultra-Premium Hero Section */}
            <section className="relative h-[80vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/specialists_premium.png" 
                        alt="Expert Specialists" 
                        className="w-full h-full object-cover scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/20">
                                <Users size={32} className="text-white" />
                            </div>
                            <div className="h-px w-12 bg-blue-600/50"></div>
                            <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">World-Class Clinical Faculty</p>
                        </div>
                        
                        <h1 className="text-7xl lg:text-9xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.85]">
                            Expert <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Authority.</span>
                        </h1>
                        
                        <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-xl font-medium">
                            Access the industry&#39;s most respected medical minds. Our specialists are pioneers in their fields, dedicated to solving your most complex health challenges.
                        </p>
                        
                        <div className="flex flex-wrap gap-8 items-center">
                            <Link href="/book" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center gap-3 uppercase tracking-wider text-sm">
                                Book Consult <ArrowRight size={20} strokeWidth={3} />
                            </Link>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                                <ShieldCheck className="text-blue-500" size={24} />
                                <span className="font-bold text-sm tracking-widest uppercase">BOARD CERTIFIED FACULTY</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Our Team</p>
                    <div className="w-px h-12 bg-gradient-to-b from-blue-600 to-transparent"></div>
                </div>
            </section>

            <section className="container mx-auto px-6 py-32 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
                    <div className="max-w-2xl">
                        <h2 className="text-5xl lg:text-6xl font-black text-white mb-8 uppercase tracking-tighter">Clinical LEADERSHIP</h2>
                        <p className="text-slate-400 text-xl font-medium leading-relaxed">Discover the specialists who are redefining healthcare outcomes through innovation and empathy.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {doctors.map((doctor) => {
                        const nextSlot = doctor.slots[0];
                        const waitlistCount = doctor.waitlistEntries.length;

                        return (
                            <div key={doctor.id} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all duration-500 shadow-2xl flex flex-col">
                                {/* Doctor Image / Header */}
                                <div className="h-72 relative overflow-hidden">
                                    <img 
                                        src={doctor.user.image || "/images/doctors/default.png"} 
                                        alt={doctor.user.name || "Doctor"} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                                    
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
                                            {doctor.specialty}
                                        </div>
                                        {waitlistCount > 0 && (
                                            <div className="px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg">
                                                {waitlistCount} in Queue
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-10 flex-1 flex flex-col">
                                    <div className="mb-8">
                                        <h3 className="text-3xl font-black text-white tracking-tighter mb-2 group-hover:text-blue-400 transition-colors uppercase">{doctor.user.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm tracking-wide">
                                            <Star size={16} className="text-blue-500 fill-blue-500" />
                                            <span>4.9/5 Clinical Rating</span>
                                            <span className="mx-2 opacity-30">•</span>
                                            <span>{doctor.experienceYears} Years Exp.</span>
                                        </div>
                                    </div>

                                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 opacity-80 line-clamp-3">
                                        {doctor.bio || "Specialized in advanced clinical procedures and patient-centered treatment plans at Grandview Medical Center."}
                                    </p>

                                    {/* Availability / Actions */}
                                    <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
                                        {nextSlot ? (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-widest">
                                                    <Clock size={16} />
                                                    Next: {format(new Date(nextSlot.startTime), 'MMM d, h:mm a')}
                                                </div>
                                                <Link href={`/book?doctor=${doctor.id}`} className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all">
                                                    <ArrowRight size={20} strokeWidth={3} />
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-amber-500 font-black text-xs uppercase tracking-widest">
                                                    <Hourglass size={16} />
                                                    Priority Waitlist Only
                                                </div>
                                                <Link href={`/book?doctor=${doctor.id}`} className="p-3 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all">
                                                    <ArrowRight size={20} strokeWidth={3} />
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
