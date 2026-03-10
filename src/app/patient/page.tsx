import Link from 'next/link';
import { Calendar, Clock, FileText, MessageSquare, Plus, Video, MapPin, User as UserIcon, LogOut, AlertTriangle } from "lucide-react";
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import CancelAppointmentButton from '@/components/CancelAppointmentButton';
import PatientRefundReschedule from '@/components/PatientRefundReschedule';
import DocumentUpload from '@/components/DocumentUpload';
import PatientRescheduleButton from '@/components/PatientRescheduleButton';

export const revalidate = 0;

export default async function PatientDashboard() {
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
        redirect('/login');
    }

    // Fetch User & Profile
    let user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            patientProfile: {
                include: {
                    appointments: {
                        include: {
                            doctor: {
                                include: { user: true }
                            },
                            slot: true
                        },
                        where: {
                            status: { in: ['BOOKED', 'RESCHEDULED', 'TURN_ARRIVED'] }
                        },
                        orderBy: { requestedTime: 'asc' }
                    },
                    medicalReports: true
                }
            }
        }
    });

    // Handle missing profile by creating one
    if (user && !user.patientProfile) {
        await prisma.patientProfile.create({
            data: {
                userId: user.id,
            }
        });

        // Redirect to refresh the page and fetch pure data
        redirect('/patient');
    }

    if (!user || !user.patientProfile) {
        return <div className="container py-20 text-center">Error loading profile. Please try again.</div>;
    }

    // Force type assertion to avoid valid Prisma relation errors if types are stale
    const patientProfile = user.patientProfile as any;

    // The "Upcoming Appointments" in the waitmath system ARE the waitlist entries.
    // The closest requested time is the active waitlist.
    const upcomingAppointments = patientProfile.appointments || [];
    const activeWaitlistAppt = upcomingAppointments[0]; // the next one
    const reports = patientProfile.medicalReports || [];

    // Fetch appointments that need patient action (cancelled by doctor or reschedule requested)
    const actionableAppointments = await prisma.appointment.findMany({
        where: {
            patientId: patientProfile.id,
            status: { in: ['CANCELLED', 'RESCHEDULE_REQUESTED'] }
        },
        include: {
            doctor: { include: { user: true } },
            slot: true
        },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="bg-background min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-card border-b border-border sticky top-0 z-30">
                <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg shadow-sm border border-primary/30">
                            {user.name?.[0] || <UserIcon size={20} />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-card-foreground">Welcome, {user.name?.split(' ')[0]}</h1>
                            <p className="text-xs text-muted-foreground">Patient Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/book" className="flex items-center gap-2 px-7 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full shadow-md hover:shadow-lg transition-all active:scale-[0.97]">
                            Book Appointment
                        </Link>
                        <form action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/login' });
                        }}>
                            <button className="btn btn-outline border-border hover:bg-muted text-muted-foreground">
                                <LogOut size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container py-8 grid lg:grid-cols-12 gap-8">

                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Quick Stats or Waitlist */}
                    {activeWaitlistAppt ? (
                        <div className="bg-primary rounded-2xl p-6 text-primary-foreground shadow-xl relative overflow-hidden border border-border">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                <Clock size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-medium opacity-90 mb-1">Priority Waitlist (Booking #{activeWaitlistAppt.bookingNumber})</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xl font-bold">{activeWaitlistAppt.doctor.user.name}</span>
                                </div>
                                <p className="mt-4 text-sm bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    Requested Time: {activeWaitlistAppt.requestedTime ? format(new Date(activeWaitlistAppt.requestedTime), 'h:mm a') : 'TBD'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-card-foreground">No Active Waitlist</h3>
                                <p className="text-muted-foreground text-sm">You are not currently in any priority queues.</p>
                            </div>
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                                <Clock size={24} />
                            </div>
                        </div>
                    )}

                    {/* Action Required — Refund / Reschedule */}
                    {actionableAppointments.length > 0 && (
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                                    <AlertTriangle size={20} className="text-amber-500" /> Action Required
                                </h3>
                                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {actionableAppointments.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {actionableAppointments.map((app: any) => (
                                    <div key={app.id} className="bg-card rounded-xl border border-border shadow-sm p-5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 ${app.type === 'ONLINE' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                {app.type === 'ONLINE' ? <Video size={22} /> : <MapPin size={22} />}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-card-foreground">{app.doctor.user?.name || 'Dr. Specialist'}</h4>
                                                <p className="text-sm text-muted-foreground">{app.doctor.specialization}</p>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                                                        <Calendar size={10} /> {app.requestedTime ? format(new Date(app.requestedTime), 'MMM d, yyyy') : 'N/A'}
                                                    </span>
                                                    <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded">
                                                        <Clock size={10} /> {app.requestedTime ? format(new Date(app.requestedTime), 'h:mm a') : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <PatientRefundReschedule
                                            appointmentId={app.id}
                                            doctorId={app.doctorId}
                                            amountPaid={app.amountPaid}
                                            status={app.status}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Appointments Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                                <Calendar size={20} className="text-primary" /> Upcoming Appointments
                            </h3>
                            <Link href="/book" className="text-sm font-medium text-primary hover:brightness-110 hover:underline">
                                View all
                            </Link>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((app: any) => (
                                    <div key={app.id} className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-5 group">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors ${app.type === 'ONLINE' ? 'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20' : 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20'}`}>
                                            {app.type === 'ONLINE' ? <Video size={24} /> : <MapPin size={24} />}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="font-bold text-card-foreground hover:text-primary transition-colors">
                                                <Link href={`/doctors/${app.doctorId}`}>
                                                    {app.doctor.user?.name || "Dr. Specialist"}
                                                </Link>
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{app.doctor.specialization}</p>
                                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-medium text-muted-foreground">
                                                <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                                    <Calendar size={12} /> {app.requestedTime ? format(new Date(app.requestedTime), 'MMM d, yyyy') : 'No Date'}
                                                </span>
                                                <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                                                    <Clock size={12} /> {app.requestedTime ? format(new Date(app.requestedTime), 'h:mm a') : 'No Time'}
                                                </span>
                                                <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                                                    #{app.bookingNumber}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                            <PatientRescheduleButton
                                                appointmentId={app.id}
                                                currentTime={app.requestedTime?.toISOString() || new Date().toISOString()}
                                                rescheduleCount={app.rescheduleCount || 0}
                                                maxReschedules={3}
                                                doctorOpeningTime={app.doctor.openingTime || '09:00'}
                                                doctorClosingTime={app.doctor.closingTime || '17:00'}
                                            />
                                            <CancelAppointmentButton appointmentId={app.id} />
                                            {app.type === 'ONLINE' ? (
                                                <Link href={`/video/${app.id}`} className="flex-1 sm:flex-none btn btn-primary px-4 py-2 text-xs text-center">Join Video</Link>
                                            ) : (
                                                <Link href="/parking" className="flex-1 sm:flex-none btn btn-primary px-4 py-2 text-xs text-center">Directions</Link>
                                            )}
                                            <Link href={`/inbox/${app.doctor.userId}`} className="flex-1 sm:flex-none btn px-4 py-2 text-xs text-center bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold w-full sm:w-auto mt-2 sm:mt-0 shadow-sm border border-border">
                                                Message
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-card rounded-xl p-10 border border-dashed border-border text-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                                    <Calendar size={32} />
                                </div>
                                <h4 className="text-card-foreground font-medium mb-1">No appointments scheduled</h4>
                                <p className="text-muted-foreground text-sm mb-4">Book a consultation with our specialists today.</p>
                                <Link href="/book" className="btn btn-outline text-sm">Book Now</Link>
                            </div>
                        )}
                    </div>

                    {/* Medical Records Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-card-foreground flex items-center gap-2">
                                <FileText size={20} className="text-primary" /> Medical Records
                            </h3>
                            <button className="text-sm font-medium text-primary hover:brightness-110 hover:underline">
                                View History
                            </button>
                        </div>

                        {/* Document Upload */}
                        <div className="bg-card rounded-xl border border-border shadow-sm p-5 mb-4">
                            <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                                📤 Upload Medical Documents
                            </h4>
                            <p className="text-xs text-muted-foreground mb-4">
                                Upload your medical records, lab results, and prescriptions to keep them accessible to your doctors across sessions.
                            </p>
                            <DocumentUpload />
                        </div>

                        {/* Existing Reports */}
                        <h4 className="text-sm font-bold text-foreground mb-3">Your Documents</h4>
                        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                            {reports.length > 0 ? (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                                        <tr>
                                            <th className="p-4">Report Name</th>
                                            <th className="p-4 hidden sm:table-cell">Date</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {reports.map((report: any) => (
                                            <tr key={report.id} className="hover:bg-muted transition-colors">
                                                <td className="p-4 font-medium text-card-foreground flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                                        <FileText size={16} />
                                                    </div>
                                                    {report.title}
                                                </td>
                                                <td className="p-4 text-muted-foreground hidden sm:table-cell">{format(new Date(report.createdAt), 'MMM d, yyyy')}</td>
                                                <td className="p-4 text-muted-foreground uppercase text-xs font-semibold">{report.fileType}</td>
                                                <td className="p-4 text-right">
                                                    <button className="text-primary hover:brightness-110 font-medium text-xs border border-primary/20 hover:border-primary/40 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded transition-all">
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center text-muted-foreground">
                                    <p>No medical reports uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar - Sticky on Desktop */}
                <div className="lg:col-span-4 space-y-6">

                    {/* AI Health Assistant — Premium Gradient Card */}
                    <div className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-primary"></div>
                        <div className="absolute inset-0 bg-secondary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {/* Decorative Orbs */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-black/10 rounded-full blur-2xl"></div>

                        <div className="relative z-10 p-6 text-primary-foreground">
                            <div className="w-12 h-12 bg-background/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/25 shadow-inner">
                                <MessageSquare size={24} className="text-primary-foreground drop-shadow-sm" />
                            </div>
                            <h3 className="text-xl font-bold mb-1.5 tracking-tight">Health Assistant</h3>
                            <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                                Feeling unwell? Describe your symptoms to our AI assistant for a preliminary assessment.
                            </p>
                            <Link href="/messages" className="w-full py-3 bg-background text-primary rounded-xl font-bold shadow-lg hover:bg-background/90 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                <MessageSquare size={16} />
                                Start Chat
                            </Link>
                        </div>
                    </div>

                    {/* Insurance Card Info */}
                    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                        <h3 className="text-lg font-bold text-card-foreground mb-4">Insurance Coverage</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm p-3 bg-muted rounded-lg">
                                <span className="text-muted-foreground">Status</span>
                                <span className="font-semibold text-primary flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-primary"></span> Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-muted rounded-lg">
                                <span className="text-muted-foreground">Deductible</span>
                                <span className="font-semibold text-card-foreground">$1,200 / $2,000</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <button className="btn btn-outline w-full justify-center mt-6 text-sm">
                            View Digital Card
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}
