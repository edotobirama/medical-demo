"use client";

import { useState } from "react";
import { Plus, Calendar } from "lucide-react";

export default function SlotManager({ doctorProfileId }: { doctorProfileId: string }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("OFFLINE");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCreateSlot = async () => {
        if (!date || !time) {
            setMessage("Please select date and time.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Combine date and time
            const startDateTime = new Date(`${date}T${time}`);
            // Assuming 30 minute standard slot duration for simplicity
            const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

            const res = await fetch("/api/slots/manage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    doctorProfileId,
                    startTime: startDateTime.toISOString(),
                    endTime: endDateTime.toISOString(),
                    type
                })
            });

            if (res.ok) {
                setMessage("Slot added successfully!");
                setDate("");
                setTime("");
                window.location.reload();
            } else {
                setMessage("Error adding slot.");
            }
        } catch (err) {
            setMessage("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card p-6 bg-white border border-slate-100 shadow-sm rounded-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-teal-600" /> Manage Availability
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-teal-500 text-sm font-medium text-black bg-white"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-teal-500 text-sm font-medium text-black bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:border-teal-500 text-sm font-medium text-black bg-white"
                        >
                            <option value="OFFLINE">In-Person</option>
                            <option value="ONLINE">Video Consult</option>
                        </select>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleCreateSlot}
                        disabled={loading}
                        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-sm shadow-md shadow-teal-500/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
                    >
                        {loading ? "Adding..." : <><Plus size={16} /> Add 30-Min Slot</>}
                    </button>
                    {message && (
                        <p className={`mt-3 text-sm font-medium text-center ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
