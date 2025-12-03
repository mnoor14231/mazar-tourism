import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all reservations (filtered by user if userId provided)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    const reservations = await prisma.reservation.findMany({
      where: userId ? { userId } : undefined,
      include: {
        place: true,
        user: {
          select: {
            id: true,
            username: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}

// POST create new reservation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reservation = await prisma.reservation.create({
      data: body,
      include: {
        place: true,
      },
    });
    
    // Increment bookings count for the place
    await prisma.place.update({
      where: { id: body.placeId },
      data: {
        bookingsCount: {
          increment: body.numberOfPeople || 1,
        },
      },
    });
    
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}

