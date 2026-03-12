import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST: Save a transcript segment
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { appointmentId, text, language, speakerRole } = body;

        if (!appointmentId || !text) {
            return NextResponse.json({ error: 'Missing appointmentId or text' }, { status: 400 });
        }

        // Translate to English if not English
        let englishText: string | null = null;
        if (language && language !== 'en') {
            englishText = await translateToEnglish(text, language);
        }

        const transcript = await (prisma as any).consultationTranscript.create({
            data: {
                appointmentId,
                originalText: text,
                language: language || 'en',
                englishText,
                // ALWAYS use server-side session role — never trust client-sent speakerRole
                speakerRole: (session.user as any).role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT',
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
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey.startsWith('sk-')) {
        try {
            const OpenAI = (await import('openai')).default;
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical translator. Translate the following text from ${fromLang} to English. Preserve medical terminology accurately. Only output the translation, nothing else.`
                    },
                    { role: 'user', content: text }
                ],
                model: 'gpt-3.5-turbo',
            });
            return completion.choices[0].message.content || text;
        } catch (e) {
            console.error('Translation error:', e);
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
