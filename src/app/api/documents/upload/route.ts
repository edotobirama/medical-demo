import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST: Upload a document (PDF or DOCX)
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string || 'Untitled Document';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Please upload PDF, DOCX, JPG, or PNG files.'
            }, { status: 400 });
        }

        // Max 10MB
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 });
        }

        // Get patient profile
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { patientProfile: true }
        });

        if (!user?.patientProfile) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }

        // Determine file extension
        const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf';
        const fileType = ext.toUpperCase();

        // Save file to public/uploads
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documents');
        await mkdir(uploadsDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, fileName);
        const fileUrl = `/uploads/documents/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Save to database (cast to any until Prisma client regenerates with fileSize)
        const report = await (prisma.medicalReport as any).create({
            data: {
                patientId: user.patientProfile.id,
                uploadedById: user.id,
                title,
                fileUrl,
                fileType,
                fileSize: file.size
            }
        });

        return NextResponse.json({
            success: true,
            report: {
                id: report.id,
                title: report.title,
                fileUrl: report.fileUrl,
                fileType: report.fileType,
                fileSize: (report as any).fileSize,
                createdAt: report.createdAt
            }
        });
    } catch (e: any) {
        console.error('Document upload error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}

// GET: List patient documents
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { patientProfile: true }
        });

        if (!user?.patientProfile) {
            return NextResponse.json({ error: 'Patient profile not found' }, { status: 404 });
        }

        const reports = await prisma.medicalReport.findMany({
            where: { patientId: user.patientProfile.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ documents: reports });
    } catch (e: any) {
        console.error('Document list error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}
