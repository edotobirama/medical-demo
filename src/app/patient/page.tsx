'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
    Calendar, 
    Clock, 
    User as UserIcon, 
    Activity, 
    LogOut, 
    Plus, 
    MessageCircle, 
    FileText, 
    AlertTriangle, 
    MapPin, 
    Video, 
    ArrowRight, 
    CheckCircle,
    ChevronRight,
    Search,
    Bell,
    Settings,
    Shield,
    CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import PatientRefundReschedule from '@/components/PatientRefundReschedule';
import PatientRescheduleButton from '@/components/PatientRescheduleButton';
import CancelAppointmentButton from '@/components/CancelAppointmentButton';

export default function PatientDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/login');
        } else if (status === 'authenticated') {
            fetch('/api/patient/dashboard')
                .then(res => res.json())
                .then(data => {
                    setUserData(data);
                    setLoading(false);
                });
        }
    }, [status, router]);

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <p className="mt-6 text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Health Vault...</p>
            </div>
        );
    }

    const { user, appointments } = userData;
    const upcomingAppointments = appointments.filter((app: any) => 
        (app.status === 'CONFIRMED' || app.status === 'RESCHEDULED') && 
        new Date(app.requestedTime) >= new Date()
    );

    const actionableAppointments = appointments.filter((app: any) => 
        ['CANCELLED', 'REJECTED', 'REFUND_PENDING'].includes(app.status)
    );

    const activeWaitlistAppt = appointments.find((app: any) => 
        app.status === 'WAITING'
    );

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-emerald-500/30 pb-20 overflow-x-hidden">
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Dashboard Header */}
            <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-2xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="relative group cursor-pointer">
                            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20 transition-all group-hover:scale-105 active:scale-95">
                                {user.name?.[0] || <UserIcon size={24} />}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Health Center</h1>
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-black tracking-widest uppercase rounded border border-emerald-500/20">ELITE STATUS</span>
                            </div>
                            <p className="text-slate-400 font-medium text-sm mt-1">Status: <span className="text-emerald-400 font-bold">Synchronized</span></p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/book" className="flex items-center gap-3 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-2xl shadow-emerald-500/20 transition-all active:scale-[0.97] uppercase tracking-widest text-[11px]">
                            <Plus size={18} strokeWidth={3} />
                            New Consult
                        </Link>
                        <form action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/login' });
                        }}>
                            <button className="p-3.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all group">
                                <LogOut size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 grid lg:grid-cols-12 gap-10">
                
                {/* 1. Left Sidebar: Stats & Quick Actions */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Clinical Summary</h4>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="text-emerald-500" size={18} />
                                    <span className="text-sm font-bold text-slate-300">Identity</span>
                                </div>
                                <span className="text-xs font-black uppercase text-white">Verified</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-blue-500" size={18} />
                                    <span className="text-sm font-bold text-slate-300">Next Visit</span>
                                </div>
                                <span className="text-xs font-black uppercase text-white">{upcomingAppointments[0] ? format(new Date(upcomingAppointments[0].requestedTime), 'MMM d') : 'None'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Activity className="text-purple-500" size={18} />
                                    <span className="text-sm font-bold text-slate-300">Vitality</span>
                                    </div>
                                <span className="text-xs font-black uppercase text-white">Optimal</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        <Link href="/messages" className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-emerald-500/50 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                                    <MessageCircle size={20} />
                                </div>
                                <span className="font-bold text-sm">Secure Inbox</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link href="/insurance" className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-blue-500/50 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                    <CreditCard size={20} />
                                </div>
                                <span className="font-bold text-sm">Insurance</span>
                            </div>
                            <ChevronRight size={18} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* 2. Middle Content: Waitlist & Upcoming */}
                <div className="lg:col-span-9 space-y-10">
                    
                    {/* Active Queue Tracking */}
                    {activeWaitlistAppt ? (
                        <div className="relative group rounded-[3rem] p-12 overflow-hidden border border-emerald-500/30 shadow-3xl bg-gradient-to-br from-emerald-500/10 to-teal-950/20 backdrop-blur-3xl">
                            <div className="absolute top-0 right-0 p-16 opacity-5 translate-x-1/2 -translate-y-1/2 rotate-12">
                                <Clock size={400} strokeWidth={1} />
                            </div>
                            
                            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                                        <h3 className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px]">Real-Time Priority Queue</h3>
                                    </div>
                                    <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.85] mb-6">Position <br /><span className="text-emerald-400">#{activeWaitlistAppt.bookingNumber}</span></h2>
                                    <p className="text-slate-400 font-medium leading-relaxed mb-8">Our specialists are preparing for your consultation. Please remain available via secure message.</p>
                                    
                                    <div className="flex items-center gap-4">
                                        <img src={activeWaitlistAppt.doctor.user.image} className="w-12 h-12 rounded-xl object-cover grayscale border border-white/10" alt="Doctor" />
                                        <div>
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Consulting Physician</p>
                                            <p className="font-bold text-white uppercase">{activeWaitlistAppt.doctor.user.name}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 bg-black/40 p-8 rounded-[2rem] border border-white/5">
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Wait Time</span>
                                        <span className="text-white font-black">~15 Minutes</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Entry</span>
                                        <span className="text-white font-black">{format(new Date(activeWaitlistAppt.createdAt), 'h:mm a')}</span>
                                    </div>
                                    <div className="pt-4 border-t border-white/5">
                                         <Link href={`/video/${activeWaitlistAppt.id}`} className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-[11px]">
                                            Entry Waiting Room <ArrowRight size={16} />
                                         </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 group overflow-hidden relative border-dashed">
                             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">Intake System</h3>
                                    <p className="text-slate-400 font-medium mt-1">You are not currently in any priority queues.</p>
                                </div>
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-700 border border-white/5 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-all duration-500">
                                    <Clock size={32} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Grid */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                                <Calendar size={20} className="text-blue-500" /> Upcoming Visits
                            </h3>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="grid gap-6">
                                {upcomingAppointments.map((app: any) => (
                                    <div key={app.id} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] hover:border-blue-500/50 transition-all duration-500 overflow-hidden shadow-2xl">
                                        <div className="absolute right-0 top-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity translate-x-1/2 -translate-y-1/2">
                                            {app.type === 'ONLINE' ? <Video size={160} /> : <MapPin size={160} />}
                                        </div>
                                        
                                        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                                            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-500 ${app.type === 'ONLINE' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white'}`}>
                                                {app.type === 'ONLINE' ? <Video size={32} /> : <MapPin size={32} />}
                                            </div>
                                            
                                            <div className="flex-1 text-center md:text-left">
                                                <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                                    <h4 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{app.doctor.user.name}</h4>
                                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black tracking-widest uppercase rounded border border-blue-500/20">CONFIRMED</span>
                                                </div>
                                                <p className="text-slate-400 font-bold text-sm tracking-wide uppercase mb-4">{app.doctor.specialty} • #{app.bookingNumber}</p>
                                                
                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-black uppercase text-slate-300">
                                                        <Calendar size={14} className="text-blue-500" />
                                                        {format(new Date(app.requestedTime), 'MMMM d, yyyy')}
                                                    </div>
                                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-xs font-black uppercase text-slate-300">
                                                        <Clock size={14} className="text-blue-500" />
                                                        {format(new Date(app.requestedTime), 'h:mm a')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-3 min-w-[180px]">
                                                {app.type === 'ONLINE' ? (
                                                     <Link href={`/video/${app.id}`} className="w-full text-center py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                                                        Start Session
                                                     </Link>
                                                ) : (
                                                    <Link href="/parking" className="w-full text-center py-4 bg-white text-slate-950 font-black rounded-2xl hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                                                        Get Directions
                                                     </Link>
                                                )}
                                                <Link href={`/inbox/${app.doctor.userId}`} className="w-full text-center py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-[10px] uppercase tracking-[0.2em]">
                                                    Secure Message
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 rounded-[3rem] p-20 border border-white/5 text-center flex flex-col items-center">
                                <Calendar size={60} className="text-slate-800 mb-8" />
                                <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">No Upcoming Visits</h4>
                                <p className="text-slate-500 font-medium max-w-sm">When you schedule consultations, they will appear here as premium high-priority slots.</p>
                                <Link href="/book" className="mt-10 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-[0.2em]">
                                    Schedule Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
