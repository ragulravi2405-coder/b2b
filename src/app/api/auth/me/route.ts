import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserFromRequest } from '@/lib/auth';
import { db } from '@/lib/store';
import { generateMaleAvatarSvg } from '@/lib/avatars';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 401 });
    }

    if (session.userId === 'admin-1' || session.role === 'admin') {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          id: 'admin-1',
          username: session.username || 'Admin',
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

    const user = db.findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
