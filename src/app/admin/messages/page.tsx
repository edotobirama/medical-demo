import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, User } from 'lucide-react';

export default async function AdminMessagesPage() {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
        redirect('/login');
    }

    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-card border-b border-border">
                <div className="container py-4 flex items-center gap-4">
                    <Link href="/admin" className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground hover:bg-violet-500/10 hover:text-violet-500 transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-card-foreground">Contact Messages</h1>
                        <p className="text-xs text-muted-foreground">{messages.length} total messages</p>
                    </div>
                </div>
            </div>

            <div className="container py-8 max-w-4xl">
                {messages.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Mail size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm">Messages from the contact form will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-500 font-bold text-sm">
                                            {msg.name[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-card-foreground">{msg.name}</h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail size={12} /> {msg.email}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                                        <Clock size={12} />
                                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                                <p className="text-foreground leading-relaxed bg-muted/50 rounded-xl p-4 text-sm">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
