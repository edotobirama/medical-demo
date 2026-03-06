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
            // MOCK FALLBACK
            const lowerMsg = userMessage.toLowerCase();
            let reply = "";

            if (lowerMsg.match(/\b(hi|hello|hey|greetings)\b/)) {
                reply = "Hello there! What specific symptoms or health concerns can I help you with today?";
            } else if (lowerMsg.match(/\b(headache|pain|fever|cough|sick|stomach|nausea)\b/)) {
                reply = "I'm sorry to hear that. How long have you been experiencing these symptoms? (e.g., 2 days, a week)";
            } else if (lowerMsg.match(/\b(day|days|week|weeks|month|months|today|yesterday)\b/)) {
                reply = "I understand. On a scale of 1-10, how severe is the discomfort right now?";
            } else if (lowerMsg.match(/\b([1-9]|10|one|two|three|four|five|six|seven|eight|nine|ten)\b/)) {
                reply = "Thank you. Do you have any existing medical conditions or allergies we should be aware of log in your file?";
            } else if (lowerMsg.match(/\b(no|none|yes|asthma|diabetes|allergy|allergies)\b/)) {
                reply = "Got it. Based on your symptoms, I recommend booking a consultation with one of our General Practitioners. Would you like to book an appointment?";
            } else if (lowerMsg.match(/\b(sure|yes|book|appointment|ok|okay)\b/)) {
                reply = "Great! You can book a time by clicking the 'Book Appointment' button in the navigation bar.";
            } else {
                reply = "Thank you for the information. Please remember I am an AI assistant and this is not a medical diagnosis. I recommend seeing a doctor for a full checkup.";
            }

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
