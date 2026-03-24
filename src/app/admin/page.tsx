import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/lib/actions';
import Link from 'next/link';
import { UserPlus, Users, Stethoscope, Calendar, LogOut, Shield, Trash2, Mail } from 'lucide-react';

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        redirect('/login');
    }

    // Fetch stats
    const [totalDoctors, totalPatients, totalAppointments, totalMessages, doctors] = await Promise.all([
        prisma.user.count({ where: { role: 'DOCTOR' } }),
        prisma.user.count({ where: { role: 'PATIENT' } }),
        prisma.appointment.count(),
        prisma.contactMessage.count(),
        prisma.user.findMany({
            where: { role: 'DOCTOR' },
            include: { doctorProfile: true },
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-30">
                <div className="container py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-card-foreground">Admin Dashboard</h1>
                            <p className="text-xs text-muted-foreground">{session.user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            View Site
                        </Link>
                        <form action={logoutAction}>
                            <button className="btn btn-outline border-border hover:bg-muted text-muted-foreground">
                                <LogOut size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground font-medium">Total Doctors</span>
                            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                                <Stethoscope size={20} className="text-blue-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{totalDoctors}</p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground font-medium">Total Patients</span>
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <Users size={20} className="text-emerald-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{totalPatients}</p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground font-medium">Appointments</span>
                            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
                                <Calendar size={20} className="text-amber-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{totalAppointments}</p>
                    </div>
                    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground font-medium">Messages</span>
                            <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
                                <Mail size={20} className="text-violet-500" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-card-foreground">{totalMessages}</p>
                    </div>
                </div>

                {/* Add Doctor CTA */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-xl">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Recruit a New Doctor</h2>
                        <p className="text-white/70">Add a new specialist to the Grandview Medical team.</p>
                    </div>
                    <Link href="/admin/add-doctor" className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg whitespace-nowrap">
                        <UserPlus size={20} /> Add Doctor
                    </Link>
                </div>

                {/* View Messages CTA */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-white shadow-xl">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Contact Messages</h2>
                        <p className="text-white/70">{totalMessages} messages from visitors. Review and respond.</p>
                    </div>
                    <Link href="/admin/messages" className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg whitespace-nowrap">
                        <Mail size={20} /> View Messages
                    </Link>
                </div>

                {/* Doctors Table */}
                <div>
                    <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                        <Stethoscope size={20} className="text-violet-500" /> Registered Doctors
                    </h2>
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4 hidden md:table-cell">Specialization</th>
                                    <th className="p-4 hidden lg:table-cell">Department</th>
                                    <th className="p-4 text-right">Fee</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {doctors.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-muted transition-colors">
                                        <td className="p-4 font-medium text-card-foreground flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center font-bold text-xs">
                                                {doc.name?.[0] || 'D'}
                                            </div>
                                            {doc.name}
                                        </td>
                                        <td className="p-4 text-muted-foreground">{doc.email}</td>
                                        <td className="p-4 text-muted-foreground hidden md:table-cell">{doc.doctorProfile?.specialization || '—'}</td>
                                        <td className="p-4 text-muted-foreground hidden lg:table-cell">{doc.doctorProfile?.department || '—'}</td>
                                        <td className="p-4 text-right text-card-foreground font-medium">${doc.doctorProfile?.consultationFee || 0}</td>
                                    </tr>
                                ))}
                                {doctors.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-10 text-center text-muted-foreground">
                                            No doctors registered yet. Add your first doctor above.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
