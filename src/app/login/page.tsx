'use client';

import { useActionState } from 'react';
import { authenticate, authenticateGoogle } from '@/lib/actions';
import { Mail, Lock, Loader2, ArrowRight, Activity } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { useSearchParams } from 'next/navigation';

import { Suspense } from 'react';

function LoginContent() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/patient';

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
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
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl bg-white/5">
                {/* Visual Side */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden border-r border-white/10">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/services/preventive_premium.png"
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
                            The Future of <br />
                            <span className="text-emerald-500 italic font-serif">Personalized</span> Care
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Access your private health portal to manage your journey towards lifelong vitality.
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
                            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                            <p className="mt-2 text-slate-400 font-medium">
                                New to Grandview?{' '}
                                <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                    Create account
                                </Link>
                            </p>
                        </div>

                        <form action={formAction} className="space-y-5">
                            <input type="hidden" name="redirectTo" value={callbackUrl} />
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-slate-300 ml-1" htmlFor="email">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between px-1">
                                    <label className="text-sm font-bold text-slate-300" htmlFor="password">Password</label>
                                    <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-400">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-medium"
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
                                className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <>
                                        Sign In <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Social Login */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <form action={authenticateGoogle}>
                                <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-white/10 bg-white/5 text-white font-bold hover:bg-white/10 transition-all">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.093-2.093 2.733-5.32 2.733-7.56 0-.52-.067-1.04-.147-1.547H12.48z" />
                                    </svg>
                                    Continue with Google
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
