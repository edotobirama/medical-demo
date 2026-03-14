'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

// Types for our alerts
type AlertType = 'success' | 'error' | 'info';

interface AlertState {
    id: number;
    message: string;
    type: AlertType;
}

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    resolve: ((value: boolean) => void) | null;
}

interface AlertContextProps {
    showAlert: (message: string, type?: AlertType) => void;
    showConfirm: (title: string, message: string) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

let alertIdCounter = 0;

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<AlertState[]>([]);
    const [confirmState, setConfirmState] = useState<ConfirmState>({
        isOpen: false,
        title: '',
        message: '',
        resolve: null
    });

    const showAlert = useCallback((message: string, type: AlertType = 'info') => {
        const id = ++alertIdCounter;
        setAlerts((prev) => [...prev, { id, message, type }]);

        // Auto remove toast after 4s
        setTimeout(() => {
            setAlerts((prev) => prev.filter((a) => a.id !== id));
        }, 4000);
    }, []);

    const showConfirm = useCallback((title: string, message: string) => {
        return new Promise<boolean>((resolve) => {
            setConfirmState({
                isOpen: true,
                title,
                message,
                resolve
            });
        });
    }, []);

    const handleConfirmClose = (value: boolean) => {
        if (confirmState.resolve) {
            confirmState.resolve(value);
        }
        setConfirmState({ isOpen: false, title: '', message: '', resolve: null });
    };

    const removeAlert = (id: number) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}

            {/* TOAST SYSTEM (Snackbars) */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className={clsx(
                            "pointer-events-auto flex items-center gap-4 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-md animate-in slide-in-from-right-10 fade-in zoom-in-95 duration-300 min-w-[300px] max-w-sm",
                            alert.type === 'success' ? "bg-emerald-50 border-emerald-500/30 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400" :
                                alert.type === 'error' ? "bg-rose-50 border-rose-500/30 text-rose-800 dark:bg-rose-500/10 dark:text-rose-400" :
                                    "bg-blue-50 border-blue-500/30 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400"
                        )}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            alert.type === 'success' ? "bg-emerald-200/50 dark:bg-emerald-500/20" :
                                alert.type === 'error' ? "bg-rose-200/50 dark:bg-rose-500/20" :
                                    "bg-blue-200/50 dark:bg-blue-500/20"
                        )}>
                            {alert.type === 'success' ? <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" /> :
                                alert.type === 'error' ? <AlertCircle size={18} className="text-rose-600 dark:text-rose-400" /> :
                                    <Info size={18} className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        
                        <div className="flex-1 text-sm font-bold opacity-90">
                            {alert.message}
                        </div>

                        <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground/50 hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>

            {/* CONFIRMATION MODAL SYSTEM */}
            {confirmState.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl shadow-black/40 border border-border p-8 animate-in zoom-in-95 duration-300 slide-in-from-bottom-5">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 border border-primary/20 shadow-inner">
                                <AlertCircle size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">{confirmState.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-8">{confirmState.message}</p>
                            
                            <div className="flex items-center justify-center w-full gap-4">
                                <button
                                    onClick={() => handleConfirmClose(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-foreground bg-secondary hover:bg-secondary/80 hover:scale-[1.02] border border-border shrink-0 transition-all active:scale-[0.98]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleConfirmClose(true)}
                                    className="flex-1 py-3 rounded-xl font-bold text-sm text-primary-foreground bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-lg shadow-primary/20 shrink-0 transition-all active:scale-[0.98]"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export function useCustomAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useCustomAlert must be used within an AlertProvider');
    }
    return context;
}
