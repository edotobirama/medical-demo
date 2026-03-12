'use client';

import { useState, useEffect, useRef } from 'react';
import { Lightbulb, RefreshCcw, Activity, X, Loader2, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface LivePossibilitiesData {
    differentials: string[];
    suggestedQuestions: string[];
    recommendedTests: string[];
}

export default function LivePossibilitiesModal({
    appointmentId,
    isOpen,
    onClose
}: {
    appointmentId: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [possibilities, setPossibilities] = useState<LivePossibilitiesData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcriptHash, setTranscriptHash] = useState('');
    const fetchDebounceRef = useRef<NodeJS.Timeout | null>(null);

    // Automated Contextual Trigger: Poll transcripts for natural pauses
    useEffect(() => {
        if (!isOpen || !appointmentId) return;

        const checkTranscripts = async () => {
            try {
                const res = await fetch(`/api/transcription?appointmentId=${appointmentId}`);
                if (res.ok) {
                    const data = await res.json();
                    const newHash = data.transcripts.map((t: any) => t.id).join(',');

                    setTranscriptHash(prev => {
                        if (prev && prev !== newHash) {
                            // Transcripts changed! Start a debounce timer for a natural pause
                            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
                            fetchDebounceRef.current = setTimeout(() => {
                                fetchPossibilities();
                            }, 4000); // 4 second natural pause detection
                        }
                        return newHash;
                    });
                }
            } catch (e) { }
        };

        checkTranscripts();
        const interval = setInterval(checkTranscripts, 3000);
        return () => {
            clearInterval(interval);
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, [isOpen, appointmentId]);

    const fetchPossibilities = async () => {
        if (!isOpen || !appointmentId) return;

        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/reports/possibilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId })
            });

            if (res.ok) {
                const data = await res.json();
                setPossibilities(data.possibilities);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to fetch possibilities');
            }
        } catch (e) {
            setError('Network error getting live possibilities');
        } finally {
            setLoading(false);
        }
    };

    // Fetch when opened
    useEffect(() => {
        if (isOpen && !possibilities) {
            fetchPossibilities();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-amber-400/20 animate-pulse" />
                            <Lightbulb size={20} className="relative z-10" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                AI Live Possibilities
                                <span className="text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Beta</span>
                            </h3>
                            <p className="text-xs text-neutral-400 font-medium">Auto-generated from ongoing transcript</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchPossibilities}
                            disabled={loading}
                            className="px-3 py-2 bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/30 disabled:opacity-50 rounded-lg text-teal-400 transition flex items-center gap-2"
                            title="Manually trigger AI analysis on the current transcript"
                        >
                            <HelpCircle size={16} className={loading ? 'animate-pulse' : ''} />
                            <span className="text-xs font-bold sm:inline hidden">{loading ? 'Analyzing...' : 'Help'}</span>
                        </button>
                        <div className="w-px h-6 bg-neutral-800" />
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-black/20">
                    {loading && !possibilities ? (
                        <div className="flex flex-col items-center justify-center h-48 gap-4">
                            <div className="relative w-16 h-16 flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
                                <Sparkles className="text-amber-500 animate-pulse" size={24} />
                            </div>
                            <p className="text-sm font-bold text-neutral-300">Analyzing live transcript...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="font-bold text-red-500 text-sm">Analysis Failed</h4>
                                <p className="text-xs text-red-400 mt-1">{error}</p>
                            </div>
                        </div>
                    ) : possibilities ? (
                        <div className="space-y-6">
                            {/* Differential Diagnoses */}
                            <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl overflow-hidden p-5">
                                <h4 className="flex items-center gap-2 font-bold text-amber-400 mb-4 text-sm uppercase tracking-wider">
                                    <Activity size={16} /> Differential Diagnoses
                                </h4>
                                {possibilities.differentials.length > 0 ? (
                                    <ul className="space-y-2">
                                        {possibilities.differentials.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 bg-neutral-900 border border-neutral-800 p-3 rounded-lg">
                                                <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/20 text-amber-500 text-[10px] font-bold">
                                                    {i + 1}
                                                </div>
                                                <span className="text-sm text-neutral-200 font-medium leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-neutral-500 italic">No strong differentials identified yet.</p>
                                )}
                            </div>

                            {/* Suggested Questions */}
                            <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl overflow-hidden p-5">
                                <h4 className="flex items-center gap-2 font-bold text-teal-400 mb-4 text-sm uppercase tracking-wider">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    Suggested Questions to Ask
                                </h4>
                                {possibilities.suggestedQuestions.length > 0 ? (
                                    <div className="space-y-3">
                                        {possibilities.suggestedQuestions.map((q, i) => (
                                            <div key={i} className="bg-neutral-900/80 border-l-2 border-teal-500 px-4 py-3 rounded-r-lg text-sm text-neutral-300 font-medium">
                                                "{q}"
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500 italic">No specific questions suggested at this time.</p>
                                )}
                            </div>

                            {/* Recommended Tests */}
                            <div className="bg-neutral-800/40 border border-neutral-700/50 rounded-xl overflow-hidden p-5">
                                <h4 className="flex items-center gap-2 font-bold text-blue-400 mb-4 text-sm uppercase tracking-wider">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                    Recommended Lab/Clinical Tests
                                </h4>
                                {possibilities.recommendedTests.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {possibilities.recommendedTests.map((test, i) => (
                                            <span key={i} className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-bold">
                                                {test}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500 italic">No specific tests recommended yet.</p>
                                )}
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
