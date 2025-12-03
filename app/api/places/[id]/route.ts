import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbPlaceToAppPlace, appPlaceToDbPlace } from '@/lib/dbHelpers';

// GET single place
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dbPlace = await prisma.place.findUnique({
      where: { id: params.id },
    });
    
    if (!dbPlace) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 });
    }
    
    const place = dbPlaceToAppPlace(dbPlace);
    return NextResponse.json(place);
  } catch (error) {
    console.error('Error fetching place:', error);
    return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
  }
}

// PUT update place
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const dbData = appPlaceToDbPlace(body);
    const dbPlace = await prisma.place.update({
      where: { id: params.id },
      data: dbData,
    });
    const place = dbPlaceToAppPlace(dbPlace);
    return NextResponse.json(place);
  } catch (error) {
    console.error('Error updating place:', error);
    return NextResponse.json({ error: 'Failed to update place' }, { status: 500 });
  }
}

// DELETE place
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.place.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting place:', error);
    return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
  }
}

