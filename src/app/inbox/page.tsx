'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { MessageCircle, Clock, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function InboxPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
            return;
        }
        if (status === 'authenticated') {
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
        }
    }, [status, router]);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col pt-20">
            <Navbar transparent={false} />
            <div className="container py-8 max-w-4xl mx-auto flex-grow">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <MessageCircle className="text-primary w-8 h-8" />
                        Inbox
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-xl font-bold text-card-foreground mb-2">No Messages Yet</h3>
                        <p className="text-muted-foreground">You don't have any active conversations.</p>
                        {session?.user.role === 'PATIENT' && (
                            <Link href="/doctors" className="btn btn-primary mt-6 inline-block">
                                Browse Doctors
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {conversations.map((c: any) => (
                            <Link key={c.contact.id} href={`/inbox/${c.contact.id}`} className="block bg-card hover:bg-accent hover:border-primary/50 transition-all p-6 rounded-2xl border border-border shadow-sm relative group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0 relative">
                                        {c.contact.image ? (
                                            <img src={c.contact.image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                                        ) : (
                                            <UserIcon size={24} />
                                        )}
                                        {c.unread > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-rose-500 w-4 h-4 rounded-full border-2 border-card" />
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {c.contact.name} {c.contact.role === 'DOCTOR' && '(Doctor)'}
                                            </h3>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock size={12} /> {format(new Date(c.lastMessage.createdAt), 'MMM d, p')}
                                            </span>
                                        </div>
                                        <p className="text-muted-foreground text-sm truncate max-w-md mt-1 font-medium">
                                            {c.lastMessage.senderId === session?.user?.id ? 'You: ' : ''}{c.lastMessage.content}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
