'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import clsx from 'clsx';
import { format } from 'date-fns';

export default function DirectMessaging() {
    const { userId } = useParams();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/login');
    }, [status, router]);

    const fetchMessages = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/messages?userId=${userId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (e) {
            console.error('Failed to fetch messages', e);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            fetchMessages();
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [status, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages.length]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: userId,
                    content: input.trim()
                })
            });

            if (res.ok) {
                const newMsg = await res.json();
                setMessages((prev) => [...prev, newMsg]);
                setInput('');
                scrollToBottom();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    if (status !== 'authenticated') return null;

    return (
        <div className="flex flex-col h-screen bg-background pt-16">
            <Navbar transparent={false} />

            <header className="bg-card border-b border-border py-4 px-6 flex items-center shadow-sm">
                <Link href="/inbox" className="btn btn-ghost p-2 rounded-full hover:bg-muted text-muted-foreground mr-4">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <UserIcon size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-foreground leading-tight">Direct Conversation</h2>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/30">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-70">
                        <UserIcon size={48} className="mb-4 text-primary/50" />
                        <p className="font-medium text-lg">Start a conversation</p>
                        <p className="text-sm border-t border-border mt-2 pt-2 text-center max-w-sm">
                            Say hello to initiate a secure direct message thread.
                        </p>
                    </div>
                ) : (
                    messages.map((m) => {
                        const isMe = m.senderId === session.user.id;
                        return (
                            <div key={m.id} className={clsx("flex w-full", isMe ? "justify-end" : "justify-start animate-in slide-in-from-left-2")}>
                                <div className={clsx(
                                    "px-5 py-3 rounded-2xl max-w-[85%] sm:max-w-md shadow-sm border",
                                    isMe ? "bg-primary text-primary-foreground border-primary/20 rounded-br-none"
                                        : "bg-card text-card-foreground border-border rounded-bl-none"
                                )}>
                                    <p className="leading-relaxed font-medium">{m.content}</p>
                                    <span className={clsx(
                                        "text-[10px] mt-2 block font-semibold uppercase tracking-wider",
                                        isMe ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                                    )}>
                                        {format(new Date(m.createdAt), 'h:mm a')}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </main>

            <footer className="p-4 sm:p-6 bg-card border-t border-border shadow-[0_-10px_40px_-20px_rgba(0,0,0,0.1)]">
                <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-muted border-none p-4 rounded-xl focus:ring-2 focus:ring-primary shadow-inner font-medium text-foreground transition-all focus:bg-background"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                    >
                        {sending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                    </button>
                </form>
            </footer>
        </div>
    );
}
