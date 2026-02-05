import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import dbConnect from './mongodb';
import User from './models/User';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return secret;
}

const TOKEN_NAME = 'mca_token';

export type UserRole = 'admin' | 'manager' | 'broker' | 'user';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    activeOrganizationId: string | null;
  };
  error?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as TokenPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function removeAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_NAME);
  return token?.value || null;
}

export async function getCurrentUser(): Promise<TokenPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}

export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(userRole);
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}

export function isManagerOrAbove(role: UserRole): boolean {
  return role === 'admin' || role === 'manager';
}

export function isBrokerOrAbove(role: string): boolean {
  return role === 'admin' || role === 'manager' || role === 'broker';
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return { success: false, error: 'No authentication cookie' };
    }

    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    const token = cookies[TOKEN_NAME];
    if (!token) {
      return { success: false, error: 'No authentication token' };
    }

    const payload = verifyToken(token);
    if (!payload) {
      return { success: false, error: 'Invalid token' };
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!user.isActive) {
      return { success: false, error: 'User is inactive' };
    }

    return {
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'user',
        activeOrganizationId: user.activeOrganizationId?.toString() || null,
      },
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}
