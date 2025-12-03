import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { username },
    });
    
    // If user doesn't exist, create new account (auto-registration for easy testing)
    if (!user) {
      console.log(`Creating new user: ${username}`);
      user = await prisma.user.create({
        data: {
          username,
          password, // In production, hash this with bcrypt
          role: 'user', // New users are regular users by default
        },
      });
      console.log(`New user created: ${username} with role: ${user.role}`);
    } else {
      // If user exists, check password
      if (password !== user.password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}

