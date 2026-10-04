import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { findUserByEmail, ensureDbExists } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryUserId = searchParams.get('userId');

    const token = req.cookies.get('codex_token')?.value || 
                  req.headers.get('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.email) {
        const userRecord = findUserByEmail(decoded.email);
        if (userRecord) {
          const { passwordHash, ...user } = userRecord;
          return NextResponse.json({ authenticated: true, user });
        }
      }
    }

    // Fallback: If queryUserId is provided
    if (queryUserId) {
      const db = ensureDbExists();
      const user = db.users.find(u => u.id === queryUserId);
      if (user) {
        const { passwordHash, ...publicUser } = user;
        return NextResponse.json({ authenticated: true, user: publicUser });
      }
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.set('codex_token', '', {
    httpOnly: false,
    secure: false,
    maxAge: 0,
    path: '/'
  });
  return response;
}
