'use client';

import { useActionState } from 'react';
import { updateDoctorSettings } from '@/lib/actions';
import { Settings, Save, Loader2, DollarSign, Power } from 'lucide-react';
import clsx from 'clsx';

interface DoctorSettingsProps {
    initialFee: number;
    initialIsAvailable: boolean;
}

export default function DoctorSettingsComponent({ initialFee, initialIsAvailable }: DoctorSettingsProps) {
    const [state, formAction, isPending] = useActionState(updateDoctorSettings, null);

    return (
        <div className="glass-card p-6 bg-white border border-slate-200">
            <div className="flex items-center gap-2 mb-6 text-slate-900">
                <Settings size={20} className="text-slate-500" />
                <h3 className="text-lg font-bold">Profile Settings</h3>
            </div>

            {state?.success && (
                <div className="mb-6 bg-emerald-50 text-emerald-700 p-3 rounded-lg text-sm font-medium border border-emerald-100 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Settings updated successfully!
                </div>
            )}

            {state?.error && (
                <div className="mb-6 bg-rose-50 text-rose-700 p-3 rounded-lg text-sm font-medium border border-rose-100 italic">
                    {state.error}
                </div>
            )}

            <form action={formAction} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <DollarSign size={14} className="text-slate-400" />
                        Consultation Fee ($)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                        <input
                            type="number"
                            name="consultationFee"
                            defaultValue={initialFee}
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all font-medium"
                            placeholder="0.00"
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 ml-1">This fee will be displayed to patients when booking.</p>
                </div>

                <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <Power size={14} className="text-slate-400" />
                        Availability Status
                    </label>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 group transition-colors hover:border-teal-200">
                        <div>
                            <p className="text-sm font-bold text-slate-800">Open for Appointments</p>
                            <p className="text-[10px] text-slate-500">Toggle to show or hide your profile from search.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                defaultChecked={initialIsAvailable}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-400"
                >
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Updating...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
