import { NextRequest, NextResponse } from 'next/server';
import { getUserChats, deleteChatSession, renameChatSession, getChatById } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  if (chatId) {
    const chat = getChatById(chatId, userId);
    if (!chat) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    return NextResponse.json({ success: true, chat });
  }

  const chats = getUserChats(userId);
  return NextResponse.json({ success: true, chats });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');

  if (!userId || !chatId) {
    return NextResponse.json({ error: 'userId and chatId are required' }, { status: 400 });
  }

  const deleted = deleteChatSession(chatId, userId);
  return NextResponse.json({ success: deleted });
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, chatId, title } = await req.json();

    if (!userId || !chatId || !title) {
      return NextResponse.json({ error: 'userId, chatId, and title are required' }, { status: 400 });
    }

    const updated = renameChatSession(chatId, userId, title);
    if (!updated) return NextResponse.json({ error: 'Chat not found' }, { status: 404 });

    return NextResponse.json({ success: true, chat: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Rename failed' }, { status: 500 });
  }
}
