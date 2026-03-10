import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Only doctors can access live possibilities' }, { status: 403 });
        }

        const body = await req.json();
        const { appointmentId } = body;

        if (!appointmentId) {
            return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }

        // Fetch the recent transcripts for this appointment
        const transcripts = await (prisma as any).consultationTranscript.findMany({
            where: { appointmentId },
            orderBy: { createdAt: 'desc' },
            take: 30 // Get the last 30 interactions
        });

        if (transcripts.length === 0) {
            return NextResponse.json({
                success: true,
                possibilities: {
                    differentials: ['Not enough data yet'],
                    suggestedQuestions: ['Ask the patient about their primary symptoms'],
                    recommendedTests: ['Wait for more information']
                }
            });
        }

        // Reverse to chronological order
        transcripts.reverse();

        const transcriptText = transcripts.map((t: any) =>
            `[${t.speakerRole}] ${t.englishText || t.originalText}`
        ).join('\n');

        const promptContext = `
You are a real-time medical AI assistant helping a doctor during an ongoing consultation. 
Based ONLY on the recent transcript of the conversation, provide actionable "Live Possibilities".
Keep them concise and highly relevant.

Recent Transcript:
${transcriptText}
        `.trim();

        const possibilities = await generateLivePossibilities(promptContext);

        return NextResponse.json({
            success: true,
            possibilities
        });
    } catch (e: any) {
        console.error('Live possibilities error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

interface LivePossibilities {
    differentials: string[];
    suggestedQuestions: string[];
    recommendedTests: string[];
}

async function generateLivePossibilities(context: string): Promise<LivePossibilities> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey.startsWith('sk-')) {
        try {
            const OpenAI = (await import('openai')).default;
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant for a doctor during a live consultation. Generate short, actionable insights based on the ongoing transcript. Return ONLY valid JSON:
{
  "differentials": ["Possible Diagnosis A", "Possible Diagnosis B"],
  "suggestedQuestions": ["Question 1 to ask patient", "Question 2"],
  "recommendedTests": ["Test 1", "Test 2"]
}`
                    },
                    { role: 'user', content: context }
                ],
                model: 'gpt-3.5-turbo',
            });

            const content = completion.choices[0].message.content || '{}';
            try {
                return JSON.parse(content);
            } catch {
                return getDefaultPossibilities();
            }
        } catch (e) {
            console.error('OpenAI possibilities error:', e);
            return getDefaultPossibilities();
        }
    }

    return getDefaultPossibilities();
}

function getDefaultPossibilities(): LivePossibilities {
    return {
        differentials: ['Viral Upper Respiratory Infection', 'Allergic Rhinitis', 'Acute Sinusitis'],
        suggestedQuestions: [
            'How long have these symptoms been present?',
            'Are you experiencing any fever or chills?',
            'Do you have any known allergies?'
        ],
        recommendedTests: ['Complete Blood Count (CBC)', 'Swab for strep/flu if indicated']
    };
}
