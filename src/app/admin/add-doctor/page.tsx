'use client';

import { useActionState } from 'react';
import { addDoctor } from '@/lib/actions';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddDoctorPage() {
    const [state, formAction, isPending] = useActionState(addDoctor, null);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="container py-4 flex items-center gap-4">
                    <Link href="/admin" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-violet-500/10 hover:text-violet-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-card-foreground">Add New Doctor</h1>
                        <p className="text-xs text-muted-foreground">Fill in the details to recruit a new specialist</p>
                    </div>
                </div>
            </div>

            <div className="container py-10 max-w-2xl">
                {/* Success Message */}
                {state?.success && (
                    <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-emerald-500 font-medium flex items-center gap-3">
                        <span className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-sm">✓</span>
                        Doctor added successfully! <Link href="/admin" className="underline ml-auto font-bold">Back to Dashboard</Link>
                    </div>
                )}

                {/* Error Message */}
                {state?.error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-500 font-medium">
                        {state.error}
                    </div>
                )}

                <form action={formAction} className="space-y-6">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-card-foreground border-b border-border pb-4">Personal Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Dr. John Smith"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    placeholder="doctor@grandview.com"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">Login Password *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={6}
                                placeholder="Minimum 6 characters"
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-card-foreground border-b border-border pb-4">Professional Details</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="specialization" className="block text-sm font-medium text-foreground mb-1.5">Specialization *</label>
                                <select
                                    id="specialization"
                                    name="specialization"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                >
                                    <option value="">Select Specialization</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Ophthalmology">Ophthalmology</option>
                                    <option value="General Medicine">General Medicine</option>
                                    <option value="Gynecology">Gynecology</option>
                                    <option value="ENT">ENT</option>
                                    <option value="Psychiatry">Psychiatry</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Urology">Urology</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1.5">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    placeholder="e.g. CardioVascular Unit"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="licenseNumber" className="block text-sm font-medium text-foreground mb-1.5">License Number</label>
                                <input
                                    type="text"
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    placeholder="e.g. MED-12345"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                />
                            </div>
                            <div>
                                <label htmlFor="consultationFee" className="block text-sm font-medium text-foreground mb-1.5">Consultation Fee ($)</label>
                                <input
                                    type="number"
                                    id="consultationFee"
                                    name="consultationFee"
                                    placeholder="150"
                                    min={0}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-1.5">Bio / About</label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                placeholder="Brief description of the doctor's expertise and background..."
                                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all resize-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <UserPlus size={20} /> Add Doctor
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
