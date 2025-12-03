import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE saved route
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.savedRoute.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved route:', error);
    return NextResponse.json({ error: 'Failed to delete route' }, { status: 500 });
  }
}

// PUT update saved route
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const route = await prisma.savedRoute.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(route);
  } catch (error) {
    console.error('Error updating saved route:', error);
    return NextResponse.json({ error: 'Failed to update route' }, { status: 500 });
  }
}

