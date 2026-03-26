'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Languages, Mic, MicOff, FileText, ChevronDown, ChevronUp,
    Globe, Sparkles, Loader2, WifiOff
} from 'lucide-react';
import clsx from 'clsx';
import { useCustomAlert } from '@/context/AlertContext';

interface TranscriptEntry {
    id?: string;
    text: string;
    translatedText?: string;
    speaker: string;
    language: string;
    timestamp: string;
    isFinal: boolean;
}

const SUPPORTED_LANGUAGES = [
    { code: 'en-US', label: 'English', flag: '🇺🇸' },
    { code: 'es-ES', label: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', label: 'French', flag: '🇫🇷' },
    { code: 'de-DE', label: 'German', flag: '🇩🇪' },
    { code: 'hi-IN', label: 'Hindi', flag: '🇮🇳' },
    { code: 'ta-IN', label: 'Tamil', flag: '🇮🇳' },
    { code: 'te-IN', label: 'Telugu', flag: '🇮🇳' },
    { code: 'bn-IN', label: 'Bengali', flag: '🇮🇳' },
    { code: 'mr-IN', label: 'Marathi', flag: '🇮🇳' },
    { code: 'ur-PK', label: 'Urdu', flag: '🇵🇰' },
    { code: 'ar-SA', label: 'Arabic', flag: '🇸🇦' },
    { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
    { code: 'ja-JP', label: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', label: 'Korean', flag: '🇰🇷' },
    { code: 'pt-BR', label: 'Portuguese', flag: '🇧🇷' },
    { code: 'ru-RU', label: 'Russian', flag: '🇷🇺' },
];

interface LiveTranscriptionProps {
    appointmentId: string;
    isDoctor: boolean;
    isConnected: boolean;
    localStream?: MediaStream | null;  // Shared stream from video page
}

export default function LiveTranscription({ appointmentId, isDoctor, isConnected, localStream }: LiveTranscriptionProps) {
    const [isListening, setIsListening] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
    const [interimText, setInterimText] = useState('');
    const [expanded, setExpanded] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Status Trackers
    const [engineStatus, setEngineStatus] = useState<'connecting' | 'connected' | 'reconnecting' | 'offline'>('offline');
    const [sessionId, setSessionId] = useState<string>('');
    const [bufferCount, setBufferCount] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const audioBufferRef = useRef<Blob[]>([]);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    // Local role — derived from the prop set at server-render time, never from cookies
    const myRole = isDoctor ? 'DOCTOR' : 'PATIENT';

    const { showAlert } = useCustomAlert();

    // 1. Session & State Management: Persistence on Reload
    useEffect(() => {
        if (!appointmentId) return;
        const sessionKey = `transcription_session_${appointmentId}`;
        let sid = sessionStorage.getItem(sessionKey);
        if (!sid) {
            sid = crypto.randomUUID();
            sessionStorage.setItem(sessionKey, sid);
        }
        setSessionId(sid);
    }, [appointmentId]);

    // Scroll to bottom on new transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts, interimText]);

    // 2. History Synchronization: Poll every 3s — deduplicate by ID
    const loadTranscripts = useCallback(async () => {
        if (!appointmentId) return;
        try {
            const res = await fetch(`/api/transcription?appointmentId=${appointmentId}&t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.transcripts?.length > 0) {
                    setTranscripts(prev => {
                        const existingIds = new Set(prev.map(t => t.id).filter(Boolean));
                        const newEntries = data.transcripts
                            .filter((t: any) => !existingIds.has(t.id))
                            .map((t: any) => ({
                                id: t.id,
                                text: t.originalText,
                                translatedText: t.englishText,
                                speaker: t.speakerRole || 'UNKNOWN', // ✅ FIXED
                                language: t.language,
                                timestamp: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                isFinal: true
                            }));
                        if (newEntries.length === 0) return prev;
                        return [...prev, ...newEntries].sort((a: TranscriptEntry, b: TranscriptEntry) =>
                            a.timestamp.localeCompare(b.timestamp)
                        );
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load transcripts history:', e);
        }
    }, [appointmentId]);

    useEffect(() => {
        loadTranscripts();
        const interval = setInterval(loadTranscripts, 3000);
        return () => clearInterval(interval);
    }, [loadTranscripts]);

    const saveTranscript = useCallback(async (text: string, language: string) => {
        if (!text.trim()) return;
        setSaving(true);
        try {
            const res = await fetch('/api/transcription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    text,
                    language,
                    speakerRole: myRole,  // Always send our local role
                    sessionId
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.transcript?.id) {
                    setTranscripts(prev => {
                        const updated = [...prev];
                        // Find the matching local entry by text and update its ID + lock role
                        const idx = updated.findLastIndex(e => e.text === text && !e.id);
                        if (idx !== -1) {
                            updated[idx] = {
                                ...updated[idx],
                                id: data.transcript.id,
                                speaker: myRole,
                                ...(data.transcript.englishText ? { translatedText: data.transcript.englishText } : {})
                            };
                        }
                        return updated;
                    });
                }
            }
        } catch (e) {
            console.error('Failed to save transcript:', e);
        } finally {
            setSaving(false);
        }
    }, [appointmentId, myRole, sessionId]);

    // 3. Audio Buffer Management: Network flush
    const processBufferedAudio = useCallback(() => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        while (audioBufferRef.current.length > 0) {
            const chunk = audioBufferRef.current.shift();
            if (chunk) {
                wsRef.current.send(chunk);
            }
        }
        setBufferCount(0);
    }, []);

    // 4. WebSocket Stability & Automated Engine Restart
    const connectWebSocket = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN || engineStatus === 'connecting') return;
        
        setEngineStatus('connecting');
        const WSS_URL = process.env.NEXT_PUBLIC_WS_TRANSCRIPTION_URL || 'wss://echo.websocket.events';
        
        try {
            const ws = new WebSocket(`${WSS_URL}?sessionId=${sessionId}&lang=${selectedLang}`);
            
            ws.onopen = () => {
                setEngineStatus('connected');
                // Send any buffered chunks immediately on reconnect
                processBufferedAudio();
            };

            ws.onmessage = (event) => {
                // If a real WS server responds with transcripion
                try {
                    const data = JSON.parse(event.data);
                    if (data.text) setInterimText(data.text);
                    if (data.isFinal && data.text) {
                        const entry: TranscriptEntry = {
                            text: data.text,
                            speaker: isDoctor ? 'DOCTOR' : 'PATIENT',
                            language: selectedLang.split('-')[0],
                            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isFinal: true
                        };
                        setTranscripts(p => [...p, entry]);
                        setInterimText('');
                        saveTranscript(data.text, selectedLang.split('-')[0]);
                    }
                } catch {
                    // Ignore echo
                }
            };

            ws.onclose = () => {
                setEngineStatus('offline');
                // Automated Engine Restart
                reconnectTimeoutRef.current = setTimeout(() => {
                    setEngineStatus('reconnecting');
                    connectWebSocket();
                }, 2000);
            };

            ws.onerror = () => {
                ws.close();
            };

            wsRef.current = ws;
        } catch (e) {
            console.error('WebSocket connection failed:', e);
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
        }
    }, [sessionId, selectedLang, isDoctor, saveTranscript, processBufferedAudio, engineStatus]);

    // Primary transcription engine: Web Speech API.
    // MUST be defined before startAudioStream (which depends on it).
    const startFallbackRecognition = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn('Web Speech API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += t;
                else interim += t;
            }
            setInterimText(interim);
            if (final) {
                const entry: TranscriptEntry = {
                    text: final,
                    speaker: myRole,
                    language: selectedLang.split('-')[0],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isFinal: true
                };
                setTranscripts(prev => [...prev, entry]);
                setInterimText('');
                saveTranscript(final, selectedLang.split('-')[0]);
            }
        };

        recognition.onerror = (e: any) => {
            if (e.error === 'aborted' || e.error === 'no-speech' || e.error === 'network') return;
            console.warn('Speech recognition error:', e.error);
        };

        recognition.onend = () => {
            // Auto-restart while listening is active (recognitionRef cleared on stop)
            if (recognitionRef.current) {
                try { recognition.start(); } catch (_) {}
            }
        };

        recognitionRef.current = recognition;
        try { recognition.start(); } catch (e) { console.warn('Speech recognition start failed:', e); }
    }, [selectedLang, myRole, saveTranscript]);

    const stopAudioStream = useCallback(() => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            mediaRecorderRef.current = null;
        }
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            try { recognitionRef.current.stop(); } catch(e){}
            recognitionRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        setIsListening(false);
        setEngineStatus('offline');
        setInterimText('');
    }, []);

    // Two independent transcription paths — a failure in path 2 never
    // prevents path 1 (the real engine) from starting.
    const startAudioStream = useCallback(async () => {
        setIsListening(true);

        // Path 1: Web Speech API (primary — always starts)
        startFallbackRecognition();

        // Path 2: MediaRecorder → WebSocket (optional/secondary)
        try {
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/webm')
                    ? 'audio/webm'
                    : 'audio/ogg';
            const recorder = new MediaRecorder(audioStream, { mimeType });

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    if (wsRef.current?.readyState === WebSocket.OPEN) {
                        wsRef.current.send(e.data);
                    } else {
                        audioBufferRef.current.push(e.data);
                        setBufferCount(audioBufferRef.current.length);
                    }
                }
            };

            recorder.start(500);
            mediaRecorderRef.current = recorder;
            connectWebSocket();
        } catch (e) {
            // Non-critical — Speech Recognition (path 1) is still running
            console.warn('MediaRecorder unavailable (non-critical):', e);
        }
    }, [startFallbackRecognition, connectWebSocket]);

    useEffect(() => {
        if (isConnected && !isListening) {
            startAudioStream();
        } else if (!isConnected && isListening) {
            stopAudioStream();
        }
    }, [isConnected, isListening, startAudioStream, stopAudioStream]);

    useEffect(() => {
        return () => stopAudioStream();
    }, [stopAudioStream]);

    const currentLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

    return (
        <div className="absolute bottom-24 md:bottom-28 right-4 md:right-8 z-30 w-80 md:w-96">
            <div className="bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-800/50 transition"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-2">
                        <FileText size={16} className="text-violet-400" />
                        <h4 className="text-sm font-bold text-white">Live Transcription</h4>
                        
                        {/* WSS Status Indicator */}
                        {engineStatus === 'connected' && isListening && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Live WSS
                            </span>
                        )}
                        {engineStatus === 'reconnecting' && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <WifiOff size={10} className="animate-pulse" />
                                Buffering ({bufferCount})
                            </span>
                        )}

                        {saving && <Loader2 size={12} className="text-violet-400 animate-spin" />}
                    </div>
                    {expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronUp size={16} className="text-neutral-400" />}
                </div>

                {expanded && (
                    <>
                        <div className="px-4 pb-2 flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowLangPicker(!showLangPicker); }}
                                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white hover:bg-neutral-700 transition"
                            >
                                <Globe size={12} className="text-violet-400" />
                                <span>{currentLang.flag} {currentLang.label}</span>
                                <ChevronDown size={10} />
                            </button>
                            <div className="ml-auto text-[9px] text-neutral-500 bg-neutral-800/80 px-2 py-1 flex gap-1 items-center rounded-md border border-neutral-700/50">
                                <span className={wsRef.current?.readyState === WebSocket.OPEN ? 'text-emerald-400' : 'text-amber-400'}>
                                    •
                                </span> Session: {sessionId.substring(0, 6)}...
                            </div>
                        </div>

                        {showLangPicker && (
                            <div className="mx-4 mb-2 bg-neutral-800 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto">
                                {SUPPORTED_LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => { setSelectedLang(lang.code); setShowLangPicker(false); }}
                                        className={clsx(
                                            "w-full text-left px-3 py-2 text-xs hover:bg-neutral-700 transition flex items-center gap-2",
                                            selectedLang === lang.code ? "text-violet-400 bg-violet-500/10" : "text-neutral-300"
                                        )}
                                    >
                                        <span>{lang.flag}</span>
                                        <span>{lang.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Transcript Display */}
                        <div ref={scrollRef} className="px-4 pb-3 max-h-48 overflow-y-auto space-y-2">
                            {transcripts.length === 0 && !interimText ? (
                                <div className="text-center py-6">
                                    <Sparkles className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                                    <p className="text-xs text-neutral-500">
                                        {isListening ? 'Streaming audio... Start speaking' : 'Waiting for conversation to begin...'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {transcripts.map((entry, i) => (
                                        <div key={i} className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <span className={clsx(
                                                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                    entry.speaker === 'DOCTOR'
                                                        ? "text-teal-400 bg-teal-500/10"
                                                        : "text-blue-400 bg-blue-500/10"
                                                )}>
                                                    {entry.speaker}
                                                </span>
                                                <span className="text-[9px] text-neutral-600">{entry.timestamp}</span>
                                                {entry.language !== 'en' && (
                                                    <span className="text-[9px] text-violet-500 bg-violet-500/10 px-1 rounded">
                                                        {entry.language.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-neutral-200 leading-relaxed">{entry.text}</p>
                                            {entry.translatedText && entry.language !== 'en' && (
                                                <p className="text-[11px] text-violet-300/80 italic flex items-center gap-1 mt-0.5">
                                                    <Languages size={10} className="flex-shrink-0" />
                                                    {entry.translatedText}
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {interimText && (
                                        <div className="space-y-0.5 opacity-60">
                                            <p className="text-xs text-neutral-300 italic">{interimText}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
