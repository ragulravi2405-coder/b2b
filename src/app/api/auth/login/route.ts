import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_DEMO_USER } from '@/lib/data';
import { generateMaleAvatarSvg } from '@/lib/avatars';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    // Admin login check
    if (username.toLowerCase() === 'admin' && (password === 'admin123' || password === 'admin')) {
      return NextResponse.json({
        success: true,
        user: {
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
        }
      });
    }

    // Default demo user or session user
    const user = {
      ...DEFAULT_DEMO_USER,
      username: username.trim()
    };

    return NextResponse.json({
      success: true,
      user
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
