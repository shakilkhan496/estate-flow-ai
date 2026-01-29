import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const { email, password, name } = await request.json();
    
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await hashPassword(password);
    
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';
    
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    });
    
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    
    await setAuthCookie(token);
    
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
