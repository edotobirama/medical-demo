"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, User as UserIcon, Phone, Video, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import Navbar from "@/components/Navbar";

function MessagesChat() {
    const searchParams = useSearchParams();
    const patientIdParam = searchParams.get("patient");

    const [messages, setMessages] = useState([
        { id: 1, sender: "doctor", text: "Hello! How have you been feeling since your last dosage change?", time: "10:00 AM" },
        { id: 2, sender: "patient", text: "Hi Dr. Sarah, I've been feeling much better. The headaches are mostly gone.", time: "10:15 AM" },
        { id: 3, sender: "doctor", text: "That is excellent news. Let's keep the current dosage for another two weeks.", time: "10:18 AM" },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: patientIdParam ? "doctor" : "patient", // Mock toggle based on how it was accessed
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setInput("");

        // Mock reply
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: patientIdParam ? "patient" : "doctor",
                text: "Got it, I've received your message. I will follow up shortly.",
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />
            <div className="h-20"></div> {/* Spacer for Navbar */}

            <div className="flex-1 container mx-auto py-6 flex flex-col lg:flex-row gap-6 max-h-[calc(100vh-80px)]">

                {/* Sidebar - Chat List (Hidden on mobile when chat is active) */}
                <div className="hidden lg:flex flex-col w-1/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-lg text-slate-800">Recent Conversations</h2>
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full mt-3 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                        />
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {/* Active Chat Item */}
                        <div className="p-4 border-b border-slate-100 bg-teal-50/30 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between group relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold border-2 border-white shadow-sm">
                                    {patientIdParam ? "JD" : "DS"}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{patientIdParam ? "John Doe" : "Dr. Sarah Wilson"}</h4>
                                    <p className="text-xs text-slate-500 truncate w-40">That is excellent news. Let's...</p>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-400 font-medium">10:18 AM</div>
                        </div>

                        {/* Mock Other Chats */}
                        {[1, 2].map(i => (
                            <div key={i} className="p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-3 opacity-60">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                        M
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">System Update</h4>
                                        <p className="text-xs text-slate-500 truncate w-40">Your lab results are ready to v...</p>
                                    </div>
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">Yesterday</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)]">

                    {/* Chat Header */}
                    <div className="px-6 py-4 border-b border-slate-100 bg-white flex justify-between items-center shadow-sm z-10">
                        <div className="flex items-center gap-4">
                            <Link href={patientIdParam ? "/doctor" : "/patient"} className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                                <ArrowLeft size={20} />
                            </Link>
                            <div className="relative">
                                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                    {patientIdParam ? "JD" : "DS"}
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{patientIdParam ? "John Doe" : "Dr. Sarah Wilson"}</h3>
                                <p className="text-xs text-emerald-600 font-medium">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors">
                                <Video size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                                <Phone size={20} />
                            </button>
                            <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors hidden sm:flex">
                                <Info size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-6">
                        <div className="text-center">
                            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full">Today</span>
                        </div>

                        {messages.map((msg) => {
                            const isMe = (patientIdParam && msg.sender === 'doctor') || (!patientIdParam && msg.sender === 'patient');

                            return (
                                <div key={msg.id} className={clsx("flex", isMe ? "justify-end" : "justify-start")}>
                                    <div className={clsx(
                                        "max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative group",
                                        isMe
                                            ? "bg-teal-600 text-white rounded-tr-none"
                                            : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                                    )}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <div className={clsx(
                                            "text-[10px] mt-2 font-medium flex items-center gap-1",
                                            isMe ? "text-teal-100 justify-end" : "text-slate-400 justify-start"
                                        )}>
                                            {msg.time}
                                            {isMe && <span className="ml-1">✓✓</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="flex items-end gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-transparent border-none resize-none px-4 py-2 max-h-32 min-h-[44px] text-sm focus:outline-none focus:ring-0"
                                rows={1}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend(e);
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

                </div>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Messages...</div>}>
            <MessagesChat />
        </Suspense>
    );
}
