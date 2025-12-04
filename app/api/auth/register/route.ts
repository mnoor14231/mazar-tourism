import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: 'البريد الإلكتروني غير صالح' }, { status: 400 });
    }
    
    // Validate username
    if (!username || username.length < 3) {
      return NextResponse.json({ error: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' }, { status: 400 });
    }
    
    // Validate password
    if (!password || password.length < 3) {
      return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 3 أحرف على الأقل' }, { status: 400 });
    }
    
    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUsername) {
      return NextResponse.json({ error: 'اسم المستخدم موجود بالفعل' }, { status: 400 });
    }
    
    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingEmail) {
      return NextResponse.json({ error: 'البريد الإلكتروني موجود بالفعل' }, { status: 400 });
    }
    
    // Create new user (role defaults to "user")
    const user = await prisma.user.create({
      data: {
        username,
        email,
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
    return NextResponse.json({ error: 'فشل التسجيل. حاول مرة أخرى' }, { status: 500 });
  }
}

