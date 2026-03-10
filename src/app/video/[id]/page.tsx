"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare,
    MonitorUp, Maximize2, Minimize2, Clock, User, Wifi, WifiOff
} from "lucide-react";
import clsx from "clsx";

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
    const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Resolve params
    useEffect(() => {
        params.then(p => setAppointmentId(p.id));
    }, [params]);

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
                    }
                }
            } catch (e) {
                console.error("Failed to fetch appointment", e);
            }
        };

        fetchAppointment();
    }, [appointmentId]);

    // Simulate WebRTC connection
    useEffect(() => {
        if (!appointmentId) return;

        const timer = setTimeout(() => {
            setConnecting(false);
            setConnected(true);

            // Signal answer if patient
            if (session?.user?.role !== 'DOCTOR') {
                fetch('/api/video/signal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId, action: 'ANSWER' })
                }).catch(() => { });
            }
        }, 2500);

        return () => clearTimeout(timer);
    }, [appointmentId, session]);

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
        try {
            await fetch('/api/video/signal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId, action: 'END' })
            });
        } catch (e) { }

        if (durationRef.current) {
            clearInterval(durationRef.current);
        }

        // Navigate back based on role
        if (session?.user?.role === 'DOCTOR') {
            router.push(`/doctor/consultation/${appointmentId}`);
        } else {
            router.push('/patient');
        }
    };

    const simulateReconnect = () => {
        setReconnecting(true);
        setConnected(false);
        setTimeout(() => {
            setReconnecting(false);
            setConnected(true);
        }, 3000);
    };

    const sendChatMessage = () => {
        if (!chatInput.trim()) return;
        setChatMessages(prev => [...prev, {
            from: session?.user?.role === 'DOCTOR' ? 'Doctor' : 'You',
            text: chatInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setChatInput("");
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

            {/* Main Video Area (Remote User) */}
            <div className="w-full h-screen absolute inset-0 flex items-center justify-center">
                {connecting || reconnecting ? (
                    <div className="flex flex-col items-center gap-6 animate-pulse">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full border-4 border-t-teal-500 border-r-teal-500/50 border-b-neutral-700 border-l-neutral-700 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center">
                                    <User size={32} className="text-neutral-500" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium text-neutral-300">
                                {reconnecting ? 'Reconnecting...' : `Connecting to ${remoteName}...`}
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">
                                {reconnecting ? 'Restoring your session' : 'Setting up secure video channel'}
                            </p>
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
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center text-neutral-300 text-sm font-bold">
                            {session?.user?.name?.[0] || 'Y'}
                        </div>
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
                        <h4 className="font-bold text-sm">In-call Messages</h4>
                        <button onClick={() => setShowChat(false)} className="text-neutral-500 hover:text-white transition">
                            <Minimize2 size={16} />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[40vh]">
                        {chatMessages.length === 0 ? (
                            <p className="text-sm text-neutral-500 text-center py-8">No messages yet</p>
                        ) : chatMessages.map((msg, i) => (
                            <div key={i} className={clsx("text-sm", msg.from === 'You' || msg.from === 'Doctor' ? "text-right" : "")}>
                                <div className={clsx(
                                    "inline-block px-3 py-2 rounded-xl max-w-[80%]",
                                    msg.from === 'You' || (isDoctor && msg.from === 'Doctor')
                                        ? "bg-teal-600 text-white"
                                        : "bg-neutral-800 text-neutral-200"
                                )}>
                                    <p>{msg.text}</p>
                                </div>
                                <p className="text-[10px] text-neutral-600 mt-1">{msg.time}</p>
                            </div>
                        ))}
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

                {/* Screen Share */}
                <button
                    className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-neutral-700 text-white transition-all hover:bg-neutral-600 hover:-translate-y-1 shadow-lg"
                    title="Share screen"
                >
                    <MonitorUp size={20} />
                </button>

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
        </div>
    );
}
