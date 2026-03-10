'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, X, Loader2, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { format } from 'date-fns';

interface MedicalReport {
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    aiSummary: string | null;
    createdAt: string;
}

export default function PatientReportsModal({
    appointmentId,
    isOpen,
    onClose
}: {
    appointmentId: string;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !appointmentId) return;

        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/patient/${appointmentId}/docs`);
                if (res.ok) {
                    const data = await res.json();
                    setReports(data.documents || []);
                } else {
                    const data = await res.json();
                    setError(data.error || 'Failed to fetch reports');
                }
            } catch (e) {
                setError('Network error getting reports');
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [isOpen, appointmentId]);

    const formatFileSize = (bytes: number) => {
        if (!bytes) return 'Unknown size';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white">
                <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-neutral-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-white">Patient Reports</h3>
                            <p className="text-xs text-neutral-400 font-medium">Uploaded Medical Documents</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 pb-8 relative">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <Loader2 className="animate-spin text-teal-500" size={32} />
                            <p className="text-sm font-medium text-neutral-400">Loading reports...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={18} />
                            <div>
                                <h4 className="font-bold text-red-400 text-sm">Error Loading Reports</h4>
                                <p className="text-xs text-red-300 mt-1">{error}</p>
                            </div>
                        </div>
                    ) : reports.length > 0 ? (
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 hover:border-teal-500/50 transition flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-white text-base truncate">{report.title}</h4>
                                            <span className="text-[10px] uppercase tracking-wider font-bold bg-neutral-700 px-2 py-0.5 rounded text-neutral-300">
                                                {report.fileType}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-500 font-mono mb-3">
                                            {format(new Date(report.createdAt), 'MMM d, yyyy')} • {formatFileSize(report.fileSize)}
                                        </p>

                                        {report.aiSummary ? (
                                            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 relative">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/50 rounded-l-lg" />
                                                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                                                    <span className="text-teal-400 font-bold mr-1">AI Summary:</span>
                                                    {report.aiSummary}
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-neutral-500 italic">No AI summary available.</p>
                                        )}
                                    </div>
                                    <div className="sm:w-32 flex sm:flex-col justify-end sm:justify-center items-center gap-2 shrink-0">
                                        <a
                                            href={report.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition"
                                        >
                                            <Download size={14} /> Open
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-neutral-800/30 rounded-2xl border border-dashed border-neutral-700">
                            <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-700 text-neutral-500">
                                <FileText size={24} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2">No Reports Found</h4>
                            <p className="text-sm text-neutral-400 font-medium">
                                The patient hasn't uploaded any medical records or documents yet.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
