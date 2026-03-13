import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST: Upload a prescription image file to disk
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'DOCTOR') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const formData = await req.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type — images only for prescriptions
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({
                error: 'Invalid file type. Please upload JPG, PNG, WebP, or PDF files.'
            }, { status: 400 });
        }

        // Max 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Save file to public/uploads/prescriptions
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'prescriptions');
        await mkdir(uploadsDir, { recursive: true });

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `prescription-${Date.now()}.${ext}`;
        const filePath = path.join(uploadsDir, fileName);
        const fileUrl = `/uploads/prescriptions/${fileName}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            fileUrl
        });
    } catch (e: any) {
        console.error('Prescription upload error:', e);
        return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
    }
}
