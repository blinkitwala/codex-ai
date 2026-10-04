import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let rawEmail = body.email;
    if (!rawEmail || !rawEmail.includes('@')) {
      rawEmail = 'google.user@codex.ai';
    }
    const email = String(rawEmail).trim().toLowerCase();
    
    let rawName = body.name;
    if (!rawName || rawName === 'Google User') {
      const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ');
      rawName = prefix.charAt(0).toUpperCase() + prefix.slice(1) || 'Google User';
    }
    const name = String(rawName).trim();

    let userRecord = findUserByEmail(email);
    if (!userRecord) {
      const dummyHash = await hashPassword('google_oauth_secret_hash');
      const newUser = createUser({
        id: `google-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name,
        email,
        passwordHash: dummyHash,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
      });
      userRecord = { ...newUser, passwordHash: dummyHash };
    }

    const { passwordHash, ...user } = userRecord;
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({ success: true, user, token });
    response.cookies.set('codex_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Google Auth failed.' }, { status: 500 });
  }
}
