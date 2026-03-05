import Link from 'next/link';
import { Calendar, Clock, FileText, MessageSquare, Plus, Video, MapPin, User as UserIcon, LogOut } from "lucide-react";
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

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
                    waitlistEntries: {
                        where: { status: 'WAITING' },
                        orderBy: { createdAt: 'desc' },
                        take: 1
                    },
                    appointments: {
                        include: {
                            doctor: {
                                include: { user: true }
                            },
                            slot: true
                        },
                        orderBy: { slot: { startTime: 'asc' } },
                        where: { slot: { startTime: { gte: new Date() } } }
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
    const waitlistEntry = patientProfile.waitlistEntries?.[0];
    const upcomingAppointments = patientProfile.appointments || [];
    const reports = patientProfile.medicalReports || [];

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="container py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold text-lg">
                            {user.name?.[0] || <UserIcon size={20} />}
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Welcome, {user.name?.split(' ')[0]}</h1>
                            <p className="text-xs text-gray-500">Patient Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/book" className="btn btn-primary shadow-lg shadow-teal-500/20">
                            <Plus size={18} className="mr-2" /> Book Appointment
                        </Link>
                        <form action={async () => {
                            'use server';
                            await signOut({ redirectTo: '/login' });
                        }}>
                            <button className="btn btn-outline border-gray-200 hover:bg-gray-50 text-gray-600">
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
                    {waitlistEntry ? (
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                <Clock size={120} />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-lg font-medium opacity-90 mb-1">Priority Waitlist</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">#{waitlistEntry.position}</span>
                                    <span className="text-sm opacity-75">in line</span>
                                </div>
                                <p className="mt-4 text-sm bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    Est. wait: {waitlistEntry.position * 15} mins
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">No Active Waitlist</h3>
                                <p className="text-gray-500 text-sm">You are not currently in any priority queues.</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                <Clock size={24} />
                            </div>
                        </div>
                    )}

                    {/* Appointments Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Calendar size={20} className="text-teal-600" /> Upcoming Appointments
                            </h3>
                            <Link href="/book" className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
                                View all
                            </Link>
                        </div>

                        {upcomingAppointments.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingAppointments.map((app: any) => (
                                    <div key={app.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-5 group">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-colors ${app.type === 'ONLINE' ? 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                                            {app.type === 'ONLINE' ? <Video size={24} /> : <MapPin size={24} />}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="font-bold text-gray-900">{app.doctor.user?.name || "Dr. Specialist"}</h4>
                                            <p className="text-sm text-gray-500">{app.doctor.specialization}</p>
                                            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs font-medium text-gray-600">
                                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                                    <Calendar size={12} /> {format(new Date(app.slot.startTime), 'MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                                    <Clock size={12} /> {format(new Date(app.slot.startTime), 'h:mm a')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full sm:w-auto">
                                            <button className="flex-1 sm:flex-none btn btn-outline px-4 py-2 text-xs">Reschedule</button>
                                            {app.type === 'ONLINE' ? (
                                                <Link href={`/video/${app.id}`} className="flex-1 sm:flex-none btn btn-primary px-4 py-2 text-xs">Join Video</Link>
                                            ) : (
                                                <button className="flex-1 sm:flex-none btn btn-primary px-4 py-2 text-xs">Directions</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-10 border border-dashed border-gray-300 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <Calendar size={32} />
                                </div>
                                <h4 className="text-gray-900 font-medium mb-1">No appointments scheduled</h4>
                                <p className="text-gray-500 text-sm mb-4">Book a consultation with our specialists today.</p>
                                <Link href="/book" className="btn btn-outline text-sm">Book Now</Link>
                            </div>
                        )}
                    </div>

                    {/* Medical Records Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FileText size={20} className="text-teal-600" /> Recent Medical Reports
                            </h3>
                            <button className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline">
                                View History
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                            {reports.length > 0 ? (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="p-4">Report Name</th>
                                            <th className="p-4 hidden sm:table-cell">Date</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {reports.map((report: any) => (
                                            <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <FileText size={16} />
                                                    </div>
                                                    {report.title}
                                                </td>
                                                <td className="p-4 text-gray-500 hidden sm:table-cell">{format(new Date(report.createdAt), 'MMM d, yyyy')}</td>
                                                <td className="p-4 text-gray-500 uppercase text-xs font-semibold">{report.fileType}</td>
                                                <td className="p-4 text-right">
                                                    <button className="text-teal-600 hover:text-teal-700 font-medium text-xs border border-teal-100 hover:border-teal-200 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded transition-all">
                                                        Download
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-10 text-center text-gray-500">
                                    <p>No medical reports uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Right Sidebar - Sticky on Desktop */}
                <div className="lg:col-span-4 space-y-6">

                    {/* AI Helper */}
                    <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                            <MessageSquare size={24} className="text-teal-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Health Assistant</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Feeling unwell? Describe your symptoms to our AI assistant for a preliminary assessment.
                        </p>
                        <button className="w-full btn bg-teal-500 hover:bg-teal-400 text-white border-none justify-center font-bold">
                            Start Chat
                        </button>
                    </div>

                    {/* Insurance Card Info */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Insurance Coverage</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Status</span>
                                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Deductible</span>
                                <span className="font-semibold text-gray-900">$1,200 / $2,000</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '60%' }}></div>
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
