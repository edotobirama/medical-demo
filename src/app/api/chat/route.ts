import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// This acts as a fallback diagnostic engine if no API key is present
const MOCK_DIAGNOSTIC_FLOW = [
    "I understand. Can you tell me how long you've been experiencing these symptoms? (e.g. 2 days, a week)",
    "On a scale of 1-10, how severe is the pain/discomfort right now?",
    "Do you have any existing medical conditions or allergies we should be aware of?",
    "Thank you. Based on your inputs, I recommend booking a consultation with a General Practitioner. Would you like me to redirect you to the booking page?"
];

export async function POST(request: Request) {
    try {
        const { messages } = await request.json();
        const userMessage = messages[messages.length - 1].content;

        // 1. Check for OpenAI Key
        const apiKey = process.env.OPENAI_API_KEY;

        if (apiKey && apiKey.startsWith('sk-')) {
            // REAL LLM CALL
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an advanced AI medical assistant for NovaCare. Your goal is to ask clarifying diagnostic questions to the patient one by one. Be professional, empathetic, and concise. Do NOT provide a medical diagnosis, but gather symptoms to prepare for a doctor's visit. Keep responses short (under 50 words)." },
                    ...messages
                ],
                model: "gpt-3.5-turbo",
            });
            return NextResponse.json({
                role: 'assistant',
                content: completion.choices[0].message.content
            });
        } else {
            // MOCK FALLBACK (so the user sees "functionality" right away)
            // Simple logic: return the next question based on message count
            const turnIndex = Math.floor(messages.length / 2);
            const reply = MOCK_DIAGNOSTIC_FLOW[turnIndex] || "I have noted all your symptoms. Please proceed to book an appointment for a full checkup.";

            // Add a small artificial delay to simulate "thinking"
            await new Promise(resolve => setTimeout(resolve, 1000));

            return NextResponse.json({
                role: 'assistant',
                content: reply
            });
        }

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
    }
}
