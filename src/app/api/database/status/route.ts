import { NextResponse } from 'next/server';
import { connectToDatabase, isMongoConfigured } from '@/lib/mongodb';

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: 'MONGODB_URI is not set in .env.local. Please paste your MongoDB connection string.'
    });
  }

  try {
    const conn = await connectToDatabase();
    if (conn && conn.connection.readyState === 1) {
      return NextResponse.json({
        connected: true,
        configured: true,
        host: conn.connection.host,
        dbName: conn.connection.name,
        message: 'Successfully connected to MongoDB!'
      });
    }

    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'MongoDB connection is not ready.'
    }, { status: 500 });
  } catch (err: any) {
    return NextResponse.json({
      connected: false,
      configured: true,
      error: err.message || 'Failed to connect to MongoDB'
    }, { status: 500 });
  }
}
