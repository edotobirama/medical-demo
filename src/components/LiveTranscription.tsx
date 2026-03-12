'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Languages, Mic, MicOff, FileText, ChevronDown, ChevronUp,
    Globe, Sparkles, Loader2
} from 'lucide-react';
import clsx from 'clsx';

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
}

export default function LiveTranscription({ appointmentId, isDoctor, isConnected }: LiveTranscriptionProps) {
    const [isListening, setIsListening] = useState(false);
    const [selectedLang, setSelectedLang] = useState('en-US');
    const [showLangPicker, setShowLangPicker] = useState(false);
    const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
    const [interimText, setInterimText] = useState('');
    const [expanded, setExpanded] = useState(true);
    const [saving, setSaving] = useState(false);
    const recognitionRef = useRef<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [transcripts, interimText]);

    // Load existing transcripts
    useEffect(() => {
        if (!appointmentId) return;

        const loadTranscripts = async () => {
            try {
                const res = await fetch(`/api/transcription?appointmentId=${appointmentId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.transcripts?.length > 0) {
                        setTranscripts(data.transcripts.map((t: any) => ({
                            id: t.id,
                            text: t.originalText,
                            translatedText: t.englishText,
                            speaker: t.speakerRole,
                            language: t.language,
                            timestamp: new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isFinal: true
                        })));
                    }
                }
            } catch (e) {
                console.error('Failed to load transcripts:', e);
            }
        };

        loadTranscripts();
        const interval = setInterval(loadTranscripts, 3000);
        return () => clearInterval(interval);
    }, [appointmentId]);

    // Start/stop speech recognition
    const toggleListening = useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, selectedLang]);

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
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
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript;
                } else {
                    interim += transcript;
                }
            }

            setInterimText(interim);

            if (final) {
                const entry: TranscriptEntry = {
                    text: final,
                    speaker: isDoctor ? 'DOCTOR' : 'PATIENT',
                    language: selectedLang.split('-')[0],
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isFinal: true
                };

                setTranscripts(prev => [...prev, entry]);
                setInterimText('');

                // Save to server
                saveTranscript(final, selectedLang.split('-')[0]);
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'aborted') {
                // Safely ignore aborted errors; this happens intentionally when stop() is called
                return;
            }
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                alert('Microphone permission denied. Please allow microphone access.');
            }
        };

        recognition.onend = () => {
            // Auto-restart if still in listening mode
            if (recognitionRef.current && isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    // Already started
                }
            }
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
            setIsListening(true);
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null; // Prevent auto-restart
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
        setInterimText('');
    };

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onend = null;
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }
        };
    }, []);

    const saveTranscript = async (text: string, language: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/transcription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    text,
                    language,
                    speakerRole: isDoctor ? 'DOCTOR' : 'PATIENT'
                })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.transcript?.englishText) {
                    // Update the last transcript with the translation
                    setTranscripts(prev => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        if (last && last.text === text) {
                            last.translatedText = data.transcript.englishText;
                            last.id = data.transcript.id;
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
    };

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
                        {isListening && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Active
                            </span>
                        )}
                        {saving && <Loader2 size={12} className="text-violet-400 animate-spin" />}
                    </div>
                    {expanded ? <ChevronDown size={16} className="text-neutral-400" /> : <ChevronUp size={16} className="text-neutral-400" />}
                </div>

                {expanded && (
                    <>
                        {/* Language Selector */}
                        <div className="px-4 pb-2 flex items-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowLangPicker(!showLangPicker); }}
                                className="flex items-center gap-2 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white hover:bg-neutral-700 transition"
                            >
                                <Globe size={12} className="text-violet-400" />
                                <span>{currentLang.flag} {currentLang.label}</span>
                                <ChevronDown size={10} />
                            </button>

                            {/* Toggle Listening */}
                            <button
                                onClick={toggleListening}
                                disabled={!isConnected}
                                className={clsx(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition",
                                    isListening
                                        ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                                        : "bg-violet-500/20 text-violet-400 border border-violet-500/30 hover:bg-violet-500/30"
                                )}
                            >
                                {isListening ? <MicOff size={12} /> : <Mic size={12} />}
                                {isListening ? 'Stop' : 'Start'}
                            </button>
                        </div>

                        {/* Language Picker Dropdown */}
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
                                        {isListening ? 'Listening... Start speaking' : 'Click "Start" to begin transcription'}
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

                                    {/* Interim (currently being spoken) */}
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
