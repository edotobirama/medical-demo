import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ShieldCheck, Star, Award,
    CreditCard, Stethoscope, ArrowLeft, CheckCircle
} from 'lucide-react';
import { auth } from '@/auth';

export const revalidate = 0; // Ensure fresh data

import DoctorBookingWidget from '@/components/DoctorBookingWidget';

export default async function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const doc = await prisma.doctorProfile.findFirst({
        where: {
            OR: [
                { id: id },
                { userId: id }
            ]
        },
        include: { user: true }
    });

    if (!doc) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Doctor Not Found</h2>
                    <p className="text-gray-500 mt-2">The requested doctor profile could not be found.</p>
                    <Link href="/doctors" className="text-emerald-600 hover:underline mt-4 inline-block">
                        Back to Specialists
                    </Link>
                </div>
            </div>
        );
    }

    // Parse JSON fields safely
    const achievements = doc.achievements ? JSON.parse(doc.achievements as string) : [];
    // Qualifications are not yet in DB schema, providing empty list for now to prevent UI break
    const qualifications: string[] = [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Hero */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <Link href="/doctors" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
                        <ArrowLeft className="w-4 h-4" /> Back to Specialists
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white shrink-0 bg-gray-100">
                            {doc.user.image ? (
                                <img src={doc.user.image} alt={doc.user.name || 'Doctor'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{doc.user.name}</h1>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                    {doc.specialization || 'Specialist'}
                                </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-900">{doc.rating.toFixed(1)}</span>
                                    ({doc.reviews} reviews)
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1">
                                    <Stethoscope className="w-4 h-4" />
                                    {doc.specialization}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1 font-semibold text-gray-900">
                                    <CreditCard className="w-4 h-4" />
                                    ${Number(doc.consultationFee)} / visit
                                </span>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">About</h3>
                                <p className="text-gray-600 leading-relaxed max-w-3xl">
                                    {doc.bio || 'No biography available.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Credentials */}
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-emerald-600" />
                            Credentials & Achievements
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Qualifications - Hidden if empty or check schema later */}
                            {qualifications.length > 0 && (
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 className="font-semibold text-gray-900 mb-4">Qualifications</h4>
                                    <ul className="space-y-3">
                                        {qualifications.map((q, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Awards */}
                            {achievements.length > 0 && (
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                    <h4 className="font-semibold text-gray-900 mb-4">Achievements</h4>
                                    <ul className="space-y-3">
                                        {achievements.map((a: string, i: number) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                                                <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                                {a}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {achievements.length === 0 && qualifications.length === 0 && (
                                <div className="col-span-2 text-gray-500 italic">No detailed credentials listed.</div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Booking Widget */}
                <div className="lg:col-span-1">
                    <DoctorBookingWidget doctorId={doc.id} userId={session?.user?.id} />
                </div>
            </div>
        </div>
    );
}
