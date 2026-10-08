import crypto from 'crypto';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.SESSION_SECRET || 'b2b-super-secure-jwt-secret-key-2026-production';

export interface SessionTokenPayload {
  userId: string;
  username: string;
  role: 'user' | 'admin';
  email?: string;
  iat: number;
  exp: number;
}

/**
 * Secure password hashing using Node.js crypto scrypt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verify plaintext password against stored salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKey);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Base64url encode string or buffer
 */
function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Base64url decode
 */
function base64urlDecode(input: string): string {
  let str = input.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Buffer.from(str, 'base64').toString('utf8');
}

/**
 * Sign a JWT session token with HS256
 */
export function signSessionToken(
  payload: { userId: string; username: string; role?: 'user' | 'admin'; email?: string },
  expiresInDays: number = 7
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const exp = now + expiresInDays * 24 * 60 * 60;

  const fullPayload: SessionTokenPayload = {
    userId: payload.userId,
    username: payload.username,
    role: payload.role || 'user',
    email: payload.email,
    iat: now,
    exp
  };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verify a JWT session token and return payload if valid
 */
export function verifySessionToken(token: string): SessionTokenPayload | null {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: SessionTokenPayload = JSON.parse(base64urlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return null; // Token expired
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Extract authenticated user info from NextRequest cookie or Authorization header
 */
export function getAuthUserFromRequest(req: NextRequest): SessionTokenPayload | null {
  // 1. Check HTTP-only cookie
  const cookieToken = req.cookies.get('b2b_session')?.value;
  if (cookieToken) {
    const verified = verifySessionToken(cookieToken);
    if (verified) return verified;
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    const verified = verifySessionToken(bearerToken);
    if (verified) return verified;
  }

  return null;
}
