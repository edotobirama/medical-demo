import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const url = new URL(req.url);
        const range = url.searchParams.get('range') || 'monthly'; // 'daily' or 'monthly'
        const period = url.searchParams.get('period') || '30'; // days back

        const doctorProfile = await prisma.doctorProfile.findUnique({
            where: { userId: session.user.id }
        });

        if (!doctorProfile) {
            return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
        }

        const daysBack = parseInt(period) || 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);
        startDate.setHours(0, 0, 0, 0);

        // Fetch all appointments for the doctor within the period
        const appointments = await prisma.appointment.findMany({
            where: {
                doctorId: doctorProfile.id,
                createdAt: { gte: startDate }
            },
            include: {
                slot: true,
                patient: { include: { user: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        // --- Build analytics data ---

        // 1. Patient Volume Over Time (Line Graph data)
        const volumeData = buildVolumeData(appointments, range, daysBack);

        // 2. Appointment Status Distribution (for histogram)
        const statusDistribution = buildStatusDistribution(appointments);

        // 3. Disease/Condition Distribution (from issueDescription)
        const diseaseDistribution = buildDiseaseDistribution(appointments);

        // 4. Appointment Type Distribution (Online vs In-Person)
        const typeDistribution = buildTypeDistribution(appointments);

        // 5. Daily disease trends
        const diseaseTrends = buildDiseaseTrends(appointments, range, daysBack);

        // 6. Summary stats
        const totalAppointments = appointments.length;
        const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
        const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
        const onlineAppointments = appointments.filter(a => a.type === 'ONLINE').length;
        const offlineAppointments = appointments.filter(a => a.type !== 'ONLINE').length;
        const totalRevenue = appointments.reduce((sum, a) => sum + (a.amountPaid || 0), 0);
        const avgDuration = appointments
            .filter(a => a.actualStartTime && a.actualEndTime)
            .reduce((sum, a) => {
                const diff = new Date(a.actualEndTime!).getTime() - new Date(a.actualStartTime!).getTime();
                return sum + diff / 60000; // minutes
            }, 0);
        const avgDurationMinutes = appointments.filter(a => a.actualStartTime && a.actualEndTime).length > 0
            ? Math.round(avgDuration / appointments.filter(a => a.actualStartTime && a.actualEndTime).length)
            : 0;

        return NextResponse.json({
            success: true,
            analytics: {
                volumeData,
                statusDistribution,
                diseaseDistribution,
                typeDistribution,
                diseaseTrends,
                summary: {
                    totalAppointments,
                    completedAppointments,
                    cancelledAppointments,
                    onlineAppointments,
                    offlineAppointments,
                    totalRevenue,
                    avgDurationMinutes,
                    periodDays: daysBack
                }
            }
        });
    } catch (e: any) {
        console.error('Analytics error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

function buildVolumeData(appointments: any[], range: string, daysBack: number) {
    const dataMap = new Map<string, number>();
    const now = new Date();

    if (range === 'daily') {
        // Last N days
        for (let i = daysBack; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0]; // YYYY-MM-DD
            dataMap.set(key, 0);
        }

        appointments.forEach(a => {
            const date = new Date(a.slot?.startTime || a.requestedTime || a.createdAt);
            const key = date.toISOString().split('T')[0];
            if (dataMap.has(key)) {
                dataMap.set(key, (dataMap.get(key) || 0) + 1);
            }
        });
    } else {
        // Monthly — group by month
        for (let i = Math.min(daysBack, 365); i >= 0; i -= 30) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            dataMap.set(key, 0);
        }
        // Ensure current month exists
        const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!dataMap.has(currentKey)) dataMap.set(currentKey, 0);

        appointments.forEach(a => {
            const date = new Date(a.slot?.startTime || a.requestedTime || a.createdAt);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (dataMap.has(key)) {
                dataMap.set(key, (dataMap.get(key) || 0) + 1);
            }
        });
    }

    return Array.from(dataMap.entries()).map(([label, value]) => ({ label, value }));
}

function buildStatusDistribution(appointments: any[]) {
    const counts: Record<string, number> = {};
    appointments.forEach(a => {
        const status = a.status || 'UNKNOWN';
        counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function buildDiseaseDistribution(appointments: any[]) {
    const counts: Record<string, number> = {};

    appointments.forEach(a => {
        const issue = a.issueDescription || a.notes;
        if (!issue) {
            counts['Unspecified'] = (counts['Unspecified'] || 0) + 1;
            return;
        }

        // Extract condition keywords from the issue description
        const condition = categorizeCondition(issue);
        counts[condition] = (counts[condition] || 0) + 1;
    });

    return Object.entries(counts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10); // Top 10
}

function categorizeCondition(text: string): string {
    const lower = text.toLowerCase();

    const categories: [string, string[]][] = [
        ['Respiratory', ['cough', 'cold', 'flu', 'fever', 'sore throat', 'breathing', 'asthma', 'bronchitis', 'pneumonia', 'congestion', 'sinusitis']],
        ['Cardiovascular', ['heart', 'chest pain', 'blood pressure', 'hypertension', 'palpitation', 'cardiac', 'cholesterol']],
        ['Gastrointestinal', ['stomach', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'abdominal', 'digestive', 'acid reflux', 'gastritis']],
        ['Musculoskeletal', ['back pain', 'joint', 'muscle', 'arthritis', 'sprain', 'fracture', 'knee', 'shoulder', 'neck pain']],
        ['Dermatological', ['skin', 'rash', 'eczema', 'acne', 'allergy', 'itching', 'dermatitis', 'hives']],
        ['Neurological', ['headache', 'migraine', 'dizziness', 'seizure', 'numbness', 'tingling', 'nerve']],
        ['Endocrine', ['diabetes', 'thyroid', 'hormone', 'insulin', 'sugar levels']],
        ['Mental Health', ['anxiety', 'depression', 'stress', 'insomnia', 'sleep', 'panic', 'mental']],
        ['ENT', ['ear', 'nose', 'throat', 'hearing', 'tonsil', 'sinus']],
        ['General Checkup', ['checkup', 'check-up', 'routine', 'follow-up', 'followup', 'annual', 'screening', 'consultation']],
    ];

    for (const [category, keywords] of categories) {
        if (keywords.some(kw => lower.includes(kw))) {
            return category;
        }
    }

    return 'Other';
}

function buildTypeDistribution(appointments: any[]) {
    const online = appointments.filter(a => a.type === 'ONLINE').length;
    const offline = appointments.filter(a => a.type !== 'ONLINE').length;
    return [
        { label: 'Online', value: online },
        { label: 'In-Person', value: offline }
    ];
}

function buildDiseaseTrends(appointments: any[], range: string, daysBack: number) {
    // Build a time-series of disease categories
    const timeMap = new Map<string, Record<string, number>>();
    const now = new Date();

    if (range === 'daily') {
        for (let i = Math.min(daysBack, 14); i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            timeMap.set(key, {});
        }
    } else {
        for (let i = Math.min(daysBack, 365); i >= 0; i -= 30) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            timeMap.set(key, {});
        }
        const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!timeMap.has(currentKey)) timeMap.set(currentKey, {});
    }

    appointments.forEach(a => {
        const date = new Date(a.slot?.startTime || a.requestedTime || a.createdAt);
        let key: string;
        if (range === 'daily') {
            key = date.toISOString().split('T')[0];
        } else {
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        }

        if (timeMap.has(key)) {
            const condition = categorizeCondition(a.issueDescription || a.notes || '');
            const bucket = timeMap.get(key)!;
            bucket[condition] = (bucket[condition] || 0) + 1;
        }
    });

    return Array.from(timeMap.entries()).map(([label, conditions]) => ({
        label,
        conditions
    }));
}
