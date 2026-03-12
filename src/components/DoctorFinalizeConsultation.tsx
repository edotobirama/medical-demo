'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, FileText, Image as ImageIcon, Send, Type } from 'lucide-react';

interface DoctorFinalizeConsultationProps {
    appointmentId: string;
}

export default function DoctorFinalizeConsultation({ appointmentId }: DoctorFinalizeConsultationProps) {
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [aiSummary, setAiSummary] = useState<string>('');
    const [inputType, setInputType] = useState<'TYPE' | 'UPLOAD'>('TYPE');
    const [notes, setNotes] = useState('');
    const [uploadUrl, setUploadUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSummary = async () => {
            setLoadingSummary(true);
            try {
                const res = await fetch('/api/reports/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ appointmentId })
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.report?.summary) {
                        setAiSummary(`${data.report.summary}\n\nDiagnosis: ${data.report.diagnosis || ''}`);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch AI summary", e);
            } finally {
                setLoadingSummary(false);
            }
        };

        fetchSummary();
    }, [appointmentId]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Use the existing mock logic for documents since we don't have S3 set up:
        // In a real app we upload to AWS S3. For this demo, we mock it.
        const mockUrl = `/uploads/mock-prescription-${Date.now()}.jpg`;
        setUploadUrl(mockUrl);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (inputType === 'TYPE' && !notes.trim()) {
            setError('Please type your notes or prescription.');
            setSubmitting(false);
            return;
        }
        if (inputType === 'UPLOAD' && !uploadUrl) {
            setError('Please upload an image of the handwritten prescription.');
            setSubmitting(false);
            return;
        }

        try {
            const res = await fetch('/api/consultations/finalize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId,
                    notes: inputType === 'TYPE' ? notes : '',
                    prescriptionUrl: inputType === 'UPLOAD' ? uploadUrl : '',
                    aiSummary
                })
            });

            if (res.ok) {
                setSuccess(true);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to finalize consultation');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={32} />
                </div>
                <h3 className="text-emerald-800 font-bold text-lg mb-2">Consultation Finalized!</h3>
                <p className="text-emerald-600 text-sm">The digital report and prescription have been sent to the patient.</p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border shadow-sm rounded-2xl p-6">
            <h3 className="font-bold text-lg flex items-center gap-2 mb-4 text-card-foreground">
                <FileText className="text-primary" /> Post-Consultation Wrap-Up
            </h3>

            {/* AI Summary */}
            <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-4 mb-6">
                <h4 className="text-xs font-bold text-violet-600 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                    {loadingSummary ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    AI-Assisted Transcript Summary
                </h4>
                {loadingSummary ? (
                    <p className="text-sm text-muted-foreground animate-pulse">Analyzing consultation transcript...</p>
                ) : aiSummary ? (
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap font-medium">{aiSummary}</p>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No transcript available for AI summary.</p>
                )}
            </div>

            {/* Input Method Toggle */}
            <div className="flex bg-muted p-1 rounded-xl mb-6 border border-border">
                <button
                    type="button"
                    onClick={() => setInputType('TYPE')}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${inputType === 'TYPE' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <Type size={16} /> Type Prescription
                </button>
                <button
                    type="button"
                    onClick={() => setInputType('UPLOAD')}
                    className={`flex-1 rounded-lg py-2.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${inputType === 'UPLOAD' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                    <ImageIcon size={16} /> Upload Handwritten
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {inputType === 'TYPE' ? (
                    <div>
                        <label className="block text-sm font-bold text-card-foreground mb-2">Digital Prescription & Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type medications, dosages, and follow-up instructions here..."
                            rows={6}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground resize-none"
                        />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-bold text-card-foreground mb-2">Handwritten Prescription Image</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/50 hover:bg-muted transition-colors">
                            {uploadUrl ? (
                                <div className="text-emerald-600 font-bold flex flex-col items-center gap-2">
                                    <Sparkles size={24} />
                                    <span>Prescription Uploaded Successfully!</span>
                                    <span className="text-xs font-normal text-muted-foreground mt-1">Ready to attach to patient record.</span>
                                </div>
                            ) : (
                                <>
                                    <ImageIcon size={32} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                                    <p className="text-sm text-card-foreground font-medium mb-2">Snap a photo and upload it here.</p>
                                    <p className="text-xs text-muted-foreground mb-4">Supports JPG, PNG (Max 5MB)</p>
                                    <label className="cursor-pointer btn btn-outline border-border hover:bg-background text-sm">
                                        Select Image
                                        <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                                    </label>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {inputType === 'TYPE' ? 'Issue Digital Prescription' : 'Attach & Finalize Report'}
                </button>
            </form>
        </div>
    );
}
