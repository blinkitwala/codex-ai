import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';
import { comparePassword, hashPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let { email, password } = body;

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

    let userRecord = findUserByEmail(email);

    // If user doesn't exist yet, auto-register for seamless experience!
    if (!userRecord) {
      const passwordHash = await hashPassword(password);
      const nameFromEmail = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'User';
      const capitalizedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      
      const newUser = createUser({
        id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: capitalizedName,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(capitalizedName)}`
      });
      userRecord = { ...newUser, passwordHash };
    } else {
      // Compare password
      const isMatch = await comparePassword(password, userRecord.passwordHash);
      if (!isMatch) {
        // If account was created with Google OAuth dummy hash, update to this password so the user can log in either way!
        if (userRecord.id.startsWith('google-')) {
          const newHash = await hashPassword(password);
          userRecord.passwordHash = newHash;
          createUser(userRecord);
        } else {
          return NextResponse.json({ error: 'Incorrect password for this account.' }, { status: 401 });
        }
      }
    }

    const { passwordHash, ...user } = userRecord;
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({ success: true, user, token });
    response.cookies.set('codex_token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Login failed.' }, { status: 500 });
  }
}
