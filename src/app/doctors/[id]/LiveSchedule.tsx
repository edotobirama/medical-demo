"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Users, Hourglass } from "lucide-react";

export default function LiveSchedule({ docId }: { docId: string }) {
    const [schedule, setSchedule] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch(`/api/booking/schedule?doctorId=${docId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSchedule(data);
                }
            } catch (err) {
                console.error("Failed to fetch live schedule", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
        const interval = setInterval(fetchSchedule, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, [docId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!schedule || schedule.length === 0) {
        return (
            <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-lg">
                No active bookings in the queue for today.
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {schedule.map((hourGroup: any, idx: number) => (
                <div key={idx} className="bg-background rounded-lg p-4 border border-border shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-sm font-bold text-foreground">
                            {format(new Date(hourGroup.hour), 'MMM d, h:00 a')}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {hourGroup.bookings.slice(0, 5).map((bNum: number, i: number) => (
                                <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-md">
                                    #{bNum}
                                </span>
                            ))}
                            {hourGroup.bookings.length > 5 && (
                                <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-bold rounded-md">
                                    +{hourGroup.bookings.length - 5}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end text-sm text-muted-foreground mb-1">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-foreground">{hourGroup.totalWaitlist}</span> in queue
                        </div>
                        <div className="flex items-center gap-1.5 justify-end text-xs text-muted-foreground">
                            <Hourglass className="w-3.5 h-3.5 text-blue-500" />
                            ~{hourGroup.avgWaitTime}m wait
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
