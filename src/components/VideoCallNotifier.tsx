'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Phone, PhoneOff, Video, X } from 'lucide-react';

interface IncomingCall {
    appointmentId: string;
    doctorName: string;
    initiatedAt: number;
    status: string;
}

export default function VideoCallNotifier() {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [ringTime, setRingTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const ringIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Create a ringtone using Web Audio API
    const playRingtone = useCallback(() => {
        if (ringIntervalRef.current) return; // Already ringing

        const playTone = () => {
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 440;
                oscillator.type = 'sine';
                gainNode.gain.value = 0.3;

                oscillator.start();

                // Ring pattern: 400ms on, then stop
                setTimeout(() => {
                    oscillator.frequency.value = 523.25; // C5
                }, 200);

                setTimeout(() => {
                    oscillator.stop();
                    audioContext.close();
                }, 400);
            } catch (e) {
                // Audio context not available
            }
        };

        playTone();
        ringIntervalRef.current = setInterval(playTone, 2000);
    }, []);

    const stopRingtone = useCallback(() => {
        if (ringIntervalRef.current) {
            clearInterval(ringIntervalRef.current);
            ringIntervalRef.current = null;
        }
    }, []);

    // Poll for incoming calls
    useEffect(() => {
        if (!session?.user || session.user.role === 'DOCTOR') return;

        const checkForCalls = async () => {
            try {
                const res = await fetch('/api/video/signal');
                if (!res.ok) return;
                const data = await res.json();

                if (data.incomingCalls && data.incomingCalls.length > 0) {
                    const call = data.incomingCalls[0]; // Handle first incoming call

                    // Do not show answering popup if we are already on the call page!
                    if (pathname === `/video/${call.appointmentId}`) {
                        return;
                    }

                    if (!incomingCall || incomingCall.appointmentId !== call.appointmentId) {
                        setIncomingCall(call);
                        setRingTime(0);
                        playRingtone();
                    }
                } else {
                    if (incomingCall) {
                        setIncomingCall(null);
                        stopRingtone();
                    }
                }
            } catch (e) {
                // Silent fail
            }
        };

        checkForCalls();
        const interval = setInterval(checkForCalls, 3000);
        return () => {
            clearInterval(interval);
            stopRingtone();
        };
    }, [session, incomingCall, playRingtone, stopRingtone, pathname]);

    // Fast-react dismissal if pathname changes to the call manually
    useEffect(() => {
        if (incomingCall && pathname === `/video/${incomingCall.appointmentId}`) {
            setIncomingCall(null);
            stopRingtone();
        }
    }, [pathname, incomingCall, stopRingtone]);

    // Ring timer
    useEffect(() => {
        if (!incomingCall) {
            setRingTime(0);
            return;
        }

        const timer = setInterval(() => {
            setRingTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [incomingCall]);

    // Auto-dismiss after 60 seconds
    useEffect(() => {
        if (ringTime >= 60 && incomingCall) {
            handleDismiss();
        }
    }, [ringTime, incomingCall]);

    const handleAnswer = async () => {
        if (!incomingCall) return;
        stopRingtone();

        try {
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: incomingCall.appointmentId,
                    action: 'ANSWER'
                })
            });
        } catch (e) { }

        setIncomingCall(null);
        router.push(`/video/${incomingCall.appointmentId}`);
    };

    const handleDismiss = async () => {
        if (!incomingCall) return;
        stopRingtone();

        try {
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: incomingCall.appointmentId,
                    action: 'DISMISS'
                })
            });
        } catch (e) { }

        setIncomingCall(null);
    };

    if (!incomingCall) return null;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300" />

            {/* Call Card */}
            <div className="relative z-10 pointer-events-auto w-full max-w-sm mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
                <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-3xl shadow-2xl overflow-hidden border border-neutral-700/50">
                    {/* Animated Ring Indicator */}
                    <div className="relative flex items-center justify-center pt-10 pb-6">
                        {/* Pulsing rings */}
                        <div className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/30 animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="absolute w-24 h-24 rounded-full border-2 border-emerald-500/20 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                        <div className="absolute w-20 h-20 rounded-full border-2 border-emerald-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />

                        {/* Avatar */}
                        <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                            <Video size={32} className="text-white" />
                        </div>
                    </div>

                    {/* Call Info */}
                    <div className="text-center px-8 pb-6">
                        <h3 className="text-xl font-bold text-white mb-1">{incomingCall.doctorName}</h3>
                        <p className="text-emerald-400 text-sm font-medium flex items-center justify-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Incoming Video Call
                        </p>
                        <p className="text-neutral-400 text-xs font-mono">{formatTime(ringTime)}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-center gap-8 pb-10 px-8">
                        {/* Decline */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={handleDismiss}
                                className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-600/40 transition-all hover:scale-110 active:scale-95"
                            >
                                <PhoneOff size={24} />
                            </button>
                            <span className="text-neutral-400 text-xs font-medium">Decline</span>
                        </div>

                        {/* Answer */}
                        <div className="flex flex-col items-center gap-2">
                            <button
                                onClick={handleAnswer}
                                className="w-16 h-16 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-600/40 transition-all hover:scale-110 active:scale-95 animate-bounce"
                                style={{ animationDuration: '1.5s' }}
                            >
                                <Phone size={24} />
                            </button>
                            <span className="text-neutral-400 text-xs font-medium">Answer</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
