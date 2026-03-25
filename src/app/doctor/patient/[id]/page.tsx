import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, User, Phone, Mail, Droplets, MapPin, Calendar, FileText, BrainCircuit, Activity } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export const revalidate = 0;

export default async function PatientProfileView({ params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'DOCTOR') {
        redirect('/login');
    }

    const { id: patientId } = await params;

    // Fetch patient data including user and medical history
    const patientProfile = await prisma.patientProfile.findUnique({
        where: { id: patientId },
        include: {
            user: true,
            medicalReports: {
                orderBy: { createdAt: 'desc' },
                include: { uploadedBy: true }
            },
            appointments: {
                where: { doctor: { userId: session.user.id } },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!patientProfile) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
                <p className="text-muted-foreground mb-6">This profile may have been removed or does not exist.</p>
                <Link href="/doctor" className="btn btn-primary bg-primary text-primary-foreground px-6 py-2 rounded-xl">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const age = patientProfile.dateOfBirth 
        ? Math.floor((new Date().getTime() - new Date(patientProfile.dateOfBirth).getTime()) / 31557600000) 
        : 'N/A';

    return (
        <div className="min-h-screen bg-background text-foreground pb-20 pt-8">
            <Navbar />
            <div className="container max-w-5xl mx-auto pt-20">
                {/* Back Navigation */}
                <Link href="/doctor" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-6 group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
                    Back to Dashboard
                </Link>

                {/* Profile Header */}
                <div className="bg-card rounded-2xl border border-border shadow-sm p-8 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                        {patientProfile.user.image ? (
                           <img src={patientProfile.user.image} alt={patientProfile.user.name || "Patient"} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                           <User className="w-10 h-10 text-primary" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold">{patientProfile.user.name || "Unnamed Patient"}</h1>
                            <span className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-bold px-2 py-1 rounded border border-neutral-800 dark:border-neutral-200 shadow-sm">
                                Patient
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar size={16} className="text-primary/70" />
                                {age !== 'N/A' ? `${age} years old` : 'Age N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User size={16} className="text-primary/70" />
                                {patientProfile.gender || 'Gender Not Set'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Droplets size={16} className="text-rose-500/70" />
                                {patientProfile.bloodGroup || 'Blood Type N/A'}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={16} className="text-primary/70" />
                                <span className="truncate max-w-[120px]" title={patientProfile.address || ''}>
                                    {patientProfile.address || 'Location N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <a href={`mailto:${patientProfile.user.email}`} className="btn btn-outline border-border w-full flex justify-center items-center gap-2">
                            <Mail size={16} /> Email Patient
                        </a>
                        <Link href={`/inbox/${patientProfile.userId}`} className="btn btn-primary bg-primary text-primary-foreground hover:bg-primary/90 w-full flex justify-center items-center gap-2 shadow-lg">
                            <Phone size={16} /> Direct Message
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: AI Summary & Master Report */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                            <div className="p-6 bg-secondary/30 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 rounded-lg">
                                        <BrainCircuit size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Master AI Summary</h3>
                                        <p className="text-xs text-muted-foreground">Cumulated intelligence from historical data</p>
                                    </div>
                                </div>
                                {patientProfile.lastSummaryUpdate && (
                                    <div className="text-xs text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">
                                        Last Updated: {format(new Date(patientProfile.lastSummaryUpdate), 'MMM d, yyyy')}
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-6">
                                {patientProfile.masterAiSummary ? (
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                        <p className="whitespace-pre-wrap leading-relaxed">{patientProfile.masterAiSummary}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">No Master Summary Available</p>
                                        <p className="text-xs text-muted-foreground mt-1">AI synthesis requires at least one completed digital consultation.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Historical Reports */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <FileText className="text-blue-500" /> Medical Repository
                            </h3>
                            
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {patientProfile.medicalReports.length > 0 ? (
                                    patientProfile.medicalReports.map((report) => (
                                        <div key={report.id} className="p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-sm line-clamp-2" title={report.title}>
                                                    {report.title}
                                                </h4>
                                                <span className="text-[10px] bg-secondary text-muted-foreground font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0">
                                                    {report.fileType}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground mb-3 font-medium">
                                                {format(new Date(report.createdAt), 'MMM d, yyyy • h:mm a')}
                                            </div>
                                            {(report.aiSummary || report.aiPatientNotes) && (
                                                <div className="text-xs bg-muted/40 p-2 rounded line-clamp-3 mb-3 text-foreground/80">
                                                    {report.aiSummary || report.aiPatientNotes}
                                                </div>
                                            )}
                                            {report.fileUrl !== '#' && (
                                                <a 
                                                    href={report.fileUrl} 
                                                    target="_blank"
                                                    className="text-xs font-bold text-primary hover:underline"
                                                >
                                                    View Full Document
                                                </a>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-secondary/30 rounded-xl border border-dashed border-border px-4">
                                        <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                                        <p className="text-sm text-muted-foreground">No medical reports found for this patient.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
