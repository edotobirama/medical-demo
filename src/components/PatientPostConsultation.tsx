'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, FileText, Download, CheckCircle, MessageSquare } from 'lucide-react';

export default function PatientPostConsultation({ appointmentId, callDuration, remoteName }: { appointmentId: string, callDuration: string, remoteName: string }) {
    const router = useRouter();
    const [status, setStatus] = useState<'WAITING' | 'READY'>('WAITING');
    const [reports, setReports] = useState<any[]>([]);
    const [transcripts, setTranscripts] = useState<any[]>([]);

    useEffect(() => {
        let isComplete = false;

        const fetchDetails = async () => {
            if (isComplete) return;
            try {
                // Fetch appointment to get MedicalReports attached to patient
                const aptRes = await fetch(`/api/appointments/${appointmentId}`);
                if (aptRes.ok) {
                    const aptData = await aptRes.json();

                    // Identify reports linked tightly to this specific session
                    if (aptData.patient?.medicalReports) {
                        const todayReports = aptData.patient.medicalReports.filter((r: any) =>
                            r.appointmentId === appointmentId &&
                            (r.fileType === 'PRESCRIPTION' || r.fileType === 'DIGITAL_REPORT')
                        );

                        // We assume the doctor has finalized if status is COMPLETED AND at least one report exists
                        // or if notes are inserted (but our API created a DIGITAL_REPORT for notes)
                        if (aptData.status === 'COMPLETED' && todayReports.length > 0) {
                            setReports(todayReports);
                            setStatus('READY');
                            isComplete = true; // Stop polling

                            // Fetch transcripts too
                            const tRes = await fetch(`/api/transcription?appointmentId=${appointmentId}`);
                            if (tRes.ok) {
                                const tData = await tRes.json();
                                setTranscripts(tData.transcripts || []);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to poll appointment details", e);
            }
        };

        const interval = setInterval(fetchDetails, 3000);
        fetchDetails(); // initial
        return () => clearInterval(interval);
    }, [appointmentId]);

    const handleDownload = (report: any) => {
        if (report.fileUrl && report.fileUrl !== '#') {
            window.open(report.fileUrl, '_blank');
        } else {
            // Provide a generic text file download for digital reports
            const text = `Medical Report - ${report.title}\n\nSummary:\n${report.aiSummary}\n\nNotes/Prescription:\n${report.aiPatientNotes}`;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.title.replace(/\\s+/g, '_')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    if (status === 'WAITING') {
        return (
            <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-teal-500/20 rounded-full flex items-center justify-center mb-6">
                    <Loader2 size={40} className="text-teal-400 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Please wait</h2>
                <p className="text-neutral-400 max-w-sm">
                    {remoteName} is currently generating your digital report and prescription. You will be able to review them shortly.
                </p>
                <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-xl p-4 w-full max-w-sm">
                    <div className="flex justify-between text-sm text-neutral-400 mb-2">
                        <span>Consultation Duration:</span>
                        <span className="text-white font-mono">{callDuration}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-6 pb-24 overflow-y-auto">
            <div className="max-w-3xl mx-auto mt-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Consultation Complete</h1>
                    <p className="text-neutral-400">Your documents from {remoteName} are ready.</p>
                </div>

                <div className="space-y-6">
                    {/* Documents */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
                            <FileText className="text-teal-400" /> Prescriptions & Reports
                        </h2>
                        <div className="space-y-4">
                            {reports.map((report, i) => (
                                <div key={i} className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white mb-1">{report.title}</h3>
                                        <p className="text-xs text-neutral-400">{report.fileType === 'PRESCRIPTION' ? 'Handwritten Image / PDF' : 'Digital Doctor Notes'}</p>
                                        {(report.aiSummary || report.aiPatientNotes) && (
                                            <div className="mt-3 bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 text-sm whitespace-pre-wrap">
                                                {report.aiPatientNotes ? `Notes: ${report.aiPatientNotes}\n\n` : ''}
                                                {report.aiSummary ? `Summary: ${report.aiSummary}` : ''}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDownload(report)}
                                        className="btn btn-primary sm:w-auto w-full py-2 px-4 shadow-lg text-sm rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Session Transcript */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4 border-b border-neutral-800 pb-3">
                            <MessageSquare className="text-violet-400" /> Consultation Transcript
                        </h2>
                        {transcripts.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {transcripts.map((t, index) => (
                                    <div key={index} className="flex flex-col">
                                        <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
                                            {t.speakerRole === 'PATIENT' ? 'You' : t.speakerRole}
                                        </span>
                                        <div className={`p-3 rounded-xl text-sm w-fit max-w-[85%] ${t.speakerRole === 'PATIENT' ? 'bg-neutral-800 text-neutral-300' : 'bg-teal-900/30 text-teal-100 border border-teal-800/50'}`}>
                                            <p>{t.originalText}</p>
                                            {t.englishText && t.language !== 'en' && (
                                                <p className="mt-2 pt-2 border-t border-teal-800/30 text-xs opacity-80">{t.englishText}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-500 text-sm">
                                <p>No transcribed conversation available for this session.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => router.push('/patient')}
                        className="btn bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 hover:border-neutral-600 px-8 py-3 rounded-xl transition-all"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
