'use client';

import { useActionState } from 'react';
import { registerUser, authenticateGoogle } from '@/lib/actions';
import { User, Mail, Lock, Loader2, ArrowRight, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function RegisterPage() {
    const [errorMessage, formAction, isPending] = useActionState(
        registerUser,
        undefined,
    );

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                <Image
                    src="/images/services/specialists_premium.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 scale-110 blur-sm"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-emerald-950/20" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl bg-white/5 mx-4">
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/10">
                    <div className="absolute inset-0 z-0 text-white">
                        <Image
                            src="/images/services/laboratory_premium.png"
                            alt="Wellness"
                            fill
                            className="object-cover opacity-40 mix-blend-soft-light"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    </div>
                    
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <Activity size={24} strokeWidth={3} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                Grandview<span className="text-emerald-500">Medical</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-5xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
                            Join the <br />
                            <span className="text-emerald-500 italic font-serif">Frontier</span> of Health
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Create your Grandview account today and experience a new standard of healthcare excellence.
                        </p>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-16 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-10 lg:hidden">
                             <Link href="/" className="flex items-center gap-2">
                                <Activity size={24} className="text-emerald-500" />
                                <span className="text-xl font-bold text-white tracking-tighter">Grandview Medical</span>
                            </Link>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
                            <p className="mt-2 text-slate-400 font-medium">
                                Already have an account?{' '}
                                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        <form action={formAction} className="space-y-4">
                            <div className="space-y-1.5 text-white">
                                <label className="text-sm font-bold text-slate-300 ml-1" htmlFor="name">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400">
                                        <User className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-white">
                                <label className="text-sm font-bold text-slate-300 ml-1" htmlFor="email">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-white">
                                <label className="text-sm font-bold text-slate-300 ml-1" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div aria-live="polite">
                                {errorMessage && (
                                    <div className="rounded-xl bg-rose-500/10 p-4 border border-rose-500/20 text-rose-400 text-sm font-medium">
                                        {errorMessage}
                                    </div>
                                )}
                            </div>

                            <button
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group mt-4"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        Get Started <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Social login */}
                        <div className="mt-6 pt-6 border-t border-white/5">
                            <form action={authenticateGoogle}>
                                <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.093-2.093 2.733-5.32 2.733-7.56 0-.52-.067-1.04-.147-1.547H12.48z" />
                                    </svg>
                                    Join with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
