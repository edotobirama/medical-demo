'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Clock, User as UserIcon, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function InboxPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'loading') return;
        if (status === 'unauthenticated') {
            router.replace('/login');
            return;
        }

        fetch('/api/messages')
            .then(r => r.json())
            .then(data => {
                if (data.conversations) {
                    setConversations(data.conversations);
                }
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen text-white font-sans selection:bg-blue-500/30">
            {/* Header Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
                
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full mb-8">
                                <MessageCircle size={16} className="text-blue-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-blue-400">Secure Channels</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-2 leading-tight text-white">
                                Message <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Center</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl backdrop-blur-3xl">
                             <Sparkles size={20} className="text-blue-400" />
                             <span className="text-xs font-black uppercase tracking-widest text-slate-400">End-to-End Encrypted</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container mx-auto px-6 pb-32">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 border border-white/5 bg-white/5 rounded-[4rem]">
                        <Loader2 className="animate-spin text-blue-500 mb-6" size={40} />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Secure Vault...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-40 border border-white/5 bg-white/5 rounded-[4rem] text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 border border-white/10">
                            <MessageCircle size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Silence is Golden</h3>
                        <p className="text-slate-400 font-medium max-w-md mx-auto">Your medical communications are private and secure. No active channels found.</p>
                        {session?.user.role === 'PATIENT' && (
                            <Link href="/doctors" className="mt-12 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-500 transition-all flex items-center gap-2 uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/20">
                                Contact A Specialist <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {conversations.map((c: any) => (
                            <Link key={c.contact.id} href={`/inbox/${c.contact.id}`} className="group relative bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] hover:border-blue-500/50 transition-all duration-500 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                                <div className="w-24 h-24 bg-blue-600/10 rounded-[2rem] flex items-center justify-center text-blue-500 flex-shrink-0 relative border border-blue-600/20 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 overflow-hidden">
                                    {c.contact.image ? (
                                        <img src={c.contact.image} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                    ) : (
                                        <UserIcon size={40} />
                                    )}
                                    {c.unread > 0 && (
                                        <span className="absolute top-2 right-2 bg-blue-500 w-4 h-4 rounded-full border-2 border-slate-950 animate-pulse" />
                                    )}
                                </div>
                                <div className="flex-grow text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors">
                                            {c.contact.name} <span className="text-blue-500/50 text-base ml-2">{c.contact.role === 'DOCTOR' ? 'FACULTY' : 'PATIENT'}</span>
                                        </h3>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center justify-center md:justify-end gap-2">
                                            <Clock size={12} /> {format(new Date(c.lastMessage.createdAt), 'MMM d, p')}
                                        </span>
                                    </div>
                                    <p className="text-slate-400 font-medium leading-relaxed truncate max-w-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                                        {c.lastMessage.senderId === session?.user?.id ? 'Outgoing: ' : 'Incoming: '}{c.lastMessage.content}
                                    </p>
                                </div>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <ArrowRight size={24} strokeWidth={3} />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
