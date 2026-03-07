import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// GET /api/messages?otherUserId=xxx
export async function GET(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const otherUserId = searchParams.get('otherUserId');

        if (!otherUserId) {
            return NextResponse.json({ error: "otherUserId required" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch messages between these two users
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: currentUser.id, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUser.id }
                ]
            },
            orderBy: {
                createdAt: 'asc'
            },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        return NextResponse.json({ success: true, messages, currentUserId: currentUser.id });
    } catch (e: any) {
        console.error("Fetch Messages API Error:", e);
        return NextResponse.json({ error: e.message || "Failed to fetch messages" }, { status: 500 });
    }
}

// POST /api/messages
export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { receiverId, content } = body;

        if (!receiverId || !content) {
            return NextResponse.json({ error: "receiverId and content required" }, { status: 400 });
        }

        const currentUser = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const message = await prisma.message.create({
            data: {
                senderId: currentUser.id,
                receiverId,
                content
            },
            include: {
                sender: { select: { id: true, name: true, role: true } }
            }
        });

        return NextResponse.json({ success: true, message });
    } catch (e: any) {
        console.error("Create Message API Error:", e);
        return NextResponse.json({ error: e.message || "Failed to send message" }, { status: 500 });
    }
}
