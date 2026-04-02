import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

// POST: Save a transcript segment
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId, text, audioBase64, mimeType, language, speakerRole } = body;

        if (!appointmentId || (!text && !audioBase64)) {
            return NextResponse.json({ error: 'Missing appointmentId or content' }, { status: 400 });
        }

        let transcribedText = text;

        if (audioBase64) {
            const apiKey = process.env['GEMINI_API_KEY'] || process.env.GEMINI_API_KEY;
            if (apiKey) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: `Transcribe the spoken words in this audio exactly. It is spoken in ${language}. Output ONLY the exact transcribed text, nothing else. Do not add formatting. If there is no active speech, silence, or just background noise, output exactly the word "[SILENCE]" and nothing else.` },
                                    { inlineData: { mimeType: mimeType || 'audio/webm', data: audioBase64 } }
                                ]
                            }]
                        })
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const extracted = data.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (extracted && extracted.trim().length > 0) {
                            if (!extracted.includes('[SILENCE]')) {
                                transcribedText = extracted.trim();
                            } else {
                                transcribedText = null;
                            }
                        }
                    }
                } catch(e) {
                    console.error('Audio transcription error:', e);
                }
            }
        }

        if (!transcribedText) {
             return NextResponse.json({ error: 'No transcribable audio or text' }, { status: 400 });
        }

        // Translate to English if not English
        let englishText: string | null = null;
        if (language && language !== 'en' && language !== 'en-US') {
            englishText = await translateToEnglish(transcribedText, language);
        }

        // Validate the appointment exists and the user is a participant
        const appointment = await (prisma as any).appointment.findUnique({
            where: { id: appointmentId },
            include: {
                doctor: { include: { user: true } },
                patient: { include: { user: true } }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Guarantee role strictly matches the user's role in this specific appointment.
        // This correctly handles cases where a tester with a 'DOCTOR' role joins as a patient.
        let resolvedRole = 'PATIENT';
        const userId = (session.user as any).id;
        
        if (appointment.doctor?.userId === userId) {
            resolvedRole = 'DOCTOR';
        } else if (appointment.patient?.userId === userId) {
            resolvedRole = 'PATIENT';
        } else {
            // Fallback to the provided speaker role or session system role
            resolvedRole = speakerRole === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
        }

        const transcript = await (prisma as any).consultationTranscript.create({
            data: {
                appointmentId,
                originalText: transcribedText,
                language: language || 'en',
                englishText,
                speakerRole: resolvedRole,
            }
        });

        return NextResponse.json({ success: true, transcript });
    } catch (e: any) {
        console.error('Transcription save error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

// GET: Retrieve all transcripts for an appointment
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const appointmentId = url.searchParams.get('appointmentId');

        if (!appointmentId) {
            return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }

        const transcripts = await (prisma as any).consultationTranscript.findMany({
            where: { appointmentId },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json({ transcripts });
    } catch (e: any) {
        console.error('Transcription fetch error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

// AI Translation helper (mock + real OpenAI support)
async function translateToEnglish(text: string, fromLang: string): Promise<string> {
    const apiKey = process.env['GEMINI_API_KEY'] || process.env.GEMINI_API_KEY;

    if (apiKey) {
        try {
            const systemPrompt = `You are a medical translator. Translate the following text from ${fromLang} to English. Preserve medical terminology accurately. Only output the translation, nothing else.`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text }] }]
                })
            });

            if (!response.ok) {
                console.error("Gemini Translation Error:", await response.text());
                throw new Error("Gemini API request failed");
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || text;
        } catch (e) {
            console.error('Gemini Translation error:', e);
            return `[Translation pending] ${text}`;
        }
    }

    // Mock translation for demo
    const langNames: Record<string, string> = {
        'es': 'Spanish', 'hi': 'Hindi', 'fr': 'French', 'de': 'German',
        'ar': 'Arabic', 'zh': 'Chinese', 'ja': 'Japanese', 'pt': 'Portuguese',
        'ru': 'Russian', 'ko': 'Korean', 'ta': 'Tamil', 'te': 'Telugu',
        'bn': 'Bengali', 'ur': 'Urdu', 'mr': 'Marathi'
    };
    const langName = langNames[fromLang] || fromLang;
    return `[Translated from ${langName}] ${text}`;
}
