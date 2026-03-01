'use client';

import { useActionState } from 'react';
import { authenticate, authenticateGoogle } from '@/lib/actions';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/patient';

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Left Column: Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900 text-white">
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-hospital.png"
                        alt="Hospital Overview"
                        fill
                        className="object-cover opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                </div>
                <div className="relative z-10 flex flex-col justify-end p-16 w-full">
                    <h1 className="text-4xl font-bold mb-4">Welcome to Grandview Medical Center</h1>
                    <p className="text-lg text-gray-300 max-w-md">
                        Access your dashboard to manage appointments, view medical records, and connect with healthcare professionals.
                    </p>
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <Link href="/" className="inline-block mb-12 lg:mb-16">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
                                Grandview Medical
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                        <p className="mt-2 text-gray-500">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-emerald-600 hover:text-emerald-500 font-medium">
                                Sign up for free
                            </Link>
                        </p>
                    </div>

                    <form action={formAction} className="space-y-6">
                        <input type="hidden" name="redirectTo" value={callbackUrl} />
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm font-medium text-emerald-600 hover:text-emerald-500">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all"
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {errorMessage && (
                                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                                    <div className="flex">
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                                            <div className="mt-2 text-sm text-red-700">{errorMessage}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className={clsx(
                                "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed",
                                isPending && "cursor-wait"
                            )}
                            aria-disabled={isPending}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <form action={authenticateGoogle}>
                                <button className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all">
                                    <span className="sr-only">Sign in with Google</span>
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.013-1.133 8.053-3.24 2.093-2.093 2.733-5.32 2.733-7.56 0-.52-.067-1.04-.147-1.547H12.48z" />
                                    </svg>
                                    <span className="ml-2">Google</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
