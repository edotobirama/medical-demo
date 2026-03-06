import { ShieldCheck, FileText, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function InsuranceInfoPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar transparent={false} />
            <div className="flex-1 container mx-auto px-6 py-24 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">Insurance & Billing</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        We believe quality healthcare should be accessible. We accept a wide range of insurance plans and offer flexible payment options.
                    </p>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
                    <div className="flex items-center gap-4 mb-8">
                        <ShieldCheck className="text-emerald-500 w-10 h-10" />
                        <h2 className="text-2xl font-bold text-slate-900">Accepted Insurance Providers</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {['Medicare / Medicaid', 'BlueCross BlueShield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Humana', 'Kaiser Permanente', 'Anthem'].map((provider) => (
                            <div key={provider} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50 text-slate-700 font-medium">
                                <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
                                {provider}
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-sm text-slate-500 text-center italic">
                        *If your provider is not listed here, please contact our billing department to verify out-of-network coverage.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <FileText className="text-blue-500 w-8 h-8 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Self-Pay & Financing</h3>
                        <p className="text-slate-600 mb-4">
                            For uninsured patients or those receiving elective procedures not covered by insurance, we offer transparent pricing models and flexible monthly payment plans through our financial partners.
                        </p>
                        <button className="text-blue-600 font-semibold hover:underline">View Pricing Estimates</button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <ShieldCheck className="text-emerald-500 w-8 h-8 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Billing Questions?</h3>
                        <p className="text-slate-600 mb-4">
                            Our dedicated financial counselors are available Monday through Friday, 8 AM - 5 PM to help you navigate your coverage and explain your medical bills.
                        </p>
                        <button className="text-emerald-600 font-semibold hover:underline">Contact Billing Department</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
