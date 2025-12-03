import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dbRouteToAppRoute, appRouteToDbRoute } from '@/lib/dbHelpers';

// GET all saved routes (filtered by user if userId provided)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    
    const dbRoutes = await prisma.savedRoute.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    const routes = dbRoutes.map(dbRouteToAppRoute);
    return NextResponse.json(routes);
  } catch (error) {
    console.error('Error fetching saved routes:', error);
    return NextResponse.json({ error: 'Failed to fetch saved routes' }, { status: 500 });
  }
}

// POST create new saved route
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API /api/routes POST] Received route data:', JSON.stringify(body, null, 2));
    
    // Validate required fields
    if (!body.userId) {
      console.error('[API /api/routes POST] Missing userId');
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }
    if (!body.name) {
      console.error('[API /api/routes POST] Missing name');
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (!body.placeIds || !Array.isArray(body.placeIds) || body.placeIds.length === 0) {
      console.error('[API /api/routes POST] Invalid placeIds');
      return NextResponse.json({ error: 'placeIds array is required' }, { status: 400 });
    }

    // Verify user exists
    const userExists = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!userExists) {
      console.error('[API /api/routes POST] User not found:', body.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const dbData = appRouteToDbRoute(body);
    console.log('[API /api/routes POST] Converted to DB data:', JSON.stringify(dbData, null, 2));
    
    const dbRoute = await prisma.savedRoute.create({
      data: dbData,
    });
    console.log('[API /api/routes POST] Route created in DB successfully:', dbRoute.id);
    
    const route = dbRouteToAppRoute(dbRoute);
    return NextResponse.json(route);
  } catch (error: any) {
    console.error('[API /api/routes POST] Error saving route:', error);
    console.error('[API /api/routes POST] Error message:', error.message);
    console.error('[API /api/routes POST] Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to save route', 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

