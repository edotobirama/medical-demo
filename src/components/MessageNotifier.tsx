'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Link from 'next/link';

export default function MessageNotifier() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [lastKnownCount, setLastKnownCount] = useState(0);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/messages');
                if (!res.ok) return;
                const data = await res.json();

                if (data.totalUnread > lastKnownCount && lastKnownCount !== 0) {
                    // New message arrived
                    setShowPopup(true);

                    // Auto-hide popup after 5 seconds
                    setTimeout(() => setShowPopup(false), 5000);
                }

                setUnreadCount(data.totalUnread);
                setLastKnownCount(data.totalUnread);
            } catch (e) {
                console.error(e);
            }
        };

        fetchMessages();

        // Poll every 5 seconds for Real-time Updates
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [lastKnownCount]);

    if (unreadCount === 0 && !showPopup) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 animate-in slide-in-from-bottom-5">
            {/* Visual Popup Alert */}
            {showPopup && (
                <div className="bg-white border border-border shadow-2xl p-4 rounded-xl flex items-start gap-4 animate-in slide-in-from-right max-w-sm">
                    <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <MessageCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1">New Message Received!</h4>
                        <p className="text-gray-500 text-sm">You have a new direct message waiting in your inbox.</p>
                        <Link href="/inbox" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">
                            View Inbox
                        </Link>
                    </div>
                    <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Notification Badge Floating Button */}
            <Link
                href="/inbox"
                className="relative bg-primary text-primary-foreground p-4 rounded-full shadow-xl hover:shadow-2xl transition hover:-translate-y-1 group"
            >
                <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </Link>
        </div>
    );
}
