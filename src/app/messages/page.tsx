"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User as UserIcon, Phone, Video, Info, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import Navbar from "@/components/Navbar";

function MessagesChat() {
    const searchParams = useSearchParams();
    const initialPatientId = searchParams.get("patient");

    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMsgs, setLoadingMsgs] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch conversations list initially
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/messages/conversations');
                const data = await res.json();
                if (data.success) {
                    setConversations(data.conversations);
                    setCurrentUserId(data.currentUserId);

                    // Auto-select if a query param user matched
                    if (initialPatientId) {
                        const target = data.conversations.find((c: any) => c.id === initialPatientId);
                        if (target) setSelectedUser(target);
                        else if (data.conversations.length > 0) setSelectedUser(data.conversations[0]);
                    } else if (data.conversations.length > 0) {
                        setSelectedUser(data.conversations[0]);
                    }
                }
            } catch (err) {
                console.error("Failed to load generic conversations", err);
            } finally {
                setLoadingChats(false);
            }
        };
        fetchConversations();
    }, [initialPatientId]);

    // Fetch Messages when selectedUser changes
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedUser) return;
            setLoadingMsgs(true);
            try {
                const res = await fetch(`/api/messages?otherUserId=${selectedUser.id}`);
                const data = await res.json();
                if (data.success) {
                    setMessages(data.messages);
                }
            } catch (err) {
                console.error("Failed to fetch msgs");
            } finally {
                setLoadingMsgs(false);
            }
        };

        fetchMessages();

        // Optional: Polling setup for new msgs
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [selectedUser]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !selectedUser) return;

        const currentInput = input;
        setInput(""); // Optimistic clear

        // Optimistic UI update
        const tempMsg = {
            id: `temp-${Date.now()}`,
            senderId: currentUserId,
            content: currentInput,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId, name: "You" }
        };
        setMessages(prev => [...prev, tempMsg]);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: selectedUser.id,
                    content: currentInput
                })
            });
            const data = await res.json();
            if (data.success) {
                // Replace temp msg with real record
                setMessages(prev => prev.map(m => m.id === tempMsg.id ? data.message : m));
            }
        } catch (err) {
            console.error("Send message failed", err);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <Navbar />
            <div className="h-20"></div> {/* Spacer for Navbar */}

            <div className="flex-1 container mx-auto py-6 flex flex-col lg:flex-row gap-6 max-h-[calc(100vh-80px)]">

                {/* Sidebar - Chat List (Hidden on mobile when chat is active) */}
                <div className={clsx("lg:flex flex-col w-full lg:w-1/3 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex-shrink-0", selectedUser ? "hidden" : "flex")}>
                    <div className="p-4 border-b border-border bg-secondary/50">
                        <h2 className="font-bold text-lg text-card-foreground">Secure Chats</h2>
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full mt-3 px-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        />
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {loadingChats ? (
                            <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                                <Loader2 className="animate-spin mb-2" />
                                Loading Contacts...
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground text-sm">
                                No active contacts found. Book an appointment to chat with doctors.
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div key={conv.id} onClick={() => setSelectedUser(conv)} className={clsx(
                                    "p-4 border-b border-border cursor-pointer hover:bg-secondary transition-colors flex items-center justify-between group relative overflow-hidden",
                                    selectedUser?.id === conv.id ? "bg-primary/10" : ""
                                )}>
                                    {selectedUser?.id === conv.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>}
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                                            {conv.name ? conv.name.substring(0, 2).toUpperCase() : "U"}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground text-sm">{conv.title || conv.name}</h4>
                                            <p className="text-xs text-muted-foreground truncate w-40">{conv.subtext}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className={clsx("flex-1 bg-card rounded-2xl border border-border shadow-sm flex-col h-[calc(100vh-140px)]", selectedUser ? "flex overflow-hidden" : "hidden lg:flex")}>

                    {selectedUser ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 border-b border-border bg-card flex justify-between items-center shadow-sm z-10">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSelectedUser(null)} className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div className="relative">
                                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                            {selectedUser.name ? selectedUser.name.substring(0, 2).toUpperCase() : "U"}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-card-foreground">{selectedUser.title || selectedUser.name}</h3>
                                        <p className="text-xs text-emerald-600 font-medium">Verified Connection</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                                        <Video size={20} />
                                    </button>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                                        <Phone size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-6 bg-secondary/50 space-y-6">
                                {loadingMsgs && messages.length === 0 ? (
                                    <div className="flex justify-center py-6 text-muted-foreground">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground text-sm">
                                        This is the beginning of your secure chat history with {selectedUser.title || selectedUser.name}.
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMe = msg.senderId === currentUserId;

                                        return (
                                            <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                                                <div className={clsx(
                                                    "max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative group whitespace-pre-wrap",
                                                    isMe
                                                        ? "bg-teal-600 text-white rounded-tr-none"
                                                        : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                                                )}>
                                                    <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    <div className={clsx(
                                                        "text-[10px] mt-2 font-medium flex items-center gap-1 opacity-70",
                                                        isMe ? "text-teal-100 justify-end" : "text-slate-400 justify-start"
                                                    )}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                <form onSubmit={handleSend} className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your secure message..."
                                        className="flex-1 bg-transparent border-none resize-none px-4 py-2 max-h-32 min-h-[44px] text-sm focus:outline-none focus:ring-0"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend(e as unknown as React.FormEvent);
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50 disabled:hover:bg-teal-600 mb-0.5 shadow-sm"
                                    >
                                        <Send size={18} className="ml-0.5" />
                                    </button>
                                </form>
                                <p className="text-center text-[10px] text-slate-400 mt-2 font-medium">Medical information shared here is strictly confidential and end-to-end encrypted.</p>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <Info size={24} />
                            </div>
                            <p className="font-semibold text-lg text-foreground">No Conversation Selected</p>
                            <p className="text-sm mt-2 text-center max-w-sm">Choose a contact from the sidebar to view chat history or explicitly send secure messages.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
            <MessagesChat />
        </Suspense>
    );
}
