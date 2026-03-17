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
                    differentials: [
                        { name: 'Awaiting patient data', confidence: 'low', reasoning: 'No symptoms discussed yet' }
                    ],
                    suggestedQuestions: [
                        'What brings you in today?',
                        'When did your symptoms first begin?',
                        'Are you currently taking any medications?'
                    ],
                    recommendedTests: [],
                    treatmentPaths: [],
                    keySymptoms: [],
                    urgencyLevel: 'routine',
                    analysisNote: 'Conversation has not started yet. Initial assessment questions are suggested.'
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

        const possibilities = await generateLivePossibilities(promptContext, transcripts.length);

        return NextResponse.json({
            success: true,
            possibilities
        });
    } catch (e: any) {
        console.error('Live possibilities error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

interface PossibilityItem {
    name: string;
    confidence: 'high' | 'medium' | 'low';
    reasoning?: string;
}

interface LivePossibilities {
    differentials: PossibilityItem[];
    suggestedQuestions: string[];
    recommendedTests: string[];
    treatmentPaths: string[];
    keySymptoms: string[];
    urgencyLevel: 'routine' | 'moderate' | 'urgent';
    analysisNote: string;
}

async function generateLivePossibilities(context: string, transcriptCount: number): Promise<LivePossibilities> {
    const apiKey = process.env['GEMINI-API-KEY'] || process.env.GEMINI_API_KEY;

<<<<<<< Updated upstream
    if (apiKey) {
        try {
            const systemPrompt = `You are an AI clinical decision support assistant for a doctor during a live consultation. 
Analyze the ongoing transcript and generate structured insights. Return ONLY valid JSON with no markdown wrapping, containing this exact structure:
=======
    if (!apiKey) {
        throw new Error('Missing Gemini API Key');
    }

    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are an AI clinical decision support assistant for a doctor during a live consultation. 
Analyze the ongoing transcript and generate structured insights. 
You must return a valid JSON object matching this exact schema:
>>>>>>> Stashed changes
{
  "differentials": [{"name": "Diagnosis Name", "confidence": "high" | "medium" | "low", "reasoning": "Brief reasoning"}],
  "suggestedQuestions": ["Question to ask the patient"],
  "recommendedTests": ["Test name"],
  "treatmentPaths": ["Treatment recommendation"],
  "keySymptoms": ["symptom mentioned"],
  "urgencyLevel": "routine" | "moderate" | "urgent",
  "analysisNote": "Brief summary of analysis"
}
Rules:
- List differentials in order of likelihood, maximum 5
- confidence: "high" = strong evidence, "medium" = possible, "low" = should consider
- suggestedQuestions should help narrow the diagnosis
- treatmentPaths should be practical, evidence-based suggestions
- keySymptoms should extract the main symptoms mentioned by the patient
<<<<<<< Updated upstream
- urgencyLevel reflects overall clinical urgency based on the conversation`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: context }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                console.error("Gemini API Error:", await response.text());
                throw new Error("Gemini API request failed");
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

            try {
                return JSON.parse(content);
            } catch {
                return getSmartDefaultPossibilities(transcriptCount);
            }
        } catch (e) {
            console.error('Gemini possibilities error:', e);
            return getSmartDefaultPossibilities(transcriptCount);
        }
    }
=======
- urgencyLevel reflects overall clinical urgency based on the conversation

Consultation Transcript:
${context}
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
>>>>>>> Stashed changes

        const content = response.text || '{}';
        return JSON.parse(content);
        
    } catch (e) {
        console.error('Gemini possibilities error:', e);
        throw new Error('Failed to generate insights from Gemini.');
    }
}
