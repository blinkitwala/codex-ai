import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter both email and password.' }, { status: 400 });
    }

    email = String(email).trim().toLowerCase();
    password = String(password).trim();

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: 'Password must be at least 4 characters.' }, { status: 400 });
    }

    const userName = (name || email.split('@')[0] || 'User').trim();

    let userRecord = findUserByEmail(email);
    if (userRecord) {
      const passwordHash = await hashPassword(password);
      userRecord.passwordHash = passwordHash;
      if (userName && userName !== 'User') {
        userRecord.name = userName;
      }
      const existingUser = createUser(userRecord);
      const token = signToken({ id: existingUser.id, email: existingUser.email, name: existingUser.name });
      const res = NextResponse.json({ success: true, user: existingUser, token });
      res.cookies.set('codex_token', token, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      });
      return res;
    }

    const passwordHash = await hashPassword(password);
    const newUser = createUser({
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: userName,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userName)}`
    });

    const token = signToken({ id: newUser.id, email: newUser.email, name: newUser.name });

    const response = NextResponse.json({ success: true, user: newUser, token });
    response.cookies.set('codex_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed.' }, { status: 500 });
  }
}
