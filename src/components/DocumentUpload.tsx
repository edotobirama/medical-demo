'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, File, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface UploadedDoc {
    id: string;
    title: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    createdAt: string;
}

export default function DocumentUpload({ onUploadSuccess }: { onUploadSuccess?: () => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const validateAndSetFile = (f: File) => {
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!allowedTypes.includes(f.type)) {
            setUploadResult({ success: false, message: 'Invalid file type. Please upload PDF, DOCX, JPG, or PNG.' });
            return;
        }

        if (f.size > 10 * 1024 * 1024) {
            setUploadResult({ success: false, message: 'File too large. Maximum size is 10MB.' });
            return;
        }

        setFile(f);
        setUploadResult(null);

        // Auto-fill title from filename
        if (!title) {
            const nameWithoutExt = f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
            setTitle(nameWithoutExt);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (type: string) => {
        if (type.includes('pdf')) return '📄';
        if (type.includes('word') || type.includes('document')) return '📝';
        if (type.includes('image')) return '🖼️';
        return '📎';
    };

    const uploadFile = async () => {
        if (!file) return;

        setUploading(true);
        setUploadResult(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title || file.name);

            const res = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                setUploadResult({ success: true, message: 'Document uploaded successfully!' });
                setFile(null);
                setTitle('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                onUploadSuccess?.();
            } else {
                setUploadResult({ success: false, message: data.error || 'Upload failed' });
            }
        } catch (e: any) {
            setUploadResult({ success: false, message: e.message || 'Upload failed' });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={clsx(
                    "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.01]"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                <div className="flex flex-col items-center gap-3">
                    <div className={clsx(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition",
                        isDragging ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                        <Upload size={24} />
                    </div>
                    <div>
                        <p className="font-semibold text-foreground">
                            {isDragging ? 'Drop your file here' : 'Drop files or click to upload'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOCX, JPG, PNG — Max 10MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Selected File Preview */}
            {file && (
                <div className="bg-muted/50 border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{getFileIcon(file.type)}</span>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(''); }}
                            className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                            Document Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Blood Test Results - March 2026"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition"
                        />
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={uploadFile}
                        disabled={uploading}
                        className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Upload Document
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Upload Result */}
            {uploadResult && (
                <div className={clsx(
                    "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium",
                    uploadResult.success
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                )}>
                    {uploadResult.success ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    {uploadResult.message}
                </div>
            )}
        </div>
    );
}
