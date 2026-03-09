import { Calendar, CheckCircle, Clock, Users, Video, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import SlotManager from "@/components/SlotManager";
import DoctorSettingsComponent from "@/components/DoctorSettings";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function DoctorDashboard() {
    const session = await auth();

    if (!session || !session.user || session.user.role !== 'DOCTOR') {
        redirect('/login');
    }

    // 1. Fetch exactly the logged in Doctor
    const doctorUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            doctorProfile: {
                include: {
                    appointments: {
                        include: { patient: { include: { user: true } }, slot: true },
                        orderBy: { slot: { startTime: 'asc' } }
                    }
                }
            }
        }
    });

    if (!doctorUser || !doctorUser.doctorProfile) {
        return <div className="container py-20 text-center">Doctor profile not found. Please seed data.</div>;
    }

    // @ts-ignore
    const { doctorProfile } = doctorUser as any;
    const appointments = doctorProfile.appointments;

    // Calculate Stats
    const today = new Date();
    const todaysPatients = appointments.filter((a: any) => {
        const time = a.slot?.startTime || a.requestedTime;
        return time ? new Date(time).toDateString() === today.toDateString() : false;
    }).length;

    const pendingReviews = 5;

    // Let's filter digital vs offline
    const digitalConsults = appointments.filter((a: any) => a.type === 'ONLINE').length;
    const completed = appointments.filter((a: any) => a.status === 'COMPLETED').length;

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <div className="container py-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Doctor Portal</div>
                        <h1 className="text-4xl font-bold text-foreground">{doctorUser.name}</h1>
                        <p className="text-muted-foreground">{doctorProfile.specialization} • Shift ends at 5:00 PM</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Online
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: "Today's Patients", value: todaysPatients.toString(), icon: <Users className="text-blue-500" /> },
                        { label: "Pending Reviews", value: "0", icon: <Clock className="text-orange-500" /> },
                        { label: "Digital Consults", value: digitalConsults.toString(), icon: <Video className="text-purple-500" /> },
                        { label: "Completed", value: completed.toString(), icon: <CheckCircle className="text-green-500" /> },
                    ].map((stat, i) => (
                        <div key={i} className="glass-card p-6 flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                            </div>
                            <div className="p-3 bg-secondary rounded-xl">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-foreground">Upcoming Sessions</h3>
                            <button className="text-primary font-semibold text-sm hover:underline">View All</button>
                        </div>

                        <div className="space-y-4">
                            {appointments.length > 0 ? appointments.map((apt: any) => (
                                <div key={apt.id} className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md hover:border-primary p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all">
                                    <div className="flex items-center gap-5 w-full sm:w-auto">
                                        <div className="text-primary bg-primary/10 font-bold font-mono text-lg px-4 py-3 rounded-xl border border-primary/20">
                                            {format(new Date(apt.slot?.startTime || apt.requestedTime), 'p')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-card-foreground text-lg">{apt.patient.user.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-muted-foreground text-sm flex items-center gap-1">
                                                    {apt.type === 'ONLINE' ? <Video size={14} className="text-purple-500" /> : <MapPin size={14} className="text-blue-500" />}
                                                    {apt.type === 'ONLINE' ? 'Digital Consult' : 'In-Person Visit'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${apt.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" :
                                            apt.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" :
                                                "bg-blue-50 text-blue-700 border-blue-200"
                                            }`}>
                                            {apt.status}
                                        </span>

                                        <a href={`/messages?patient=${apt.patient.id}`} className="btn btn-outline border-border py-2 text-sm px-3 hover:bg-secondary">
                                            Message
                                        </a>

                                        {apt.type === 'ONLINE' && (
                                            <a href={`/video/${apt.id}`} className="btn btn-primary py-2 text-sm px-4 bg-purple-600 hover:bg-purple-700 border-none shadow-md shadow-purple-500/20">
                                                Join Video
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-12 bg-secondary/50 rounded-xl border border-dashed border-border">
                                    <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                                    <p className="text-muted-foreground font-medium">No appointments scheduled.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <SlotManager doctorProfileId={doctorProfile.id} />
                        <DoctorSettingsComponent
                            initialFee={doctorProfile.consultationFee}
                            initialIsAvailable={doctorProfile.isAvailable}
                            initialOpeningTime={doctorProfile.openingTime || '09:00'}
                            initialClosingTime={doctorProfile.closingTime || '17:00'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
