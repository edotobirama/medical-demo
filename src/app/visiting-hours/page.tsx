import { Clock, Users, ShieldAlert } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function VisitingHoursPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar transparent={false} />
            <div className="flex-1 container mx-auto px-6 py-24 max-w-4xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-heading">Visiting Hours</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Family and friends are an important part of the healing process. Review our visiting guidelines and departmental hours below.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                <Users size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">General Wards</h2>
                        </div>
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Morning</span>
                                <span>10:00 AM - 12:00 PM</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Evening</span>
                                <span>4:00 PM - 7:00 PM</span>
                            </li>
                            <li className="text-sm pt-2 italic">Max 2 visitors per patient at a time.</li>
                        </ul>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
                                <Clock size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-slate-900">ICU & Critical Care</h2>
                        </div>
                        <ul className="space-y-4 text-slate-600">
                            <li className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Morning</span>
                                <span>11:00 AM - 11:30 AM</span>
                            </li>
                            <li className="flex justify-between border-b pb-2">
                                <span className="font-semibold">Evening</span>
                                <span>5:00 PM - 5:30 PM</span>
                            </li>
                            <li className="text-sm pt-2 italic text-rose-600 font-medium">Immediate family only.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4 items-start">
                    <ShieldAlert className="text-blue-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-blue-900 mb-2">Hospital Policy</h3>
                        <p className="text-blue-800 text-sm leading-relaxed">
                            Children under 12 are not permitted in inpatient areas for their safety and the wellbeing of our patients. All visitors must obtain a pass from the reception desk before heading to the wards. Masks are required in all clinical areas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
