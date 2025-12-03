import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check if username already exists
    const existing = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }
    
    // Create new user (role defaults to "user")
    const user = await prisma.user.create({
      data: {
        username,
        password, // In production, hash this with bcrypt
        role: 'user',
      },
    });
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

