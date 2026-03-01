'use client';

import { useState } from 'react';
import { Mail, Loader2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

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
                    <h1 className="text-4xl font-bold mb-4">Account Recovery</h1>
                    <p className="text-lg text-gray-300 max-w-md">
                        Don't worry, it happens. We'll help you get back to your dashboard in no time.
                    </p>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-5 fade-in duration-500">
                    {!submitted ? (
                        <>
                            <div className="text-center lg:text-left">
                                <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition">
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                                </Link>
                                <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                                <p className="mt-2 text-gray-500">
                                    Enter the email address associated with your account and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
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
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@example.com"
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={clsx(
                                        "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed",
                                        loading && "cursor-wait"
                                    )}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <>
                                            Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center items-center flex flex-col animate-in zoom-in fade-in duration-300">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                            <p className="text-gray-500 mb-8">
                                We have sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
                            </p>
                            <Link
                                href="/login"
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition"
                            >
                                Return to Login
                            </Link>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-4 text-sm text-gray-500 hover:text-gray-900 underline"
                            >
                                Try a different email
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
