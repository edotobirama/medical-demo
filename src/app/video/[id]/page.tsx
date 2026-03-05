"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, MonitorUp } from "lucide-react";
import clsx from "clsx";

export default function VideoCallPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [muted, setMuted] = useState(false);
    const [videoOff, setVideoOff] = useState(false);
    const [connecting, setConnecting] = useState(true);

    useEffect(() => {
        // Simulate WebRTC connection delay
        const timer = setTimeout(() => {
            setConnecting(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const endCall = () => {
        router.push("/patient");
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <div className="font-bold text-lg tracking-wide">
                    Grandview <span className="text-teal-400">Telehealth</span>
                </div>
                <div className="bg-red-500/20 text-red-500 font-medium px-4 py-1.5 rounded-full text-sm animate-pulse border border-red-500/30">
                    Recording Live
                </div>
            </div>

            {/* Main Video Area (Doctor) */}
            <div className="w-full h-full absolute inset-0 flex items-center justify-center object-cover">
                {connecting ? (
                    <div className="flex flex-col items-center gap-4 animate-pulse">
                        <div className="w-24 h-24 rounded-full border-4 border-t-teal-500 border-neutral-700 animate-spin"></div>
                        <p className="text-lg font-medium text-neutral-400">Connecting to Doctor...</p>
                    </div>
                ) : (
                    <div className="w-full h-full relative">
                        <img
                            src="/images/services/treatment_surgery.png"
                            alt="Doctor Video Stream"
                            className="w-full h-full object-cover opacity-80"
                        />
                        <div className="absolute bottom-32 left-8 bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">
                            <span className="font-semibold text-lg text-white">Dr. Specialist</span>
                            <span className="text-teal-400 ml-2 font-medium text-sm">Host</span>
                        </div>
                    </div>
                )}
            </div>

            {/* PiP Video Area (Patient) */}
            <div className="absolute top-24 right-8 w-48 lg:w-72 aspect-video bg-neutral-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-700/50 z-20 transition-all hover:scale-105">
                {videoOff ? (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800">
                        <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400">
                            You
                        </div>
                    </div>
                ) : (
                    <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                        alt="Your Video Stream"
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                )}
                {muted && (
                    <div className="absolute top-3 right-3 bg-red-500 rounded-full p-1 shadow-lg">
                        <MicOff size={14} className="text-white" />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-neutral-800/80 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl border border-neutral-700/50 z-20">
                <button
                    onClick={() => setMuted(!muted)}
                    className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg",
                        muted ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-neutral-700 text-white hover:bg-neutral-600"
                    )}
                >
                    {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>

                <button
                    onClick={() => setVideoOff(!videoOff)}
                    className={clsx(
                        "w-12 h-12 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 shadow-lg",
                        videoOff ? "bg-red-500/20 text-red-500 border border-red-500/50" : "bg-neutral-700 text-white hover:bg-neutral-600"
                    )}
                >
                    {videoOff ? <VideoOff size={22} /> : <Video size={22} />}
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-2"></div>

                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-neutral-700 text-white transition-all hover:bg-neutral-600 hover:-translate-y-1 shadow-lg">
                    <MonitorUp size={22} />
                </button>

                <button className="w-12 h-12 rounded-full flex items-center justify-center bg-neutral-700 text-white transition-all hover:bg-neutral-600 hover:-translate-y-1 shadow-lg relative">
                    <MessageSquare size={22} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-teal-500 border-2 border-neutral-800 rounded-full"></span>
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-2"></div>

                <button
                    onClick={endCall}
                    className="w-16 h-12 rounded-full flex items-center justify-center bg-red-600 text-white transition-all hover:bg-red-700 hover:shadow-red-500/30 shadow-lg px-8 font-bold gap-2"
                >
                    <PhoneOff size={20} /> End
                </button>
            </div>
        </div>
    );
}
