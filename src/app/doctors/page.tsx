import Navbar from '@/components/Navbar';
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
        <div className="min-h-screen bg-background font-sans text-foreground pb-20">
            <Navbar />

            {/* Spacer for fixed Navbar */}
            <div className="h-24"></div>

            {/* Premium Hero */}
            <section className="relative h-[60vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/services/specialists_premium.png" 
                        alt="Expert Specialists" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10"></div>
                </div>

                <div className="container mx-auto px-6 relative z-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-primary/15 backdrop-blur-md rounded-2xl flex items-center justify-center border border-primary/20">
                                <Users size={32} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary uppercase tracking-widest">Elite Medical Team</p>
                                <h1 className="text-5xl lg:text-7xl font-bold text-foreground tracking-tight">Expert <span className="text-primary">Specialists</span></h1>
                            </div>
                        </div>
                        <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                            Connect with the world's leading medical minds. Our specialists are pioneers in their fields, dedicated to providing personalized, evidence-based care for every patient.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="px-5 py-2.5 bg-card/50 backdrop-blur-md border border-border rounded-xl flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="font-bold text-foreground">Board Certified</span>
                            </div>
                            <div className="px-5 py-2.5 bg-card/50 backdrop-blur-md border border-border rounded-xl flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                <span className="font-bold text-foreground">Top Rated</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Header / Filter Bar - Adjusted */}
            <div className="bg-card shadow-sm border-b border-border sticky top-0 z-30 backdrop-blur-md bg-card/80">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground font-heading">Find Your Specialist</h2>
                            <p className="text-muted-foreground mt-1 font-body">Showing {doctors.length} verified medical experts available now.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Potential filters could go here */}
                            <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg text-sm font-bold flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Live Availability
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Doctor Grid */}
            <div className="container mx-auto px-6 py-12">
                {doctors.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-muted-foreground font-heading">No doctors found.</h3>
                        <p className="text-muted-foreground font-body">Please seed the database.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {doctors.map((doc) => {
                            // Parse JSON fields
                            const achievements = doc.achievements ? JSON.parse(doc.achievements) : [];

                            // Calculate Waitlist Info
                            const waitlistCount = doc.waitlistEntries.length;
                            const estWaitTime = waitlistCount * 15; // 15 mins per patient
                            const nextSlot = doc.slots[0];

                            return (
                                <div key={doc.id} className="bg-card rounded-lg border border-border shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col overflow-hidden">

                                    {/* Card Header (Avatar + Status) */}
                                    <div className="relative h-48 bg-muted">
                                        {/* Image */}
                                        {doc.user.image ? (
                                            <img
                                                src={doc.user.image}
                                                alt={doc.user.name || 'Doctor'}
                                                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                                No Image
                                            </div>
                                        )}

                                        {/* Rating Badge */}
                                        <div className="absolute bottom-3 left-4 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 text-sm font-bold text-foreground border border-border">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                            {doc.rating.toFixed(1)}
                                            <span className="text-muted-foreground font-medium text-xs">({doc.reviews})</span>
                                        </div>
                                    </div>

                                    <div className="p-6 pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition font-heading">{doc.user.name}</h3>
                                                <div className="text-sm font-medium text-primary mt-0.5 font-body">{doc.specialization}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-foreground">${Number(doc.consultationFee)}</div>
                                                <div className="text-xs text-muted-foreground">Consultation</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3 border-b border-border pb-4 font-body">
                                            <span>{doc.department}</span>
                                        </div>
                                    </div>
                                    {/* Body */}
                                    <div className="p-6 space-y-4 flex-grow">
                                        {/* Achievements */}
                                        <div className="flex flex-wrap gap-2">
                                            {achievements.slice(0, 2).map((a: string, i: number) => (
                                                <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
                                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                                    {a}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Waitlist Info */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 text-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide mb-1">
                                                    <Users className="w-3 h-3" />
                                                    Waitlist
                                                </div>
                                                <div className="text-lg font-bold text-orange-900 dark:text-orange-100">{waitlistCount}</div>
                                                <div className="text-[10px] text-orange-600/80 dark:text-orange-400/80 font-medium mt-0.5">Patients Ahead</div>
                                            </div>

                                            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 text-center">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
                                                    <Hourglass className="w-3 h-3" />
                                                    Est. Wait
                                                </div>
                                                <div className="text-lg font-bold text-blue-900 dark:text-blue-100">{estWaitTime}<span className="text-sm font-medium text-blue-600 dark:text-blue-400 ml-0.5">m</span></div>
                                                <div className="text-[10px] text-blue-600/80 dark:text-blue-400/80 font-medium mt-0.5">Approx. Time</div>
                                            </div>
                                        </div>

                                        {/* Availability Badge */}
                                        <div className={`rounded-lg p-4 border ${nextSlot ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800' : 'bg-muted/50 border-border'}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Slot</span>
                                                {nextSlot ? (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-background px-2 py-1 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-900">
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        AVAILABLE
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md shadow-sm border border-border">
                                                        FULL
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`text-lg font-bold ${nextSlot ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                {nextSlot ? format(new Date(nextSlot.startTime), 'EEE, h:mm a') : 'No slots available'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 bg-muted/30 border-t border-border grid grid-cols-2 gap-3">
                                        <Link href={`/doctors/${doc.id}`} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border text-foreground rounded-lg font-semibold hover:bg-accent transition shadow-sm text-sm">
                                            View Profile
                                        </Link>
                                        <Link href={`/doctors/${doc.id}`} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition shadow-lg shadow-primary/20 text-sm group-hover:scale-[1.02] active:scale-95">
                                            Book Now
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
