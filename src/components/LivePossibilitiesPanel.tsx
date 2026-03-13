'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Lightbulb, Activity, X, Sparkles, ChevronDown, ChevronUp,
    Stethoscope, FlaskConical, MessageCircleQuestion, TrendingUp,
    Brain, Pill, AlertTriangle, CheckCircle2, Clock, Zap, RefreshCcw
} from 'lucide-react';
import clsx from 'clsx';

interface PossibilityItem {
    name: string;
    confidence: 'high' | 'medium' | 'low';
    reasoning?: string;
}

interface LivePossibilitiesData {
    differentials: PossibilityItem[];
    suggestedQuestions: string[];
    recommendedTests: string[];
    treatmentPaths: string[];
    keySymptoms: string[];
    urgencyLevel: 'routine' | 'moderate' | 'urgent';
    analysisNote: string;
}

interface LivePossibilitiesPanelProps {
    appointmentId: string;
    isConnected: boolean;
}

export default function LivePossibilitiesPanel({ appointmentId, isConnected }: LivePossibilitiesPanelProps) {
    const [possibilities, setPossibilities] = useState<LivePossibilitiesData | null>(null);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [activeTab, setActiveTab] = useState<'diagnoses' | 'questions' | 'tests' | 'treatments'>('diagnoses');
    const [analysisCount, setAnalysisCount] = useState(0);
    const [lastUpdated, setLastUpdated] = useState<string>('');
    const [transcriptHash, setTranscriptHash] = useState('');
    const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(true);
    const fetchDebounceRef = useRef<NodeJS.Timeout | null>(null);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const initialFetchDone = useRef(false);

    const fetchPossibilities = useCallback(async () => {
        if (!appointmentId) return;

        setLoading(true);
        try {
            const res = await fetch('/api/reports/possibilities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId })
            });

            if (res.ok) {
                const data = await res.json();
                // Transform the API response to our enriched format
                const enriched = enrichPossibilities(data.possibilities);
                setPossibilities(enriched);
                setAnalysisCount(prev => prev + 1);
                setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            }
        } catch (e) {
            console.error('Live possibilities fetch error:', e);
        } finally {
            setLoading(false);
        }
    }, [appointmentId]);

    // Enrich the basic API response with confidence levels and additional fields
    function enrichPossibilities(raw: any): LivePossibilitiesData {
        if (!raw) {
            return getEmptyState();
        }

        const confidenceLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];
        const differentials: PossibilityItem[] = (raw.differentials || []).map((d: any, i: number) => {
            if (typeof d === 'string') {
                return {
                    name: d,
                    confidence: confidenceLevels[Math.min(i, 2)],
                    reasoning: undefined
                };
            }
            return {
                name: d.name || d,
                confidence: d.confidence || confidenceLevels[Math.min(i, 2)],
                reasoning: d.reasoning
            };
        });

        return {
            differentials,
            suggestedQuestions: raw.suggestedQuestions || [],
            recommendedTests: raw.recommendedTests || [],
            treatmentPaths: raw.treatmentPaths || raw.treatments || [
                'Consider empirical treatment while awaiting test results',
                'Symptomatic relief (pain management, hydration)',
                'Follow-up appointment in 1-2 weeks if symptoms persist'
            ],
            keySymptoms: raw.keySymptoms || [],
            urgencyLevel: raw.urgencyLevel || 'routine',
            analysisNote: raw.analysisNote || 'Analysis based on current transcript data'
        };
    }

    function getEmptyState(): LivePossibilitiesData {
        return {
            differentials: [],
            suggestedQuestions: ['Begin by asking the patient about their primary symptoms'],
            recommendedTests: [],
            treatmentPaths: [],
            keySymptoms: [],
            urgencyLevel: 'routine',
            analysisNote: 'Waiting for conversation data...'
        };
    }

    // Auto-analyze: Poll transcripts for changes, debounce before analysis
    useEffect(() => {
        if (!isConnected || !appointmentId || !isAutoAnalyzing) return;

        const checkTranscripts = async () => {
            try {
                const res = await fetch(`/api/transcription?appointmentId=${appointmentId}`);
                if (res.ok) {
                    const data = await res.json();
                    const newHash = data.transcripts?.map((t: any) => t.id).join(',') || '';

                    setTranscriptHash(prev => {
                        if (prev !== newHash && newHash) {
                            // Transcripts changed — debounce analysis to detect natural pauses
                            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
                            fetchDebounceRef.current = setTimeout(() => {
                                fetchPossibilities();
                            }, 5000); // 5s natural pause detection
                        }
                        return newHash;
                    });
                }
            } catch (e) { }
        };

        // Initial fetch
        if (!initialFetchDone.current) {
            initialFetchDone.current = true;
            fetchPossibilities();
        }

        checkTranscripts();
        pollIntervalRef.current = setInterval(checkTranscripts, 4000);

        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (fetchDebounceRef.current) clearTimeout(fetchDebounceRef.current);
        };
    }, [isConnected, appointmentId, isAutoAnalyzing, fetchPossibilities]);

    // Reset on disconnect
    useEffect(() => {
        if (!isConnected) {
            initialFetchDone.current = false;
        }
    }, [isConnected]);

    if (!isConnected) return null;

    const confidenceColor = (level: 'high' | 'medium' | 'low') => {
        switch (level) {
            case 'high': return { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400', dot: 'bg-red-400' };
            case 'medium': return { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400', dot: 'bg-amber-400' };
            case 'low': return { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-400' };
        }
    };

    const urgencyConfig = {
        routine: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Routine', icon: CheckCircle2 },
        moderate: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Moderate', icon: Clock },
        urgent: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Urgent', icon: AlertTriangle }
    };

    const urgency = possibilities ? urgencyConfig[possibilities.urgencyLevel] : urgencyConfig.routine;
    const UrgencyIcon = urgency.icon;

    const tabs = [
        { key: 'diagnoses' as const, label: 'Diagnoses', icon: Stethoscope, count: possibilities?.differentials.length || 0 },
        { key: 'questions' as const, label: 'Questions', icon: MessageCircleQuestion, count: possibilities?.suggestedQuestions.length || 0 },
        { key: 'tests' as const, label: 'Tests', icon: FlaskConical, count: possibilities?.recommendedTests.length || 0 },
        { key: 'treatments' as const, label: 'Treatment', icon: Pill, count: possibilities?.treatmentPaths.length || 0 },
    ];

    return (
        <div className="absolute top-20 md:top-24 left-4 md:left-8 z-30 w-80 md:w-[22rem] animate-in slide-in-from-left duration-500 delay-500 fill-mode-both">
            <div className="bg-neutral-900/95 backdrop-blur-md rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden">
                {/* Header */}
                <div
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-neutral-800/50 transition border-b border-neutral-800/50"
                    onClick={() => setExpanded(!expanded)}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-amber-400/10 animate-pulse rounded-lg" />
                            <Brain size={15} className="relative z-10" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                AI Live Possibilities
                                {loading && (
                                    <span className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                                        <Sparkles size={8} className="animate-spin" />
                                        Analyzing
                                    </span>
                                )}
                                {!loading && isAutoAnalyzing && (
                                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        Live
                                    </span>
                                )}
                            </h4>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {analysisCount > 0 && (
                            <span className="text-[9px] text-neutral-500 font-medium">
                                #{analysisCount}
                            </span>
                        )}
                        {expanded ? <ChevronUp size={14} className="text-neutral-400" /> : <ChevronDown size={14} className="text-neutral-400" />}
                    </div>
                </div>

                {expanded && (
                    <div className="max-h-[calc(100vh-14rem)] overflow-hidden flex flex-col">
                        {/* Urgency & Status Bar */}
                        <div className="px-4 py-2.5 flex items-center justify-between border-b border-neutral-800/50 bg-neutral-900/50">
                            <div className="flex items-center gap-2">
                                <div className={clsx('flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider', urgency.bg, urgency.border, urgency.color, 'border')}>
                                    <UrgencyIcon size={10} />
                                    {urgency.label}
                                </div>
                                {possibilities?.keySymptoms && possibilities.keySymptoms.length > 0 && (
                                    <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                                        <TrendingUp size={10} />
                                        <span>{possibilities.keySymptoms.length} signals</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); fetchPossibilities(); }}
                                    disabled={loading}
                                    className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-500 hover:text-amber-400 transition disabled:opacity-30"
                                    title="Refresh analysis"
                                >
                                    <RefreshCcw size={12} className={loading ? 'animate-spin' : ''} />
                                </button>
                            </div>
                        </div>

                        {/* Key Symptoms Chips */}
                        {possibilities?.keySymptoms && possibilities.keySymptoms.length > 0 && (
                            <div className="px-4 py-2 border-b border-neutral-800/50 bg-neutral-950/30">
                                <div className="flex flex-wrap gap-1.5">
                                    {possibilities.keySymptoms.map((s, i) => (
                                        <span key={i} className="text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-0.5 rounded-full font-medium">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tab Bar */}
                        <div className="flex border-b border-neutral-800/50 bg-neutral-900/50">
                            {tabs.map(tab => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={clsx(
                                            'flex-1 py-2 px-1 text-[10px] font-bold uppercase tracking-wider flex flex-col items-center gap-1 transition-all relative',
                                            activeTab === tab.key
                                                ? 'text-amber-400'
                                                : 'text-neutral-500 hover:text-neutral-300'
                                        )}
                                    >
                                        <TabIcon size={13} />
                                        <span className="hidden md:inline">{tab.label}</span>
                                        {tab.count > 0 && (
                                            <span className={clsx(
                                                'absolute top-1 right-1.5 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center',
                                                activeTab === tab.key
                                                    ? 'bg-amber-500/20 text-amber-400'
                                                    : 'bg-neutral-800 text-neutral-500'
                                            )}>
                                                {tab.count}
                                            </span>
                                        )}
                                        {activeTab === tab.key && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-amber-400 rounded-full" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 max-h-[40vh]">
                            {!possibilities && loading ? (
                                <div className="flex flex-col items-center justify-center h-32 gap-3">
                                    <div className="relative w-12 h-12 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                                        <Brain className="text-amber-500 animate-pulse" size={18} />
                                    </div>
                                    <p className="text-[11px] font-semibold text-neutral-400">Analyzing live transcript...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Diagnoses Tab */}
                                    {activeTab === 'diagnoses' && (
                                        <div className="space-y-2">
                                            {possibilities?.differentials && possibilities.differentials.length > 0 ? (
                                                possibilities.differentials.map((item, i) => {
                                                    const colors = confidenceColor(item.confidence);
                                                    return (
                                                        <div key={i} className={clsx('rounded-xl p-3 border transition-all hover:scale-[1.01]', colors.bg, colors.border)}>
                                                            <div className="flex items-start gap-2.5">
                                                                <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold border', colors.bg, colors.border, colors.text)}>
                                                                    {i + 1}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm text-neutral-200 font-semibold leading-tight">{item.name}</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 mt-1.5">
                                                                        <span className={clsx('text-[9px] font-bold uppercase tracking-wider flex items-center gap-1', colors.text)}>
                                                                            <span className={clsx('w-1.5 h-1.5 rounded-full', colors.dot)} />
                                                                            {item.confidence} confidence
                                                                        </span>
                                                                    </div>
                                                                    {item.reasoning && (
                                                                        <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">{item.reasoning}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-6">
                                                    <Stethoscope className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                                                    <p className="text-[11px] text-neutral-500">Gathering data for differential diagnosis...</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Questions Tab */}
                                    {activeTab === 'questions' && (
                                        <div className="space-y-2">
                                            {possibilities?.suggestedQuestions && possibilities.suggestedQuestions.length > 0 ? (
                                                possibilities.suggestedQuestions.map((q, i) => (
                                                    <div key={i} className="bg-teal-500/5 border border-teal-500/15 rounded-xl p-3 hover:bg-teal-500/10 transition-all cursor-default group">
                                                        <div className="flex items-start gap-2.5">
                                                            <div className="w-5 h-5 rounded-full bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold border border-teal-500/25 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                                                                ?
                                                            </div>
                                                            <p className="text-sm text-neutral-300 font-medium leading-relaxed">"{q}"</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6">
                                                    <MessageCircleQuestion className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                                                    <p className="text-[11px] text-neutral-500">No specific questions suggested yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tests Tab */}
                                    {activeTab === 'tests' && (
                                        <div className="space-y-2">
                                            {possibilities?.recommendedTests && possibilities.recommendedTests.length > 0 ? (
                                                possibilities.recommendedTests.map((test, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 bg-blue-500/5 border border-blue-500/15 rounded-xl p-3 hover:bg-blue-500/10 transition-all">
                                                        <div className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 text-[9px] border border-blue-500/25">
                                                            <FlaskConical size={10} />
                                                        </div>
                                                        <span className="text-sm text-neutral-300 font-medium">{test}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6">
                                                    <FlaskConical className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                                                    <p className="text-[11px] text-neutral-500">No tests recommended yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Treatment Tab */}
                                    {activeTab === 'treatments' && (
                                        <div className="space-y-2">
                                            {possibilities?.treatmentPaths && possibilities.treatmentPaths.length > 0 ? (
                                                possibilities.treatmentPaths.map((path, i) => (
                                                    <div key={i} className="flex items-start gap-2.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3 hover:bg-emerald-500/10 transition-all">
                                                        <div className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold border border-emerald-500/25">
                                                            {i + 1}
                                                        </div>
                                                        <span className="text-sm text-neutral-300 font-medium leading-relaxed">{path}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6">
                                                    <Pill className="w-6 h-6 mx-auto text-neutral-600 mb-2" />
                                                    <p className="text-[11px] text-neutral-500">No treatment recommendations yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-neutral-800/50 bg-neutral-950/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[9px] text-neutral-600">
                                <Zap size={8} />
                                <span>
                                    {lastUpdated ? `Updated ${lastUpdated}` : 'Initializing...'}
                                </span>
                            </div>
                            <button
                                onClick={() => setIsAutoAnalyzing(!isAutoAnalyzing)}
                                className={clsx(
                                    'text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border transition-all',
                                    isAutoAnalyzing
                                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
                                        : 'text-neutral-500 bg-neutral-800 border-neutral-700 hover:text-neutral-300'
                                )}
                            >
                                {isAutoAnalyzing ? 'Auto ON' : 'Auto OFF'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
