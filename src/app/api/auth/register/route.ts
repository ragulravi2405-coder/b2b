import { NextRequest, NextResponse } from 'next/server';
import { generateMaleAvatarSvg } from '@/lib/avatars';
import { AuthUser } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword, age, orientation = 'Gay', isAdultConfirmed, email } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, error: 'Passwords do not match' }, { status: 400 });
    }

    if (!isAdultConfirmed) {
      return NextResponse.json({ success: false, error: 'You must confirm that you are 18 years or older to register.' }, { status: 400 });
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 18) {
      return NextResponse.json({ success: false, error: 'Access restricted: Platform is strictly for adults (18+).' }, { status: 403 });
    }

    const newUser: AuthUser = {
      id: `user_${Date.now()}`,
      username: username.trim(),
      email: email?.trim(),
      age: parsedAge,
      orientation: orientation === 'Bisexual' ? 'Bisexual' : 'Gay',
      avatar: generateMaleAvatarSvg(username, {
        bgGradient: ['#6C3BFF', '#00C496'],
        skinTone: '#D4976A',
        hairColor: '#17152A',
        hairStyle: 'quiff',
        shirtColor: '#FF6B9D'
      }),
      role: 'user',
      createdAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Account created successfully. Welcome to B2B!'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
