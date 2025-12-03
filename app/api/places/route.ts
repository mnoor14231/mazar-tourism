import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbPlaceToAppPlace, appPlaceToDbPlace } from '@/lib/dbHelpers';

// GET all places
export async function GET() {
  try {
    const dbPlaces = await prisma.place.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const places = dbPlaces.map(dbPlaceToAppPlace);
    return NextResponse.json(places);
  } catch (error) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
  }
}

// POST create new place
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dbData = appPlaceToDbPlace(body);
    const dbPlace = await prisma.place.create({
      data: dbData,
    });
    const place = dbPlaceToAppPlace(dbPlace);
    return NextResponse.json(place);
  } catch (error) {
    console.error('Error creating place:', error);
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 });
  }
}

