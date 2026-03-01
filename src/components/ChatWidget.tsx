"use client";

import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I am the NovaCare advanced AI Assistant. I can help diagnose your symptoms or guide you to the right specialist. How are you feeling today?" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] }),
            });

            if (!response.ok) throw new Error("Failed");

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm having trouble connecting to the diagnostic server. Please try again or call our hotline." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            {isOpen && (
                <div className="glass-card bg-card border border-border p-0 w-80 md:w-96 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden flex flex-col h-[500px] rounded-lg">
                    {/* Header */}
                    <div className="bg-primary p-4 text-primary-foreground flex justify-between items-center">
                        <div>
                            <h3 className="font-bold flex items-center gap-2 font-heading">
                                <MessageSquare size={18} className="text-primary-foreground/80" /> Grandview Assistant
                            </h3>
                            <p className="text-[10px] text-primary-foreground/70 uppercase tracking-widest font-body">Medical Support</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-primary-foreground/10 p-1 rounded transition-colors"
                            title="Close chat"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-secondary/30">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`p-3 rounded-2xl max-w-[85%] text-sm shadow-sm font-body ${m.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-tr-none'
                                        : 'bg-card border border-border text-card-foreground rounded-tl-none'
                                        }`}
                                >
                                    {m.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none text-muted-foreground shadow-sm flex items-center gap-2 font-body">
                                    <Loader2 size={16} className="animate-spin" /> Analyzing...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-card border-t border-border">
                        <div className="relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Typing symptoms..."
                                className="w-full pl-4 pr-12 py-3 rounded-full bg-secondary text-foreground text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-muted-foreground font-body"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-full w-14 h-14 p-0 shadow-lg shadow-primary/30 hover:scale-110 transition-transform flex items-center justify-center animate-bounce-subtle bg-primary text-primary-foreground"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
}
