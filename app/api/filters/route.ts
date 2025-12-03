import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all filter categories with options
export async function GET() {
  try {
    const categories = await prisma.filterCategory.findMany({
      include: {
        options: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
  }
}

// POST create new filter category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { options, ...categoryData } = body;
    
    const category = await prisma.filterCategory.create({
      data: {
        ...categoryData,
        options: {
          create: options || [],
        },
      },
      include: {
        options: true,
      },
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating filter:', error);
    return NextResponse.json({ error: 'Failed to create filter' }, { status: 500 });
  }
}

