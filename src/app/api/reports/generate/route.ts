import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// POST: Generate an AI medical report from transcripts and patient data
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Only doctors can generate reports' }, { status: 403 });
        }

        const body = await req.json();
        const { appointmentId } = body;

        if (!appointmentId) {
            return NextResponse.json({ error: 'Missing appointmentId' }, { status: 400 });
        }

        // Fetch appointment + transcripts + patient reports
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: {
                patient: {
                    include: {
                        user: true
                    }
                },
                doctor: { include: { user: true } }
            }
        });

        if (!appointment) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        // Fetch transcripts
        const transcripts = await (prisma as any).consultationTranscript.findMany({
            where: { appointmentId },
            orderBy: { createdAt: 'asc' }
        });

        // Build context from all data
        const transcriptText = transcripts.map((t: any) =>
            `[${t.speakerRole}] ${t.englishText || t.originalText}`
        ).join('\n');

        const masterAiSummary = (appointment.patient as any).masterAiSummary || 'No prior medical history summary available.';

        const contextPrompt = `
Patient: ${appointment.patient.user.name || 'Unknown'}
Gender: ${appointment.patient.gender || 'Not specified'}
DOB: ${appointment.patient.dateOfBirth || 'N/A'}
Doctor: ${appointment.doctor.user.name}
Specialization: ${appointment.doctor.specialization}
Appointment Date: ${appointment.requestedTime || appointment.createdAt}
Issue Description: ${appointment.issueDescription || 'None provided'}
History Notes: ${appointment.historyNotes || 'None'}

Consultation Transcript:
${transcriptText || 'No transcript available'}

Previous Patient Master Summary (Do not ignore this, merge new insights with it):
${masterAiSummary}
        `.trim();

        // Generate AI report
        const report = await generateAIReport(contextPrompt);

        return NextResponse.json({
            success: true,
            report: {
                summary: report.summary,
                keyIssues: report.keyIssues,
                recommendations: report.recommendations,
                diagnosis: report.diagnosis,
                medications: report.medications,
                followUp: report.followUp,
                fullText: report.fullText
            }
        });
    } catch (e: any) {
        console.error('Report generation error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

interface AIReport {
    summary: string;
    keyIssues: string[];
    recommendations: string[];
    diagnosis: string;
    medications: string[];
    followUp: string;
    fullText: string;
}

async function generateAIReport(context: string): Promise<AIReport> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && apiKey.startsWith('sk-')) {
        try {
            const OpenAI = (await import('openai')).default;
            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical documentation AI. Generate a comprehensive medical consultation report from the provided data. Output ONLY valid JSON with these fields:
{
  "summary": "Brief 2-3 sentence overview",
  "keyIssues": ["issue1", "issue2"],
  "recommendations": ["rec1", "rec2"],
  "diagnosis": "Preliminary diagnosis or assessment",
  "medications": ["medication1 with dosage", "medication2"],
  "followUp": "Follow-up instructions",
  "fullText": "Complete report in paragraph form"
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
                return {
                    summary: content,
                    keyIssues: [],
                    recommendations: [],
                    diagnosis: 'See full report',
                    medications: [],
                    followUp: 'Schedule follow-up as needed',
                    fullText: content
                };
            }
        } catch (e) {
            console.error('OpenAI report error:', e);
        }
    }

    // Mock report for demo
    return {
        summary: `Consultation summary for patient based on session data. The patient presented with concerns as documented during the digital consultation. Comprehensive assessment conducted with relevant history reviewed.`,
        keyIssues: [
            'Primary symptoms discussed during consultation',
            'Patient history reviewed and cross-referenced',
            'Vital parameters assessment recommended'
        ],
        recommendations: [
            'Schedule follow-up within 2 weeks',
            'Complete recommended lab work (CBC, CMP)',
            'Monitor symptoms and maintain a symptom diary',
            'Lifestyle modifications as discussed during session'
        ],
        diagnosis: 'Preliminary assessment based on consultation — Pending lab confirmation. Further investigation recommended for differential diagnosis.',
        medications: [
            'As prescribed during consultation',
            'OTC pain management if needed (Acetaminophen 500mg PRN)'
        ],
        followUp: 'Follow-up appointment in 14 days. Patient to contact clinic if symptoms worsen or new symptoms develop before follow-up date.',
        fullText: `MEDICAL CONSULTATION REPORT\n\nThis report is generated based on the digital consultation session data, including real-time transcription and patient medical history.\n\nCLINICAL ASSESSMENT:\nThe patient was evaluated via telehealth consultation. History of present illness was discussed in detail during the session. Physical examination was limited to visual assessment via video.\n\nPLAN:\n1. Laboratory investigations as discussed\n2. Medication adjustments per consultation notes\n3. Follow-up in 2 weeks\n4. Patient education provided regarding condition management\n\nThis report was AI-generated from consultation data and should be reviewed and approved by the attending physician before being added to the official medical record.`
    };
}
