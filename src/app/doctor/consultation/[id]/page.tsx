import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { format } from 'date-fns';
import { User, Calendar, Clock, Activity, FileText, ArrowLeft, Video, ShieldAlert } from 'lucide-react';
import { parseHistoryNotes } from '@/lib/utils/history';
import EndConsultationButton from '@/components/EndConsultationButton';
import CallPatientButton from '@/components/CallPatientButton';
import DoctorFinalizeConsultation from '@/components/DoctorFinalizeConsultation';

export const revalidate = 0;

export default async function DoctorConsultationPortal({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <ConsultationFetcher id={id} />
    );
}

async function ConsultationFetcher({ id }: { id: string }) {
    const session = await auth();
    if (!session || session.user.role !== 'DOCTOR') redirect('/login');

    const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
            patient: {
                include: {
                    user: true,
                    waitlistEntries: true,
                    medicalReports: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    }
                }
            },
            doctor: { include: { user: true } },
            slot: true
        }
    });

    if (!appointment) return <div className="text-center py-20">Appointment not found.</div>;
    if (appointment.doctor.user.id !== session.user.id) return <div className="text-center py-20 text-rose-500 font-bold">Unauthorized.</div>;

    const patient = appointment.patient;
    const pastAppointmentsCount = await prisma.appointment.count({
        where: { patientId: patient.id, status: 'COMPLETED' }
    });

    return (
        <div className="flex flex-col min-h-screen bg-muted/20 pt-20">
            <Navbar transparent={false} />

            <main className="container max-w-6xl mx-auto py-8 flex-grow">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/doctor" className="btn btn-ghost bg-card p-3 rounded-xl border border-border hover:bg-muted text-muted-foreground shadow-sm">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Activity className="text-primary" /> Active Consultation
                            </h1>
                            <p className="text-muted-foreground font-medium text-sm mt-1">
                                {format(new Date(), 'EEEE, MMMM do, yyyy')}
                            </p>
                        </div>
                    </div>
                    {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                        <EndConsultationButton appointmentId={appointment.id} />
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Patient Summary Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                            <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                                    {patient.user.name?.[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{patient.user.name}</h2>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1 font-medium">
                                        <User size={14} /> ID: {patient.id.slice(0, 8).toUpperCase()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm font-medium">
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-2"><Calendar size={16} /> Age/DOB</span>
                                    <span className="text-foreground">{patient.dateOfBirth ? format(new Date(patient.dateOfBirth), 'yyyy-MM-dd') : 'N/A'}</span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-2"><User size={16} /> Gender</span>
                                    <span className="text-foreground capitalize">{patient.gender || 'Not specified'}</span>
                                </div>
                                <div className="flex items-center justify-between text-muted-foreground">
                                    <span className="flex items-center gap-2"><ShieldAlert size={16} /> Past Visits</span>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">{pastAppointmentsCount} completed</span>
                                </div>
                            </div>
                        </div>

                        {/* Session Details */}
                        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                            <h3 className="font-bold flex items-center gap-2 mb-4 border-b border-border pb-3">
                                <Clock className="text-blue-500" /> Session Details
                            </h3>
                            <div className="space-y-3 font-medium text-sm">
                                <p className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${appointment.type === 'ONLINE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {appointment.type}
                                    </span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Scheduled For:</span>
                                    <span className="text-foreground">
                                        {appointment.slot ? format(new Date(appointment.slot.startTime), 'p, MMM do') :
                                            appointment.requestedTime ? format(new Date(appointment.requestedTime), 'p, MMM do') : 'N/A'}
                                    </span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded flex items-center gap-1 font-bold">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        {appointment.status}
                                    </span>
                                </p>
                                {appointment.type === 'ONLINE' && (
                                    <div className="mt-4 space-y-2">
                                        <CallPatientButton appointmentId={appointment.id} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Medical Overview Space */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Issues / Notes */}
                        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                <FileText className="text-orange-500" /> Current Issue & Notes
                            </h3>

                            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-4 mb-4">
                                <h4 className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">Patient's Description</h4>
                                <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-wrap">
                                    {appointment.issueDescription || "No specific issues described by the patient during booking."}
                                </p>
                            </div>

                            <div className="bg-secondary/50 rounded-xl p-4">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Prior Context / History Notes</h4>
                                <p className="text-sm text-foreground italic leading-relaxed">
                                    {parseHistoryNotes(appointment.historyNotes).notes || "No historical context attached to this specific booking."}
                                </p>
                            </div>
                        </div>

                        {/* Recent Medical Reports */}
                        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                <ShieldAlert className="text-emerald-500" /> Recent Medical Reports
                            </h3>

                            {patient.medicalReports && patient.medicalReports.length > 0 ? (
                                <div className="space-y-3">
                                    {patient.medicalReports.map((report: any) => (
                                        <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/30 border border-border/50 rounded-xl hover:bg-secondary/80 transition-colors">
                                            <div className="flex items-center gap-3 mb-2 sm:mb-0">
                                                <div className="p-2 bg-background border border-border rounded-lg text-primary">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground">{report.title}</p>
                                                    <p className="text-xs text-muted-foreground italic mt-0.5">Uploaded {format(new Date(report.createdAt), 'MMM do, yyyy')}</p>
                                                </div>
                                            </div>
                                            <a href={report.fileUrl} target="_blank" rel="noreferrer" className="btn btn-outline text-xs px-3 py-1.5 border-border hover:bg-background shadow-sm">
                                                View Report
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border/50">
                                    <FileText className="w-8 h-8 mx-auto text-muted-foreground/30 mb-2" />
                                    <p className="text-sm text-muted-foreground font-medium">No prior medical reports found for this patient.</p>
                                </div>
                            )}
                        </div>

                        {/* Doctor Finalize Consultation Block (Digital or Upload) - for post-consultation */}
                        {appointment.status !== 'CANCELLED' && (
                            <DoctorFinalizeConsultation appointmentId={appointment.id} />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
