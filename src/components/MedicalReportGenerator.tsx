'use client';

import { useState } from 'react';
import { Sparkles, Loader2, FileText, AlertCircle, Stethoscope, Pill, CalendarClock, Copy, Check, Download } from 'lucide-react';
import clsx from 'clsx';

interface AIReport {
    summary: string;
    keyIssues: string[];
    recommendations: string[];
    diagnosis: string;
    medications: string[];
    followUp: string;
    fullText: string;
}

export default function MedicalReportGenerator({ appointmentId }: { appointmentId: string }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState<AIReport | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateReport = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appointmentId })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to generate report');
            }

            const data = await res.json();
            setReport(data.report);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const copyReport = () => {
        if (!report) return;
        const text = `MEDICAL CONSULTATION REPORT\n\nSummary: ${report.summary}\n\nDiagnosis: ${report.diagnosis}\n\nKey Issues:\n${report.keyIssues.map(i => `- ${i}`).join('\n')}\n\nMedications:\n${report.medications.map(m => `- ${m}`).join('\n')}\n\nRecommendations:\n${report.recommendations.map(r => `- ${r}`).join('\n')}\n\nFollow-up: ${report.followUp}\n\n---\n${report.fullText}`;

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!report) {
        return (
            <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
                <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <Sparkles className="text-violet-500" /> AI Medical Report
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    Generate a comprehensive medical report from the consultation transcript, patient records, and session data using AI analysis.
                </p>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                        <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-50"
                >
                    {loading ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing Consultation Data...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Generate AI Report
                        </>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FileText size={20} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">AI Medical Report</h3>
                        <p className="text-violet-200 text-xs">Generated from consultation data</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={copyReport}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                        title="Copy report"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                    <button
                        onClick={generateReport}
                        disabled={loading}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition"
                        title="Regenerate"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-5">
                {/* Summary */}
                <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
                    <p className="text-sm text-foreground leading-relaxed">{report.summary}</p>
                </div>

                {/* Diagnosis */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Stethoscope size={14} /> Preliminary Diagnosis
                    </h4>
                    <p className="text-sm text-amber-900 font-medium">{report.diagnosis}</p>
                </div>

                {/* Key Issues */}
                {report.keyIssues.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <AlertCircle size={14} className="text-orange-500" /> Key Issues Identified
                        </h4>
                        <ul className="space-y-1.5">
                            {report.keyIssues.map((issue, i) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Medications */}
                {report.medications.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Pill size={14} className="text-blue-500" /> Medications
                        </h4>
                        <ul className="space-y-1.5">
                            {report.medications.map((med, i) => (
                                <li key={i} className="text-sm text-foreground bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg">
                                    {med}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {report.recommendations.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-emerald-500" /> Recommendations
                        </h4>
                        <ul className="space-y-1.5">
                            {report.recommendations.map((rec, i) => (
                                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Follow-up */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <CalendarClock size={14} /> Follow-up Plan
                    </h4>
                    <p className="text-sm text-foreground font-medium">{report.followUp}</p>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-muted-foreground italic text-center pt-2 border-t border-border">
                    This AI-generated report should be reviewed and approved by the attending physician before being added to the official medical record.
                </p>
            </div>
        </div>
    );
}
