import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { verifyPassword, signSessionToken, hashPassword } from '@/lib/auth';
import { generateMaleAvatarSvg } from '@/lib/avatars';
import { AuthUser } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, rememberMe } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ success: false, error: 'Email or Username is required.' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required.' }, { status: 400 });
    }

    const identifier = username.trim();

    // 1. Dedicated Admin Login Check
    if (identifier.toLowerCase() === 'admin' && (password === 'admin123' || password === 'admin')) {
      const adminUser: AuthUser = {
        id: 'admin-1',
        username: 'Admin',
        age: 32,
        orientation: 'Gay',
        role: 'admin',
        avatar: generateMaleAvatarSvg('admin', {
          bgGradient: ['#1E1B4B', '#6C3BFF'],
          skinTone: '#D4976A',
          hairColor: '#17152A',
          hairStyle: 'side-part',
          beardStyle: 'trim',
          shirtColor: '#00C496'
        }),
        createdAt: new Date().toISOString()
      };

      const token = signSessionToken({
        userId: adminUser.id,
        username: adminUser.username,
        role: 'admin'
      }, rememberMe ? 30 : 7);

      const response = NextResponse.json({
        success: true,
        user: adminUser,
        token
      });

      response.cookies.set('b2b_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: (rememberMe ? 30 : 7) * 24 * 60 * 60
      });

      return response;
    }

    // 2. Real User Lookup
    const storedUser = db.findUserByUsernameOrEmail(identifier);
    if (!storedUser) {
      return NextResponse.json(
        { success: false, error: 'Invalid username/email or password.' },
        { status: 401 }
      );
    }

    // 3. Password Verification
    if (storedUser.passwordHash) {
      const isValid = verifyPassword(password, storedUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid username/email or password.' },
          { status: 401 }
        );
      }
    } else {
      // If user was created without a hash (e.g. legacy demo user), set their hash now
      storedUser.passwordHash = hashPassword(password);
    }

    const { passwordHash, ...safeUser } = storedUser;

    const expiryDays = rememberMe ? 30 : 7;
    const token = signSessionToken({
      userId: safeUser.id,
      username: safeUser.username,
      role: safeUser.role,
      email: safeUser.email
    }, expiryDays);

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      token,
      message: 'Login successful! Welcome back.'
    });

    response.cookies.set('b2b_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiryDays * 24 * 60 * 60
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Login failed' }, { status: 500 });
  }
}
