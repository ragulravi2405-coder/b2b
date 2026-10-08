import { NextRequest, NextResponse } from 'next/server';
import { generateMaleAvatarSvg } from '@/lib/avatars';
import { StoredUser } from '@/types';
import { db } from '@/lib/store';
import { hashPassword, signSessionToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword, age, orientation, isAdultConfirmed, email } = body;

    if (!username || !username.trim()) {
      return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length < 3) {
      return NextResponse.json({ success: false, error: 'Username must be at least 3 characters long' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }

    if (!isAdultConfirmed) {
      return NextResponse.json({ success: false, error: 'You must confirm that you are 18 years or older to register.' }, { status: 400 });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return NextResponse.json({ success: false, error: 'Access restricted: Platform is strictly for adults (18+).' }, { status: 403 });
    }

    // Check if user already exists
    const existingUser = db.findUserByUsernameOrEmail(cleanUsername);
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Username is already registered. Please choose another or log in.' }, { status: 409 });
    }

    if (email && email.trim()) {
      const existingEmail = db.findUserByUsernameOrEmail(email.trim());
      if (existingEmail) {
        return NextResponse.json({ success: false, error: 'Email is already registered. Please log in.' }, { status: 409 });
      }
    }

    // Hash password securely
    const passwordHash = hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const newUser: StoredUser = {
      id: userId,
      username: cleanUsername,
      email: email?.trim() || undefined,
      age: parsedAge,
      orientation: orientation || 'Member',
      avatar: generateMaleAvatarSvg(cleanUsername, {
        bgGradient: ['#6C3BFF', '#00C496'],
        skinTone: '#D4976A',
        hairColor: '#17152A',
        hairStyle: 'quiff',
        shirtColor: '#FF6B9D'
      }),
      role: 'user',
      passwordHash,
      createdAt: new Date().toISOString()
    };

    const createdUser = db.createUser(newUser);

    // Issue JWT session token
    const token = signSessionToken({
      userId: createdUser.id,
      username: createdUser.username,
      role: createdUser.role,
      email: createdUser.email
    });

    const response = NextResponse.json({
      success: true,
      user: createdUser,
      token,
      message: 'Account created successfully! Welcome to your fresh B2B workspace.'
    });

    // Set HTTP-only secure cookie
    response.cookies.set('b2b_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Registration failed' }, { status: 500 });
  }
}
