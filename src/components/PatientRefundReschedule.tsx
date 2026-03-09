'use client';

import { useState } from 'react';
import { requestRefund } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { RefreshCcw, DollarSign, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PatientRefundReschedule({
    appointmentId,
    doctorId,
    amountPaid,
    status
}: {
    appointmentId: string;
    doctorId: string;
    amountPaid: number;
    status: string;
}) {
    const [loading, setLoading] = useState<string | null>(null);
    const [refunded, setRefunded] = useState(false);
    const [refundAmount, setRefundAmount] = useState<number | null>(null);
    const router = useRouter();

    const handleRefund = async () => {
        if (!confirm(`Are you sure you want to request a refund of $${amountPaid.toFixed(2)}? This action cannot be undone.`)) return;
        setLoading('refund');
        try {
            const res = await requestRefund(appointmentId);
            if (res.error) {
                alert(res.error);
            } else {
                setRefunded(true);
                setRefundAmount(res.refundAmount || amountPaid);
            }
        } catch (e) {
            alert('An error occurred while processing your refund.');
        } finally {
            setLoading(null);
        }
    };

    if (refunded) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-emerald-600" size={24} />
                </div>
                <div>
                    <h4 className="font-bold text-emerald-800 text-sm">Refund Processed</h4>
                    <p className="text-emerald-600 text-xs mt-0.5">
                        ${(refundAmount ?? amountPaid).toFixed(2)} has been queued for refund to your original payment method.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertTriangle className="text-amber-600" size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-amber-900 text-sm">
                        {status === 'CANCELLED' ? 'Appointment Cancelled by Doctor' : 'Doctor Requested Reschedule'}
                    </h4>
                    <p className="text-amber-700 text-xs mt-0.5 leading-relaxed">
                        {status === 'CANCELLED'
                            ? 'Your doctor was unable to see you for this booking. You can request a full refund or reschedule to a new time.'
                            : 'Your doctor has requested that you move this appointment to a different time. You may reschedule or request a refund instead.'}
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleRefund}
                    disabled={!!loading}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-md shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                    {loading === 'refund' ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign size={18} />}
                    Refund (${amountPaid.toFixed(2)})
                </button>

                <Link
                    href={`/book?doctorId=${doctorId}&reschedule=${appointmentId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                    <RefreshCcw size={18} />
                    Reschedule
                </Link>
            </div>
        </div>
    );
}
