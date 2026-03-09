import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get('userId');

    try {
        if (otherUserId) {
            // Fetch conversation with specific user
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: session.user.id, receiverId: otherUserId },
                        { senderId: otherUserId, receiverId: session.user.id }
                    ]
                },
                orderBy: { createdAt: 'asc' },
                include: {
                    sender: { select: { id: true, name: true, role: true, image: true } }
                }
            });

            // Mark as read
            await prisma.message.updateMany({
                where: {
                    senderId: otherUserId,
                    receiverId: session.user.id,
                    isRead: false
                },
                data: { isRead: true }
            });

            return NextResponse.json(messages);
        } else {
            // Fetch all recent conversations (latest message per user)
            // Since Prisma doesn't support DISTINCT ON, we'll fetch messages and group them in-memory, or just fetch all contacts

            // To be efficient, we find all unique users we chatted with
            const allMessages = await prisma.message.findMany({
                where: {
                    OR: [
                        { senderId: session.user.id },
                        { receiverId: session.user.id }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: { select: { id: true, name: true, role: true, image: true } },
                    receiver: { select: { id: true, name: true, role: true, image: true } }
                }
            });

            const conversationsMap = new Map();
            let unreadCount = 0;

            for (const msg of allMessages) {
                const otherUser = msg.senderId === session.user.id ? msg.receiver : msg.sender;
                if (!otherUser) continue;

                if (!msg.isRead && msg.receiverId === session.user.id) {
                    unreadCount++;
                }

                if (!conversationsMap.has(otherUser.id)) {
                    conversationsMap.set(otherUser.id, {
                        contact: otherUser,
                        lastMessage: msg,
                        unread: (!msg.isRead && msg.receiverId === session.user.id) ? 1 : 0
                    });
                } else if (!msg.isRead && msg.receiverId === session.user.id) {
                    conversationsMap.get(otherUser.id).unread += 1;
                }
            }

            return NextResponse.json({
                conversations: Array.from(conversationsMap.values()),
                totalUnread: unreadCount
            });
        }
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { receiverId, content } = body;

        if (!receiverId || !content.trim()) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const msg = await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId,
                content: content.trim()
            },
            include: {
                sender: { select: { id: true, name: true, role: true, image: true } }
            }
        });

        return NextResponse.json(msg);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
