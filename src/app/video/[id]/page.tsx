"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RefObject } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
    Maximize2, Minimize2, Clock, User, Wifi, WifiOff, AlertCircle,
    FileText
} from "lucide-react";
import clsx from "clsx";
import LiveTranscription from '@/components/LiveTranscription';
import PatientReportsModal from '@/components/PatientReportsModal';
import LivePossibilitiesPanel from '@/components/LivePossibilitiesPanel';
import PatientPostConsultation from '@/components/PatientPostConsultation';

interface AppointmentData {
    id: string;
    doctorName: string;
    patientName: string;
    doctorImage: string | null;
    patientImage: string | null;
    type: string;
    status: string;
    specialization: string;
    issueDescription: string | null;
}

export default function VideoCallPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [appointmentId, setAppointmentId] = useState<string>("");
    const [appointment, setAppointment] = useState<AppointmentData | null>(null);
    const [muted, setMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');
    const [pipExpanded, setPipExpanded] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState<{ from: string; text: string; time: string }[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [reconnecting, setReconnecting] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [endedBy, setEndedBy] = useState<'DOCTOR' | 'PATIENT' | 'SELF' | null>(null);
    const [redirectCountdown, setRedirectCountdown] = useState(4);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [hasCamera, setHasCamera] = useState(false);
    const [showReports, setShowReports] = useState(false);

    const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const endedRef = useRef(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    // Resolve params
    useEffect(() => {
        params.then(p => setAppointmentId(p.id));
    }, [params]);

    // Initialize camera — request primary device camera at native resolution
    useEffect(() => {
        let cancelled = false;

        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'user',         // Default front-facing camera
                        width: { ideal: 3840, min: 1280 },   // Up to 4K, minimum 720p
                        height: { ideal: 2160, min: 720 },
                        frameRate: { ideal: 30 }
                    },
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                        sampleRate: 48000,
                        channelCount: 2
                    }
                });

                if (cancelled) {
                    stream.getTracks().forEach(t => t.stop());
                    return;
                }

                localStreamRef.current = stream;
                setHasCamera(true);

                // Attach to video element
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err: any) {
                if (cancelled) return;
                console.error('Camera access error:', err);
                if (err.name === 'NotAllowedError') {
                    setCameraError('Camera access was denied. Please allow camera permissions and reload.');
                } else if (err.name === 'NotFoundError') {
                    setCameraError('No camera found on this device.');
                } else {
                    setCameraError('Unable to access camera. Please check your device settings.');
                }
            }
        };

        initCamera();

        return () => {
            cancelled = true;
        };
    }, []);

    // Re-attach stream to video element when ref becomes available
    useEffect(() => {
        if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
        }
    });

    // Toggle audio track when muted state changes
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !muted;
            });
        }
    }, [muted]);

    // Toggle video track when videoOff state changes
    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !videoOff;
            });
        }
    }, [videoOff]);

    // Clean up camera stream on unmount or call end
    useEffect(() => {
        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
                localStreamRef.current = null;
            }
        };
    }, []);

    // Fetch appointment data
    useEffect(() => {
        if (!appointmentId) return;

        const fetchAppointment = async () => {
            try {
                const res = await fetch(`/api/video/signal?appointmentId=${appointmentId}`);
                if (res.ok) {
                    const data = await res.json();
                    // Also fetch appointment details
                    const aptRes = await fetch(`/api/appointments/${appointmentId}`);
                    if (aptRes.ok) {
                        const aptData = await aptRes.json();
                        setAppointment(aptData);

                        // If user reloads the page and the call is already COMPLETED (and no new call is active)
                        if (aptData.status === 'COMPLETED' && !data.hasActiveCall) {
                            setCallEnded(true);
                            setConnected(false);
                            setConnecting(false);
                            endedRef.current = true;
                            return; // Stop trying to connect to a finished call
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to fetch appointment", e);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    // WebRTC Connection / Waiting Room Logic
    useEffect(() => {
        if (!appointmentId) return;

        if (session?.user?.role === 'DOCTOR') {
            // Doctors initiate the call
            const timer = setTimeout(() => {
                setConnecting(false);
                setConnected(true);
                // Call INITIATE
                fetch('/api/video/signal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId, action: 'INITIATE' })
                }).catch(() => { });
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            // Patients wait in the Waiting Room until doctor calls
            const checkDoctorAvailability = async () => {
                try {
                    const res = await fetch(`/api/video/signal?appointmentId=${appointmentId}`);
                    if (!res.ok) return;
                    const data = await res.json();

                    if (data.hasActiveCall) {
                        // If the call had previously ended and the doctor is calling AGAIN,
                        // reload the page to cleanly re-initialize the camera and reset state.
                        if (endedRef.current) {
                            window.location.reload();
                            return;
                        }

                        setConnecting(false);
                        setConnected(true);

                        // Answer the call automatically
                        fetch('/api/video/signal', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ appointmentId, action: 'ANSWER' })
                        }).catch(() => { });
                    }
                } catch (e) { }
            };

            const interval = setInterval(checkDoctorAvailability, 3000);
            return () => clearInterval(interval);
        }
    }, [appointmentId, session]);

    // Reliable Heartbeat: Maintain the session and detect disconnects
    useEffect(() => {
        if (!appointmentId || !connected || callEnded) return;

        const sendHeartbeat = async () => {
            try {
                await fetch('/api/video/signal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId, action: 'HEARTBEAT' })
                });
            } catch (e) {
                // Ignore heartbeat network fails, but polling will catch actual drops
            }
        };

        const interval = setInterval(sendHeartbeat, 10000); // 10s heartbeat
        return () => clearInterval(interval);
    }, [appointmentId, connected, callEnded]);

    // Call duration timer
    useEffect(() => {
        if (connected && !durationRef.current) {
            durationRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        }

        return () => {
            if (durationRef.current) {
                clearInterval(durationRef.current);
                durationRef.current = null;
            }
        };
    }, [connected]);

    // Poll for remote call termination — the key to synchronized ending
    useEffect(() => {
        if (!appointmentId || !connected || callEnded) return;

        const checkCallStatus = async () => {
            try {
                const res = await fetch(`/api/video/signal?appointmentId=${appointmentId}`);
                if (!res.ok) return;
                const data = await res.json();

                if (data.callEnded && !endedRef.current) {
                    endedRef.current = true;
                    // Global Signal Received: The other party or system terminated the call
                    setCallEnded(true);
                    setEndedBy(data.endedBy || null);
                    setConnected(false);

                    // Force media stream termination on this device immediately
                    if (localStreamRef.current) {
                        localStreamRef.current.getTracks().forEach(track => {
                            track.stop();
                            track.enabled = false;
                        });
                        localStreamRef.current = null;
                    }

                    if (durationRef.current) {
                        clearInterval(durationRef.current);
                        durationRef.current = null;
                    }
                }

                // Sync messages if there are new ones
                if (data.messages && data.messages.length > chatMessages.length) {
                    setChatMessages(data.messages);
                }
            } catch (e) {
                // Silent fail
            }
        };

        const interval = setInterval(checkCallStatus, 3000);
        return () => clearInterval(interval);
    }, [appointmentId, connected, callEnded]);

    // Redirect countdown after call ends
    useEffect(() => {
        if (!callEnded) return;

        const countdown = setInterval(() => {
            setRedirectCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [callEnded]);

    // Handle unexpected disconnects (closing tab or navigating away)
    useEffect(() => {
        const handleUnload = () => {
            if (connected && !callEnded && !endedRef.current && appointmentId) {
                // Use keepalive to ensure the signal reaches the server during page unload
                fetch('/api/video/signal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId, action: 'END' }),
                    keepalive: true
                }).catch(() => {});
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            window.removeEventListener('unload', handleUnload);
            // Trigger cleanup if component unmounts normally
            handleUnload();
        };
    }, [appointmentId, connected, callEnded]);

    // Perform redirect when countdown reaches 0 for doctors
    useEffect(() => {
        if (!callEnded || session?.user?.role !== 'DOCTOR') return;

        if (redirectCountdown <= 0) {
            router.push(`/doctor/consultation/${appointmentId}`);
        }
    }, [callEnded, redirectCountdown, session, appointmentId, router]);

    // Simulate connection quality changes
    useEffect(() => {
        if (!connected) return;
        const interval = setInterval(() => {
            const rand = Math.random();
            setConnectionQuality(rand > 0.85 ? 'poor' : rand > 0.6 ? 'good' : 'excellent');
        }, 10000);
        return () => clearInterval(interval);
    }, [connected]);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const endCall = async () => {
        if (endedRef.current) return; // Prevent double-ending
        endedRef.current = true;

        // Stop all camera/mic tracks immediately & Release Hardware
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => {
                track.stop();
                track.enabled = false; // Force immediate disable
            });
            localStreamRef.current = null;
        }

        // Immediately update local state for instant UI feedback
        setCallEnded(true);
        setEndedBy('SELF');
        setConnected(false);

        if (durationRef.current) {
            clearInterval(durationRef.current);
            durationRef.current = null;
        }

        // Send Global TERMINATE signal to Signaling Server
        try {
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, action: 'END' })
            });
        } catch (e) { }

        // Redirect is handled by the countdown effect
    };

    const simulateReconnect = () => {
        setReconnecting(true);
        setConnected(false);
        setTimeout(() => {
            setReconnecting(false);
            setConnected(true);
        }, 3000);
    };

    const sendChatMessage = async () => {
        if (!chatInput.trim()) return;

        const text = chatInput.trim();
        const from = session?.user?.role === 'DOCTOR' ? 'Doctor' : 'You';

        // Optimistic UI update
        setChatMessages(prev => [...prev, {
            from,
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatInput("");

        // Send to signaling server for the other party
        try {
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, action: 'SEND_MESSAGE', text })
            });
        } catch (e) {
            console.error('Failed to send message:', e);
        }
    };

    const isDoctor = session?.user?.role === 'DOCTOR';
    const remoteName = appointment
        ? (isDoctor ? appointment.patientName : appointment.doctorName)
        : (isDoctor ? 'Patient' : 'Doctor');
    const remoteRole = isDoctor ? 'Patient' : appointment?.specialization || 'Specialist';

    const qualityColor = connectionQuality === 'excellent' ? 'text-emerald-400' :
        connectionQuality === 'good' ? 'text-yellow-400' : 'text-red-400';
    const qualityBars = connectionQuality === 'excellent' ? 3 :
        connectionQuality === 'good' ? 2 : 1;

    // === Call Ended Overlay ===
    if (callEnded) {
        if (!isDoctor) {
            return (
                <PatientPostConsultation
                    appointmentId={appointmentId}
                    callDuration={formatDuration(callDuration)}
                    remoteName={remoteName}
                />
            );
        }

        const endMessage = endedBy === 'SELF'
            ? 'You ended the call'
            : endedBy === 'DOCTOR'
                ? 'The doctor has ended the session'
                : endedBy === 'PATIENT'
                    ? 'The patient has left the call'
                    : 'Call has ended';

        return (
            <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <div className="text-center animate-in fade-in zoom-in-95 duration-500 max-w-md mx-4">
                    {/* Animated End Icon */}
                    <div className="relative mx-auto w-24 h-24 mb-8">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/30">
                            <PhoneOff size={36} className="text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">Call Ended</h2>
                    <p className="text-neutral-400 mb-2">{endMessage}</p>

                    {/* Call Summary */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6 mt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-left">
                                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">Duration</p>
                                <p className="text-white font-bold font-mono text-lg">{formatDuration(callDuration)}</p>
                            </div>
                            <div className="text-left">
                                <p className="text-neutral-500 text-xs uppercase tracking-wider mb-1">{isDoctor ? 'Patient' : 'Doctor'}</p>
                                <p className="text-white font-bold">{remoteName}</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-neutral-500 text-sm mb-4">
                        Redirecting to your dashboard in <span className="text-teal-400 font-bold">{Math.max(0, redirectCountdown)}</span>s...
                    </p>

                    {/* Progress bar */}
                    <div className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${Math.max(0, ((4 - redirectCountdown) / 4) * 100)}%` }}
                        />
                    </div>

                    {/* Manual redirect button */}
                    <button
                        onClick={() => {
                            if (session?.user?.role === 'DOCTOR') {
                                router.push(`/doctor/consultation/${appointmentId}`);
                            }
                        }}
                        className="mt-6 px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all border border-neutral-700 hover:border-neutral-600"
                    >
                        Go to Wrap-Up Now
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col relative overflow-hidden select-none">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-30 bg-gradient-to-b from-black/70 via-black/30 to-transparent">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-lg tracking-wide">
                        Grandview <span className="text-teal-400">Telehealth</span>
                    </div>
                    {connected && (
                        <div className="hidden sm:flex items-center gap-2 text-xs">
                            {/* Connection quality bars */}
                            <div className="flex items-end gap-0.5">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-1 rounded-full transition-all",
                                            i <= qualityBars ? qualityColor.replace('text-', 'bg-') : 'bg-neutral-700',
                                        )}
                                        style={{ height: `${i * 5 + 4}px` }}
                                    />
                                ))}
                            </div>
                            <span className={`font-medium ${qualityColor}`}>
                                {connectionQuality === 'excellent' ? 'HD' : connectionQuality === 'good' ? 'SD' : 'Low'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {connected && (
                        <div className="flex items-center gap-2 bg-neutral-800/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-neutral-700/50">
                            <Clock size={14} className="text-teal-400" />
                            <span className="font-mono text-sm font-medium">{formatDuration(callDuration)}</span>
                        </div>
                    )}
                    <div className="bg-red-500/20 text-red-500 font-medium px-4 py-1.5 rounded-full text-sm animate-pulse border border-red-500/30 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {connected ? 'Live' : 'Connecting'}
                    </div>
                </div>
            </div>

            {/* Camera Permission Error Banner */}
            {cameraError && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-amber-950/90 backdrop-blur-md border border-amber-700/50 rounded-xl px-5 py-3 flex items-center gap-3 max-w-md animate-in slide-in-from-top duration-300 shadow-xl">
                    <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
                    <p className="text-amber-200 text-sm">{cameraError}</p>
                </div>
            )}

            {/* Main Video Area (Remote User / Waiting Room) */}
            <div className="w-full h-screen absolute inset-0 flex items-center justify-center">
                {connecting || reconnecting ? (
                    <div className="flex flex-col items-center gap-6 animate-pulse">
                        <div className="relative">
                            <div className={clsx(
                                "w-28 h-28 rounded-full border-4 animate-spin",
                                !isDoctor ? "border-amber-500 border-r-amber-500/50 border-b-neutral-700 border-l-neutral-700" : "border-teal-500 border-r-teal-500/50 border-b-neutral-700 border-l-neutral-700"
                            )} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center">
                                    <User size={32} className={!isDoctor ? "text-amber-500" : "text-neutral-500"} />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-neutral-300">
                                {reconnecting ? 'Reconnecting...' : !isDoctor ? 'Waiting Room' : `Connecting to ${remoteName}...`}
                            </p>
                            <p className="text-sm text-neutral-500 mt-1 max-w-sm px-4">
                                {reconnecting ? 'Restoring your session' : !isDoctor ? `${remoteName} has not joined the call yet. You can keep this page open, or return to your dashboard.` : 'Setting up secure video channel'}
                            </p>

                            {!isDoctor && !reconnecting && (
                                <button onClick={() => router.push('/patient')} className="mt-8 px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-sm transition-colors border border-neutral-700">
                                    Return to Dashboard
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        {/* Simulated remote video — gradient background with avatar */}
                        <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
                            <div className="relative">
                                {/* Simulated video feed with user avatar */}
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-teal-500/30 to-emerald-500/30 flex items-center justify-center border-4 border-teal-500/20 shadow-2xl shadow-teal-500/10">
                                    {appointment?.doctorImage && !isDoctor ? (
                                        <img src={appointment.doctorImage} alt={remoteName} className="w-full h-full object-cover rounded-full" />
                                    ) : appointment?.patientImage && isDoctor ? (
                                        <img src={appointment.patientImage} alt={remoteName} className="w-full h-full object-cover rounded-full" />
                                    ) : (
                                        <span className="text-5xl md:text-6xl font-bold text-teal-400/80">
                                            {remoteName?.[0] || '?'}
                                        </span>
                                    )}
                                </div>
                                {/* Animated speaking indicator */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div
                                            key={i}
                                            className="w-1 bg-teal-400 rounded-full animate-pulse"
                                            style={{
                                                height: `${Math.random() * 12 + 4}px`,
                                                animationDelay: `${i * 150}ms`,
                                                animationDuration: '0.8s'
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Remote user name overlay */}
                        <div className="absolute bottom-28 md:bottom-32 left-6 md:left-8 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm border border-neutral-700/30">
                            <span className="font-semibold text-lg text-white">{remoteName}</span>
                            <span className="text-teal-400 ml-2 font-medium text-sm">{isDoctor ? '' : 'Host'}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* PiP Video Area (Self) */}
            <div
                className={clsx(
                    "absolute top-20 md:top-24 right-4 md:right-8 bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-700/50 z-20 transition-all duration-300 cursor-pointer",
                    pipExpanded ? "w-64 lg:w-80 aspect-video" : "w-36 lg:w-48 aspect-video"
                )}
                onClick={() => setPipExpanded(!pipExpanded)}
            >
                {videoOff ? (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400">
                                <VideoOff size={20} />
                            </div>
                            <span className="text-xs text-neutral-500">Camera off</span>
                        </div>
                    </div>
                ) : hasCamera ? (
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                ) : cameraError ? (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={20} className="text-amber-500" />
                            <span className="text-[9px] text-amber-400 text-center px-2 leading-tight">No camera</span>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full border-2 border-t-teal-500 border-neutral-700 animate-spin" />
                    </div>
                )}

                {/* Muted indicator */}
                {muted && (
                    <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 shadow-lg">
                        <MicOff size={12} className="text-white" />
                    </div>
                )}

                {/* Expand/collapse icon */}
                <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1">
                    {pipExpanded ? <Minimize2 size={10} className="text-white" /> : <Maximize2 size={10} className="text-white" />}
                </div>

                {/* Self label */}
                <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] text-neutral-300 font-medium">
                    You
                </div>
            </div>

            {/* Chat Sidebar */}
            {showChat && (
                <div className="absolute top-20 right-4 md:right-8 w-80 max-h-[60vh] bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-700/50 shadow-2xl z-30 flex flex-col animate-in slide-in-from-right duration-200"
                    style={{ top: pipExpanded ? '15rem' : '11rem' }}
                >
                    <div className="flex items-center justify-between p-4 border-b border-neutral-800">
                        <h4 className="font-bold text-sm text-white">In-call Messages</h4>
                        <button onClick={() => setShowChat(false)} className="text-neutral-500 hover:text-white transition">
                            <Minimize2 size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[40vh]">
                        {chatMessages.length === 0 ? (
                            <p className="text-sm text-neutral-500 text-center py-8">No messages yet</p>
                        ) : chatMessages.map((msg, i) => {
                            const isMe = (isDoctor && msg.from === 'Doctor') || (!isDoctor && msg.from === 'Patient') || msg.from === 'You';
                            return (
                                <div key={i} className={clsx("text-sm", isMe ? "text-right" : "text-left")}>
                                    <div className={clsx(
                                        "inline-block px-3 py-2 rounded-xl max-w-[80%]",
                                        isMe
                                            ? "bg-teal-600 text-white"
                                            : "bg-neutral-800 text-neutral-200"
                                    )}>
                                        <p>{msg.text}</p>
                                    </div>
                                    <p className="text-[10px] text-neutral-600 mt-1">{msg.time}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className="p-3 border-t border-neutral-800 flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendChatMessage()}
                            placeholder="Type a message..."
                            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-teal-500"
                        />
                        <button
                            onClick={sendChatMessage}
                            className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 bg-neutral-800/80 backdrop-blur-md px-6 md:px-8 py-3 md:py-4 rounded-full shadow-2xl border border-neutral-700/50 z-20">
                {/* Mic Toggle */}
                <button
                    onClick={() => setMuted(!muted)}
                    className={clsx(
                        "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg",
                        muted ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-neutral-700 text-white hover:bg-neutral-600"
                    )}
                    title={muted ? "Unmute" : "Mute"}
                >
                    {muted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* Video Toggle */}
                <button
                    onClick={() => setVideoOff(!videoOff)}
                    className={clsx(
                        "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg",
                        videoOff ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-neutral-700 text-white hover:bg-neutral-600"
                    )}
                    title={videoOff ? "Turn on camera" : "Turn off camera"}
                >
                    {videoOff ? <VideoOff size={20} /> : <Video size={20} />}
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-1" />
                {/* Chat */}
                <button
                    onClick={() => setShowChat(!showChat)}
                    className={clsx(
                        "w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg relative",
                        showChat ? "bg-teal-600 text-white" : "bg-neutral-700 text-white hover:bg-neutral-600"
                    )}
                    title="Chat"
                >
                    <MessageSquare size={20} />
                    {chatMessages.length > 0 && !showChat && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 border-2 border-neutral-800 rounded-full text-[9px] flex items-center justify-center font-bold">
                            {chatMessages.length}
                        </span>
                    )}
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-1" />

                {/* Reconnect button (if quality is poor) */}
                {connectionQuality === 'poor' && connected && (
                    <button
                        onClick={simulateReconnect}
                        className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 transition-all hover:-translate-y-1 shadow-lg"
                        title="Reconnect"
                    >
                        <WifiOff size={20} />
                    </button>
                )}

                {/* End Call */}
                <button
                    onClick={endCall}
                    className="h-11 md:h-12 rounded-full flex items-center justify-center bg-red-600 text-white transition-all hover:bg-red-700 hover:shadow-red-500/30 shadow-lg px-5 md:px-6 font-bold gap-2 hover:-translate-y-1"
                    title="End call"
                >
                    <PhoneOff size={18} />
                    <span className="hidden sm:inline text-sm">End</span>
                </button>
            </div>

            {/* Patient issue context (visible to doctor) */}
            {isDoctor && appointment?.issueDescription && connected && (
                <div className="absolute bottom-24 md:bottom-28 left-4 md:left-8 bg-neutral-900/90 backdrop-blur-sm rounded-xl px-4 py-3 border border-neutral-700/30 max-w-xs z-20">
                    <p className="text-[10px] font-bold text-teal-400 uppercase tracking-wider mb-1">Patient's Issue</p>
                    <p className="text-xs text-neutral-300 leading-relaxed">{appointment.issueDescription}</p>
                </div>
            )}

            {/* Doctor Specific Actions (Floating Left - View Reports only) */}
            {isDoctor && connected && (
                <div className="absolute bottom-24 md:bottom-28 left-4 md:left-8 flex flex-col gap-3 z-30 animate-in slide-in-from-left duration-500 delay-1000 fill-mode-both">
                    <button
                        onClick={() => setShowReports(true)}
                        className="bg-neutral-800/80 hover:bg-neutral-700/80 backdrop-blur-md border border-neutral-700/50 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 transition-all hover:scale-105 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <FileText size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold">View Reports</p>
                            <p className="text-[10px] text-neutral-400 font-medium leading-tight">Patient documents</p>
                        </div>
                    </button>
                </div>
            )}

            {/* Modals */}
            {isDoctor && (
                <PatientReportsModal
                    appointmentId={appointmentId}
                    isOpen={showReports}
                    onClose={() => setShowReports(false)}
                />
            )}

            {/* AI Live Possibilities Panel (auto-displayed for doctor) */}
            {isDoctor && connected && appointmentId && (
                <LivePossibilitiesPanel
                    appointmentId={appointmentId}
                    isConnected={connected}
                />
            )}

            {/* Live Transcription Panel */}
            {connected && appointmentId && (
                <LiveTranscription
                    appointmentId={appointmentId}
                    isDoctor={isDoctor}
                    isConnected={connected}
                />
            )}
        </div>
    );
}
