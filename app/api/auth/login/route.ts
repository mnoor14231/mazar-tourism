import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }
    
    // Check password
    if (password !== user.password) {
      return NextResponse.json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' }, { status: 401 });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'فشل تسجيل الدخول. حاول مرة أخرى' }, { status: 500 });
  }
}

